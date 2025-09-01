import axios from 'axios';

const IMGBB_API_KEY = 'd137010d270eb5ddf7b690ab24b40828';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url: string;
    display_url: string;
    size: number;
    delete_url: string;
    time: string;
  };
  success: boolean;
  status: number;
}

export const uploadImageToImgBB = async (file: File): Promise<ImgBBResponse> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', IMGBB_API_KEY);

  try {
    const response = await axios.post<ImgBBResponse>(IMGBB_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading image to ImgBB:', error);
    throw new Error('Failed to upload image');
  }
}; 