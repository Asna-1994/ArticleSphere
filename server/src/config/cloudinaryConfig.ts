import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import { CustomError } from '../middlewares/errorHandler';
import { STATUSCODE } from '../constants/StatusCodes';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new CustomError(
          'Invalid file type. Only JPEG, PNG are allowed.',
          STATUSCODE.BAD_REQUEST
        )
      );
    }
  },
});

const uploadToCloudinary = async (filePath: string, folder: string) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
  });
  await fs.unlink(filePath);
  return {
    url  :result.secure_url,
    publicId : result.public_id
  }
};

const deleteFromCloudinary = async (public_id: string) => {
    return await cloudinary.uploader.destroy(public_id);
  };

export { upload, uploadToCloudinary, cloudinary, deleteFromCloudinary };
