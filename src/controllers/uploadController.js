import { create } from '@web3-storage/w3up-client';

let client;
(async () => {
    client = await create();
    const space = await client.createSpace('hameed_storage');
    const myAccount = await client.login('hameedsk381@gmail.com');
    await myAccount.provision(space.did());
    await space.save();
    const recovery = await space.createRecovery(myAccount.did());
    await client.capability.access.delegate({
      space: space.did(),
      delegations: [recovery],
    });
  })();

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const fileData = req.file.buffer;
    const fileName = req.file.originalname;
    const file = new File([fileData], fileName);

    const fileCid = await client.uploadFile(file);
    console.log('Uploaded file CID:', fileCid);
    res.send(`https://${fileCid}.ipfs.w3s.link/`);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
};
