import api from './axiosConfig';

const NoteService = {
  getAll:         ()             => api.get('/notes').then(r => r.data),
  getById:        (id)           => api.get(`/notes/${id}`).then(r => r.data),
  create:         (data)         => api.post('/notes', data).then(r => r.data),
  update:         (id, data)     => api.put(`/notes/${id}`, data).then(r => r.data),
  delete:         (id)           => api.delete(`/notes/${id}`),
};

export default NoteService;
