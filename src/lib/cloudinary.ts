import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

export const avatarUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      //   folder: 'whatsapp/users/avatars',
    },
  }) as multer.StorageEngine,
}).single("avatar");
