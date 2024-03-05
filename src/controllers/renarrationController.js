import { Renarration, Block } from '../models/Renarration.js';
import { v4 as uuidv4 } from 'uuid';

export const createRenarration = async (req, res) => {
    try {
        const formData = req.body;
      // Create a new renarration document
      const blocks = [];
      const sharingId = uuidv4();
      // Create a new block document for each block in the renarration
      for (const block of formData.blocks) {
          const newBlock = await Block.create({ ...block });
          blocks.push(newBlock._id); // Add the reference to the block in the blocks array
      }
      formData.blocks = blocks; // Update formData with block references
      await Renarration.create({ ...formData, sharingId });

      res.status(201).json({
          message: "Renarration created successfully",
          sharingId
      });
    } catch (error) {
        console.error('Error creating renarration:', error);
        res.status(500).send('Error creating renarration');
    }
};

export const getAllRenarrations = async (req, res) => {
    try {
        const renarrations = await Renarration.find().sort({ _id: -1 }).select('-sharingId -blocks'); 
        res.json(renarrations);
    } catch (error) {
        console.error('Error fetching renarrations:', error);
        res.status(500).send('Error fetching renarrations');
    }
};

export const getRenarrationById = async (req, res) => {
    const { id } = req.params;

    try {
        // Using .select() to exclude the 'sharingId' field from the result
        const renarration = await Renarration.findById(id)
            .select('-sharingId')
            .populate({
                path: 'blocks',
                match: { renarrationStatus: true }
            });

        if (!renarration) {
            return res.status(404).send('Renarration not found');
        }

        // Return the renarration object without the sharingId directly
        res.json(renarration);
    } catch (error) {
        console.error('Error fetching renarration:', error);
        res.status(500).send('Error fetching renarration');
    }
};

export const updateRenarrationById = async (req, res) => {
    const { id } = req.params;
    const newData = req.body;

    try {
        const newblocks = [];
        for (const block of newData.blocks) {
            const existingBlock = await Block.findById(block._id);
            if (existingBlock) {
               const updatedBlock =  await Block.findByIdAndUpdate(block._id, { ...block });
               
                newblocks.push(updatedBlock._id);
            } else {
                const newBlock = await Block.create({ ...block });
                
                newblocks.push(newBlock._id);
            }
        }
        newData.blocks = newblocks;

        // Then update the renarration
        await Renarration.findByIdAndUpdate(id, newData, { new: true });
        res.json({ message: "Renarration updated successfully" });
    } catch (error) {
        console.error('Error updating renarration:', error);
        res.status(500).send('Error updating renarration');
    }
};

export const deleteRenarrationById = async (req, res) => {
    const { id } = req.params;

    try {
        await Renarration.findByIdAndDelete(id);
        res.json({ message: 'Renarration deleted successfully' });
    } catch (error) {
        console.error('Error deleting renarration:', error);
        res.status(500).send('Error deleting renarration');
    }
};

export const verifySharing = async (req, res) => {
    const { sharingId } = req.body;

    try {
        const renarration = await Renarration.findOne({ sharingId }).populate('blocks');
        if (!renarration) {
            return res.status(404).send('Renarration with the provided sharing ID not found');
        }
        res.status(200).json(renarration);
    } catch (error) {
        console.error('Error fetching renarration:', error);
        res.status(500).send('Error fetching renarration');
    }
};
