import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from './response.dto';

export class ErrorResponseDto extends ResponseDto {
  @ApiProperty()
  data = null;
}
