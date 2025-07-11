import { GetListDto } from './get-list.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetListWithUserDto extends GetListDto {
    @IsString()
    userId: string;
}
