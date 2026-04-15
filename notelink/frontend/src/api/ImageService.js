import api from './axiosConfig';

const ImageService = {
  getForNote: (noteId) =>
    api.get(`/notes/${noteId}/images`).then(r => r.data),

  upload: (noteId, file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post(`/notes/${noteId}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  delete: (noteId, imageId) =>
    api.delete(`/notes/${noteId}/images/${imageId}`),
};

export default ImageService;
