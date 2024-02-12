const AWS = require('aws-sdk');

const SES_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

const AWS_SES = new AWS.SES(SES_CONFIG);

const sendEmail = ({
  sendingData,
  email = process.env.SES_EMAIL,
  sendingMessageTemplate = 'Hello your verification code is:'
}) => {
  const params = {
    Source: process.env.SES_EMAIL,
    Destination: {
      ToAddresses: [
        email
      ],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: 'This is the body of my email!',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `${sendingMessageTemplate} ${sendingData}`,
      }
    },
  };
  return AWS_SES.sendEmail(params).promise();
};

module.exports = {
  sendEmail
};
