// src/routes/fetchRoutes.js
import { downloadContent } from '../controllers/fetchHtmlController.js';

export default function (fastify, options, done) {
  fastify.post('/', downloadContent);
  done();
}
