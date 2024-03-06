

  export const uploadFile = async (request, reply) => {
    const data = await request.file();
    if (!data.file) {
      return reply.code(400).send('No file uploaded.');
    }
  
    try {
      const fileData = await data.toBuffer();
      const fileName = data.filename;
      // Assuming File API is available, or use an equivalent Blob/File constructor alternative
      const file = new File([fileData], fileName); 
  
      const fileCid = await client.uploadFile(file);
      console.log('Uploaded file CID:', fileCid);
      reply.send(`https://${fileCid}.ipfs.w3s.link/`);
    } catch (error) {
      console.error('Error uploading file:', error);
      reply.code(500).send('Error uploading file');
    }
  };
  
