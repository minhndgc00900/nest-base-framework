import { HttpException, ArgumentsHost, ExceptionFilter, Catch, BadRequestException, ValidationError } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { LoggerFactory } from '../core/shared/services/logger.service';
import { ErrorResponseDto } from '@/common/dtos/error-response.dto';
import { AppException } from '@/exceptions/app-exception';
import { ResponseCode, ResponseText } from '@/common/enum';
import { MetaResponseDto } from '@/common/dtos/meta-response.dto';
import { ErrorCode, SuccessCode } from '@/common/codes';
import { ResponseDto } from '@/common/dtos/response.dto';
import { ErrorMessage } from '@/common/codes/error-message';

@Catch(AppException, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = LoggerFactory.create(this.constructor.name);

  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException | AppException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();

    let statusCode = 200;
    let resCode: number;
    let responseMess: string;

    // tslint:disable-next-line: no-string-literal
    const lang = request['i18nLang'];
    if (exception instanceof AppException) {
      resCode = exception.code;
      responseMess = await this.i18n.translate(`errors.${exception.message}`, { lang });
    } else if (exception instanceof HttpException) {
      resCode = ErrorCode.BAD_REQUEST;
      responseMess = await this.i18n.translate(`errors.${exception.message}`, { lang });
    } else {
      statusCode = 500;
      resCode = ResponseCode.HTTP_ERROR;
      responseMess = await this.i18n.translate(`errors.UNDEFINED_ERROR`, { lang });
    }

    this.logger.error(exception.message, {
      requestUrl: request.url,
      method: request.method,
      headers: request.headers,
      body: request.body,
      exception,
    });

    const metaResponse = new MetaResponseDto(resCode, ResponseText.ERROR, responseMess);

    response.status(statusCode).json(new ResponseDto(null, metaResponse));
  }
}
