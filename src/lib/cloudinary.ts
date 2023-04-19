import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

export const avatarUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "whatsapp/users/avatars",
    } as { folder: string },
  }),
}).single("avatar");

export const imageUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "whatsapp/chats/images",
    } as { folder: string },
  }),
}).single("image");
