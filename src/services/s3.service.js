const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { VideoNotAddedToS3, VideoDidNotDeleteFromS3 } = require('./errors.service');

const s3 = new AWS.S3({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY, apiVersion: '2006-03-01' });

const createS3Params = ({ fileName, filePath, metaDataObject }) => ({
  Bucket: process.env.BUCKET_NAME,
  Key: `${uuidv4()}_${fileName}`,
  Body: fs.createReadStream(filePath),
  ContentDisposition: 'inline',
  ContentType: 'video/mp4',
  Metadata: metaDataObject
});

const s3Service = {
  putObject: async ({ fileName, filePath, metaDataObject }) => {
    try {
      const params = createS3Params({ fileName, filePath, metaDataObject });
      await s3
        .putObject(params)
        .promise();
      const { Key } = params;
      return {
        Key
      };
    } catch (error) {
      throw new VideoNotAddedToS3();
    }
  },
  deleteObject: async ({ Bucket, Key }) => {
    try {
      return s3
        .deleteObject({ Bucket, Key })
        .promise();
    } catch (error) {
      throw new VideoDidNotDeleteFromS3();
    }
  }
};

module.exports = s3Service;
