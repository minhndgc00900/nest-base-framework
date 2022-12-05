import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '@khanh.tran/nestjs-crud-base';
export class MetaResponseDto {
  @ApiProperty()
  readonly code: number;

  @ApiProperty()
  readonly status: string;

  @ApiProperty()
  readonly message: string;

  @ApiProperty()
  readonly pagination: PaginationMetaDto;

  constructor(code: number, status: string, message: string = null, pagination: PaginationMetaDto = null) {
    this.code = code;
    this.status = status;
    this.message = message;
    this.pagination = pagination;
  }
}
