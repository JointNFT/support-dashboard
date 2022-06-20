const AWS = require("aws-sdk");

console.log(process.env.AWS_ACCESS_KEY);
console.log(process.env.AWS_SECRET_ACCESS_KEY);

// Update AWS config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY, // Do NOT HARD-CODE your secret credentials here
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Do NOT HARD-CODE your secret credentials here
  region: "ap-south-1",
});

// Create DynamoDB service object
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "latest" });

module.exports = {db};
