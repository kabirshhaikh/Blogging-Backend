const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: "AKIA4MTWNO7RVOEA3DSZ",
  secretAccessKey: "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",
  region: "us-east-1",
});

const s3 = new AWS.S3();

module.exports = s3;
