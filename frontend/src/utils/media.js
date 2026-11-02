import { BASE_URL } from "@/config";

const CLOUDINARY_BASE = "https://res.cloudinary.com/dcdmxqiuv/image/upload/";

// Ask Cloudinary for a resized, auto-format (WebP/AVIF) and auto-quality copy
// instead of the original upload. c_limit never upscales smaller images.
const optimizeCloudinary = (url, width) => {
  if (!width || !url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
};

export const normalizePicture = (pic, width = 160) => {
  if (!pic) return "/default-profile.png";

  // If pic is an object with a url property (new backend format)
  if (typeof pic === "object" && pic.url) {
    pic = pic.url;
  }

  if (typeof pic !== "string") return "/default-profile.png";

  // If pic is already a URL string
  if (pic.startsWith("http")) {
    return optimizeCloudinary(pic, width);
  }

  // Otherwise treat it as relative path from backend
  return `${BASE_URL}${pic}`;
};

export const normalizeMedia = (media, width = 1200) => {
  if (!media) return "";

  // if media is an object with a url property
  if (typeof media === "object" && media.url) {
    media = media.url;
  }

  if (typeof media !== "string") return "";

  if (media.startsWith("http")) return optimizeCloudinary(media, width);

  return optimizeCloudinary(`${CLOUDINARY_BASE}${media}`, width);
};
