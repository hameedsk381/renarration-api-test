import express from 'express';
import {
  createRenarration,
  getAllRenarrations,
  getRenarrationById,
  updateRenarrationById,
  deleteRenarrationById,
  verifySharing
} from '../controllers/renarrationController.js';

const RenarrationRouter = express.Router();

RenarrationRouter.post('/create-renarration', createRenarration);
RenarrationRouter.get('/renarrations', getAllRenarrations);
RenarrationRouter.get('/renarrations/:id', getRenarrationById);
RenarrationRouter.put('/renarrations/:id', updateRenarrationById);
RenarrationRouter.delete('/renarrations/:id', deleteRenarrationById);
RenarrationRouter.post('/verify-sharing', verifySharing);

export default RenarrationRouter;
