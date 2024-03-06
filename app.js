// Import Fastify instead of Express
import Fastify from 'fastify';
import dotenv from 'dotenv';
// Fastify has built-in support for CORS, so no need for a separate package
import connectDB from './src/config/db.js';
import fetchRouter from './src/routes/fetchRouter.js';
import RenarrationRouter from './src/routes/RenarrationRouter.js';
import uploadRouter from './src/routes/uploadRouter.js';
import cors from '@fastify/cors';
import { create } from '@web3-storage/w3up-client';
// Initialize dotenv
dotenv.config();
// Create a Fastify instance
const fastify = Fastify();

await fastify.register(cors, {
  // put your options here
});
fastify.register(import('@fastify/multipart'));
// Connect to the database
connectDB();


let client;
(async () => {
  client = await create();
  const space = await client.createSpace(process.env.SPACE_NAME);
  const myAccount = await client.login(process.env.MAIL);
  await myAccount.provision(space.did());
  await space.save();
  const recovery = await space.createRecovery(myAccount.did());
  await client.capability.access.delegate({
    space: space.did(),
    delegations: [recovery],
  });
})();


// Fastify uses the `content type parser` to parse the body. By default, it can handle JSON.
// No explicit express.json() middleware equivalent is required.

// Define routes
fastify.get('/', async (request, reply) => {
  return 'Welcome to the Renarration API';
});

// Register your routes or route files. Note that route registration syntax is different in Fastify.
// You might need to adapt your routers to be compatible with Fastify's structure.
// This often involves exporting functions that take a Fastify instance as an argument and then calling the `.route` or `.get/post/etc.` methods on it.
// For example:
fastify.register(RenarrationRouter, { prefix: '/sweets' });
fastify.register(fetchRouter, { prefix: '/download' });
fastify.register(uploadRouter, { prefix: '/upload' });

// Listen to the server on the specified port
const startServer = async () => {
  if (!client) {
    console.log("Waiting for client initialization...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simple retry logic
    return startServer(); // Retry starting the server
  }

  try {
    const port = process.env.PORT || 4000;
    fastify.listen({ port });
    fastify.log.info(`Server is running on port: ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
