const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `students/${Date.now()}_${file.originalname}`);
    },
  }),
});

const deleteFileFromS3 = async (fileUrl) => {
  try {
    if (!fileUrl) return;
    const urlObj = new URL(fileUrl);
    const fileKey = decodeURIComponent(urlObj.pathname.substring(1)); // Remove leading '/'
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      key: fileKey,
    };
    await s3.send(new DeleteObjectCommand(deleteParams));
    console.log("Purani file S3 se successfully delete ho gayi hai.");
  } catch (error) {
    console.error("Error deleting file from S3:", error);
  }
};

module.exports = { upload, deleteFileFromS3 };
