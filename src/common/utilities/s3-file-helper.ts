import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3FileHelper {
  private s3 = new S3();

  async uploadPublicFile(
    bucketName: string,
    fileName: string,
    dataBuffer: Buffer,
  ) {
    const uploadResult = await this.s3
      .upload({
        Bucket: bucketName,
        Key: fileName,
        Body: dataBuffer,
      })
      .promise();
    return uploadResult;
  }

  async getPublicFile(bucketName: string, fileName: string) {
    return await this.s3
      .getObject({ Bucket: bucketName, Key: fileName })
      .promise()
      .then((output) => {
        return output.Body.toString();
      })
      .catch((error) => {
        console.log(error);
        if (error.statusCode === 404) {
          return null;
        }
      });
  }
}
