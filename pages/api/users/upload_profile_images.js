import nc from 'next-connect';
import { S3Client } from "@aws-sdk/client-s3";
import multer from 'multer';
import multerS3 from 'multer-s3';

const handler = nc();

const s3 = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'eu-central-1'
});

const upload = (bucketName) => multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, res, cb) {
      cb(null, 'image/*');
    }
  })
});

handler.put((req, res) => {
  const uploadSingle = upload('electricons-upload-image').single('image-upload');
  
  uploadSingle(req, res, (error) => {
    if (error) return res.status(400).json({ success: false, message: error.message });


    console.log(req);

    res.status(200).json({ success: true, message: 'File uploaded successfully' });
  });
});

export default handler;
