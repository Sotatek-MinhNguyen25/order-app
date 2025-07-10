import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AUTH_CONSTANTS } from './constants/auth.constant';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) { }

  @MessagePattern(AUTH_CONSTANTS.GATEWAY.CONTROLLER.AUTH_REGISTER)
  async register(@Payload() body: RegisterDto) {
    this.logger.log('AUTH_REGISTER');
    return this.authService.register(body);
  }

  @MessagePattern(AUTH_CONSTANTS.GATEWAY.CONTROLLER.AUTH_LOGIN)
  async login(@Payload() body: LoginDto) {
    this.logger.log('AUTH_LOGIN');
    return this.authService.login(body);
  }

  @MessagePattern(AUTH_CONSTANTS.GATEWAY.CONTROLLER.AUTH_REFRESH_TOKEN)
  async refreshToken(@Payload() body: RefreshTokenDto) {
    this.logger.log('AUTH_REFRESH_TOKEN');
    return this.authService.refreshToken(body);
  }

  @MessagePattern(AUTH_CONSTANTS.GATEWAY.SERVICE.AUTH.CHECK_USER)
  async checkUser(@Payload() data: { userId: string; email: string }) {
    this.logger.log(`AUTH.CHECK_USER - ${data.userId}`);
    return this.authService.checkUser(data.userId, data.email);
  }
}
