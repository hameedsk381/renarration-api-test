// src/routes/renarrationRoutes.js
import {
  createRenarration,
  getAllRenarrations,
  getRenarrationById,
  updateRenarrationById,
  deleteRenarrationById,
  verifySharing
} from '../controllers/renarrationController.js';

export default function (fastify, options, done) {
  // Define child routes
  fastify.post('/create-renarration', createRenarration);
  fastify.get('/renarrations', getAllRenarrations);
  fastify.get('/renarrations/:id', getRenarrationById);
  fastify.put('/renarrations/:id', updateRenarrationById);
  fastify.delete('/renarrations/:id', deleteRenarrationById);
  fastify.post('/verify-sharing', verifySharing);

  done();
}
