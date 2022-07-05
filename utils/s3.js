const AWS = require("aws-sdk");

const multer = require('multer');
const multerS3 = require('multer-s3');


const S3_BUCKET = 'the-organization-logo';
const REGION = 'ap-south-1';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  params: { Bucket: S3_BUCKET },
  region: REGION,
})


var uploadLogo = multer({
  storage: multerS3({
      s3: s3,
      acl: 'public-read',
      bucket: S3_BUCKET,
      key: function (req, file, cb) {
          console.log(file);
          cb(null, file.fieldname + '-' + Date.now()); 
      }
  })
});

module.exports = {uploadLogo};
