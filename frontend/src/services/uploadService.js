import api from './api';

const uploadService = {
  // X-ray පින්තූරය යවා AI ප්‍රතිඵලය ලබා ගැනීම
  predictStone: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile); // Backend එකේ 'upload.single("image")' නිසා නම "image" විය යුතුයි

    try {
      // පින්තූර යවනකොට Content-Type එක වෙනස් වෙනවා
      const response = await api.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default uploadService;