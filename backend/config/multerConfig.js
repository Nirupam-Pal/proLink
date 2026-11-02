import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "proconnect_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "gif", "mp4", "mov", "pdf", "doc", "docx"],
  },
});

const upload = multer({ storage });
export default upload;
