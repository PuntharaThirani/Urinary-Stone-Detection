import { uploadXray, predictStone, uploadAndPredict } from './api';

const uploadService = {
  // Step 1 — Upload X-ray image
  uploadXray: async (imageFile) => {
    try {
      return await uploadXray(imageFile);
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Step 2 — Run AI prediction with uploaded path
  predictStone: async (imagePath) => {
    try {
      return await predictStone(imagePath);
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Combined — Upload + Predict in one call
  uploadAndPredict: async (imageFile) => {
    try {
      return await uploadAndPredict(imageFile);
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};

export default uploadService;