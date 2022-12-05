import { SuccessCode } from '@/common/codes';
import { MetaResponseDto } from '@/common/dtos/meta-response.dto';
import { TenantBaseAppEntity, PaginationDto, PaginationDtoParams, PaginationMetaDto } from '@khanh.tran/nestjs-crud-base';
import { ResponseDto } from '@/common/dtos/response.dto';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<ResponseDto> {
  // private logger = LoggerFactory.create(this.constructor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto> {
    // const req = context.switchToHttp().getRequest();

    // if(req.headers.requestId)
    //   this.logger.log(`requestId: ${req.headers.requestId} - Path: ${req.url}`)
    // else {
    //   const uid = uuidv4();
    //   const res = context.switchToHttp().getResponse();
    //   res.setHeader('requestId', uid );
    //   this.logger.log(`requestId: ${uid} - Path: ${req.url}`)
    // }

    return next.handle().pipe(
      map(data => {
        let responseData = data;
        let paginationMeta = null;
        // Pagination dto will be returned by controller along with list data
        if (data && (data as PaginationDto<TenantBaseAppEntity>).meta) {
          responseData = (data as PaginationDto<TenantBaseAppEntity>).data;
          paginationMeta = new PaginationMetaDto((data as PaginationDto<TenantBaseAppEntity>).meta as PaginationDtoParams);
        }

        const responseMeta = new MetaResponseDto(SuccessCode.SUCCESS, 'Success', '', paginationMeta);

        return new ResponseDto(responseData, responseMeta);
      }),
    );
  }
}
