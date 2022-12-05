import { ApiProperty } from '@nestjs/swagger';
import { MetaResponseDto } from './meta-response.dto';

export class ResponseDto {
  @ApiProperty()
  readonly meta: MetaResponseDto;

  @ApiProperty()
  readonly data: any;

  constructor(data: any, meta: MetaResponseDto) {
    this.meta = meta;
    this.data = data;
  }
}
