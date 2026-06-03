import * as Minio from 'minio';
import config from '../config';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/minio.log' }),
  ],
});

/**
 * MinIO 客户端
 */
const minioClient = new Minio.Client({
  endPoint: config.minio.endPoint,
  port: config.minio.port,
  useSSL: config.minio.useSSL,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});

/**
 * 确保存储桶存在
 */
export async function ensureBucketExists(): Promise<void> {
  try {
    const bucketExists = await minioClient.bucketExists(config.minio.bucket);
    if (!bucketExists) {
      await minioClient.makeBucket(config.minio.bucket, 'ap-northeast-1');
      logger.info('Bucket created', { bucket: config.minio.bucket });
    }

    // 设置存储桶策略为公开读取 (用于 CDN 分发)
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: '*' },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${config.minio.bucket}/*`],
        },
      ],
    };

    try {
      await minioClient.setBucketPolicy(config.minio.bucket, JSON.stringify(policy));
      logger.info('Bucket policy set to public read');
    } catch (policyError) {
      logger.warn('Failed to set bucket policy', { error: policyError });
    }
  } catch (error) {
    logger.error('Failed to ensure bucket exists', { error });
    throw error;
  }
}

/**
 * 生成预签名上传 URL
 */
export async function getPresignedUploadUrl(
  objectName: string,
  expiresInSeconds = 3600
): Promise<string> {
  try {
    return await minioClient.presignedPutObject(
      config.minio.bucket,
      objectName,
      expiresInSeconds
    );
  } catch (error) {
    logger.error('Failed to generate presigned upload URL', { error, objectName });
    throw error;
  }
}

/**
 * 生成预签名下载 URL
 */
export async function getPresignedDownloadUrl(
  objectName: string,
  expiresInSeconds = 3600
): Promise<string> {
  try {
    return await minioClient.presignedGetObject(
      config.minio.bucket,
      objectName,
      expiresInSeconds
    );
  } catch (error) {
    logger.error('Failed to generate presigned download URL', { error, objectName });
    throw error;
  }
}

/**
 * 上传文件
 */
export async function uploadFile(
  objectName: string,
  file: Buffer,
  contentType: string
): Promise<void> {
  try {
    await minioClient.putObject(config.minio.bucket, objectName, file, {
      'Content-Type': contentType,
    });
    logger.info('File uploaded successfully', { objectName, size: file.length });
  } catch (error) {
    logger.error('Failed to upload file', { error, objectName });
    throw error;
  }
}

/**
 * 删除文件
 */
export async function deleteFile(objectName: string): Promise<void> {
  try {
    await minioClient.removeObject(config.minio.bucket, objectName);
    logger.info('File deleted successfully', { objectName });
  } catch (error) {
    logger.error('Failed to delete file', { error, objectName });
    throw error;
  }
}

/**
 * 获取文件信息
 */
export async function getFileInfo(objectName: string): Promise<Minio.BucketStream> {
  try {
    return await minioClient.getObject(config.minio.bucket, objectName);
  } catch (error) {
    logger.error('Failed to get file info', { error, objectName });
    throw error;
  }
}

export default minioClient;
