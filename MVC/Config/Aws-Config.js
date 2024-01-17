const AWS = require("aws-sdk");
require("dotenv").config();

const ACCESSKEYID = process.env.accessKeyId;
const SECRETACCESSKEY = process.env.secretAccessKey;
const REGION = process.env.regionForPostImages;

AWS.config.update({
  accessKeyId: ACCESSKEYID,
  secretAccessKey: SECRETACCESSKEY,
  region: REGION,
});

const s3 = new AWS.S3();

module.exports = s3;
