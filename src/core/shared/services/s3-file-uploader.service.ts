import * as JWT from 'jsonwebtoken';
import * as Mime from 'mime-types';
import * as Path from 'path';
import * as Url from 'url';
import * as moment from 'moment';
import * as uuid from 'uuid';
import { S3 } from 'aws-sdk';
import { ConfigService, S3Config } from './config.service';

const s3Expire7Day = 604800;

export interface UploadInfo {
  uploadUrl: string;
  uploadToken: string;
}

export interface UploadResult {
  success: boolean;
  path: string;
}

export interface UploadParams {
  userId: string | number;
  serviceName: string;
  extension?: string;
  name?: string;
  directory?: string;
}

export interface AWSS3Options {
  accessKey: string;
  secretKey: string;
  region: string;
  bucket: string;
  expire?: number;
  baseUrl: string;
}

export enum ThumbSize {
  SMALL = '100x100',
  MEDIUM = '512x512',
  LARGE = '1080x1080',
}

export class AWSS3FileUploader {
  private readonly s3: S3;
  private readonly options: S3Config;

  constructor(private readonly confService: ConfigService) {
    this.s3 = new S3();
    this.options = this.confService.aws;

    this.s3.config.update({
      accessKeyId: this.options.key,
      secretAccessKey: this.options.secret,
      region: this.options.region,
    });
  }

  protected getTempUploadPath(params: UploadParams): string {
    const currentDateString = moment().utc().format('YYYY-MM-DD');
    const fileName = params.name ? params.name : uuid.v4();
    return `tmp/${currentDateString}/${fileName}`;
  }

  protected getUploadPath(params: UploadParams): string {
    const fileName = params.name ? params.name : uuid.v4();
    const directory = params.directory ? params.directory : 'file';

    const fullPath = `${params.userId}/${params.serviceName}/${directory}/${fileName}`;
    if (params.extension) {
      return fullPath + '.' + params.extension.toLowerCase();
    }
    return fullPath;
  }

  public async generate(params: UploadParams): Promise<UploadInfo> {
    const tmpPath = this.getTempUploadPath(params);
    const uploadPath = this.getUploadPath(params);
    const uploadUrl = await this.getS3SignedUploadUrl(tmpPath);
    const uploadToken = JWT.sign({ tmp: tmpPath, path: uploadPath }, this.options.secret, { expiresIn: '7d' });

    return { uploadUrl, uploadToken };
  }

  public async finishUpload(token: string): Promise<UploadResult> {
    const decoded: any = JWT.verify(token, this.options.secret);
    const tmp: string = decoded.tmp;
    const path: string = decoded.path;
    await this.move(tmp, path);

    return { success: true, path };
  }

  public async deleteFile(path: string) {
    const bucket = this.options.bucket;
    const deleteParams = {
      Bucket: bucket,
      Key: path,
    };

    await this.s3.deleteObject(deleteParams).promise();
  }

  private async getS3SignedUploadUrl(path: string) {
    const bucket = this.options.bucket;
    const extension = Path.extname(path);
    const contentType = Mime.lookup(extension) || 'application/octet-stream';

    const params = {
      Bucket: bucket,
      Key: path,
      ContentType: contentType,
    };

    return this.s3.getSignedUrlPromise('putObject', params);
  }

  public async getS3SignedGetUrl(path: string) {
    const bucket = this.options.bucket;

    const params = {
      Bucket: bucket,
      Key: path,
      Expires: this.options.expire || s3Expire7Day,
    };

    return this.s3.getSignedUrlPromise('getObject', params);
  }

  private async move(path: string, newPath: string) {
    const bucket = this.options.bucket;
    const copyParams = {
      Bucket: bucket,
      CopySource: encodeURI('/' + bucket + '/' + path),
      Key: newPath,
    };
    await this.s3.copyObject(copyParams).promise();

    const deleteParams = {
      Bucket: bucket,
      Key: path,
    };

    await this.s3.deleteObject(deleteParams).promise();
  }

  public async getUrl(path: string) {
    if (!path) {
      return null;
    }

    const url = Url.parse(path);
    if (url.host) {
      return path;
    }
    return `${this.options.s3url}${path}`;
  }
}
