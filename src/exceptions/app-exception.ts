import { ErrorMessage } from 'aws-sdk/clients/cloudformation';
import { ErrorCode } from '../common/codes';
export class AppException implements Error {
  public data: string | unknown;
  public message: string;
  public code: number;
  public name = '';
  public stack?: string;

  constructor(errorCode: ErrorCode, message?: ErrorMessage, errorData?: string | unknown) {
    this.code = errorCode;
    this.data = errorData;
    this.message = message;
  }

  static error(errorCode: ErrorCode, message?: ErrorMessage, errorData?: unknown): AppException {
    return new AppException(errorCode, message, errorData);
  }
}
