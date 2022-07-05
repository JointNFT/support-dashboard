const AWS = require("aws-sdk");
const fetch = require('node-fetch');
const fs = require("fs");
const path = require('path');

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

const uploadImage = async (imageURL, organizationId, imageName) => {
  const res = await fetch(imageURL)
  console.log(imageURL)
  console.log(res);
  const blob = await res.buffer()
  console.log(blob)
  const key = JSON.stringify(organizationId)

  const uploadedImage = await s3.upload({
    Bucket: S3_BUCKET,
    Key: key + ".png",
    Body: imageURL,
    ContentType: 'image/png/jpg/jpeg',
  }).promise()

  return (uploadedImage.Location);
}



module.exports = { uploadImage, uploadLogo};
