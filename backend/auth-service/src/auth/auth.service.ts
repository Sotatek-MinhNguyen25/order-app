import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { IUser } from './entities/user.interface';
import { authConfig } from 'src/configs/config.service';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  private async generatePairToken(payload: IUser) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: authConfig.AC_TOKEN_EXPIRED,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: authConfig.RF_TOKEN_EXPIRED,
    });
    return { accessToken, refreshToken };
  }

  async register(body: RegisterDto) {
    const { password, email } = body;

    const user = await this.userRepository.findOne({ where: [{ email }] });
    if (user) {
      throw new RpcException({
        statusCode: 400,
        message: 'USER.ALREADY_EXISTS',
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...body,
      password: hashPassword,
    });
    const savedUser = await this.userRepository.save(newUser);

    const payload: IUser = {
      userId: savedUser.id,
      email: savedUser.email,
    };

    const { accessToken, refreshToken } = await this.generatePairToken(payload);
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userRepository.update(savedUser.id, {
      refreshToken: hashRefreshToken,
    });

    return {
      data: {
        user: _.pick(savedUser, ['email', 'name', 'createdAt', 'updatedAt']),
        accessToken,
        refreshToken,
      },
    };
  }

  async login(body: LoginDto) {
    const { email, password } = body;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new RpcException({
        statusCode: 400,
        message: 'LOGIN.INVALID_CREDENTIALS',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new RpcException({
        statusCode: 400,
        message: 'LOGIN.INVALID_CREDENTIALS',
      });
    }

    const payload: IUser = {
      userId: user.id,
      email: user.email,
    };

    const { accessToken, refreshToken } = await this.generatePairToken(payload);
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userRepository.update(user.id, {
      refreshToken: hashRefreshToken,
    });

    return {
      data: {
        user: _.pick(user, ['email', 'name', 'createdAt', 'updatedAt']),
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(body: RefreshTokenDto) {
    const { refreshToken } = body;
    let payload: IUser;
    try {
      payload = await this.jwtService.verifyAsync<IUser>(refreshToken);
    } catch (err) {
      throw new RpcException({
        statusCode: 401,
        message: 'REFRESH_TOKEN.INVALID_OR_EXPIRED',
      });
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new RpcException({
        statusCode: 401,
        message: 'USER.NOT_FOUND',
      });
    }

    if (!user.refreshToken) {
      throw new RpcException({
        statusCode: 401,
        message: 'USER.REFRESH_TOKEN_NOT_FOUND',
      });
    }
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch)
      throw new RpcException({
        statusCode: 401,
        message: 'PASSWORd.NOT_MATCH',
      });

    const newPayload: IUser = {
      userId: user.id,
      email: user.email,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generatePairToken(newPayload);
    const hashRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.userRepository.update(user.id, {
      refreshToken: hashRefreshToken,
    });

    return {
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  async checkUser(userId: string, email: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId, email: email },
    });

    return user ?? null
  }
}
