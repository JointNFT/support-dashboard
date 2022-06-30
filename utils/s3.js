const AWS = require("aws-sdk");
const fetch = require('node-fetch');

const S3_BUCKET = 'the-organization-logo';
const REGION = 'ap-south-1';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  params: { Bucket: S3_BUCKET },
  region: REGION,
})

const uploadImage = async (imageURL, address) => {
  const res = await fetch(imageURL)
  const blob = await res.buffer()
  const key = address

  const uploadedImage = await s3.upload({
    Bucket: S3_BUCKET,
    Key: key,
    Body: blob,
  }).promise()

  return (uploadedImage.Location);
}

const getImage = async (key) => {
 const file = await s3.getObject({ Bucket: S3_BUCKET, Key: key }).promise()
 console.log(file);
 return {
  data: file.Body,
  mimetype: file.ContentType
 }
}
module.exports = { uploadImage };
