import api from './axiosConfig';

const RelationshipService = {
  getAll:       ()              => api.get('/relationships').then(r => r.data),
  getForNote:   (noteId)        => api.get(`/relationships/note/${noteId}`).then(r => r.data),
  create:       (data)          => api.post('/relationships', data).then(r => r.data),
  delete:       (id)            => api.delete(`/relationships/${id}`),
};

export default RelationshipService;
