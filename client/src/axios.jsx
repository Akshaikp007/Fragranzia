import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


export const BASE_URL = apiUrl;
export const MEDIA_URL = "";

export const getImageUrl = (image) => {
  if (!image) return "https://via.placeholder.com/150";
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${BASE_URL}/uploads/${image}`;
};


export const axiosPrivate = axios.create({
  baseURL: BASE_URL
});