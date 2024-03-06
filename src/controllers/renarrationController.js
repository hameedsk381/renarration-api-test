import { Renarration, Block } from '../models/Renarration.js';
import { v4 as uuidv4 } from 'uuid';

export const createRenarration = async (request, reply) => {
    try {
        const formData = request.body;
        const blocks = [];
        const sharingId = uuidv4();

        for (const block of formData.blocks) {
            const newBlock = await Block.create({ ...block });
            blocks.push(newBlock._id);
        }

        formData.blocks = blocks;
        await Renarration.create({ ...formData, sharingId });

        // Status code and JSON response are combined in Fastify
        reply.code(201).send({
            message: "Renarration created successfully",
            sharingId
        });
    } catch (error) {
        console.error('Error creating renarration:', error);
        reply.code(500).send('Error creating renarration');
    }
};

export const getAllRenarrations = async (request, reply) => {
    try {
        const renarrations = await Renarration.find().sort({ _id: -1 }).select('-sharingId -blocks');
        reply.send(renarrations); // Simplified JSON response
    } catch (error) {
        console.error('Error fetching renarrations:', error);
        reply.code(500).send('Error fetching renarrations');
    }
};

export const getRenarrationById = async (request, reply) => {
    const { id } = request.params;

    try {
        const renarration = await Renarration.findById(id)
            .select('-sharingId')
            .populate({
                path: 'blocks',
                match: { renarrationStatus: true }
            });

        if (!renarration) {
            reply.code(404).send('Renarration not found');
            return; // Make sure to return after sending a response
        }

        reply.send(renarration);
    } catch (error) {
        console.error('Error fetching renarration:', error);
        reply.code(500).send('Error fetching renarration');
    }
};

export const updateRenarrationById = async (request, reply) => {
    const { id } = request.params;
    const newData = request.body;

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
        reply.send({ message: "Renarration updated successfully" });
    } catch (error) {
        console.error('Error updating renarration:', error);
        reply.code(500).send('Error updating renarration');
    }
};

export const deleteRenarrationById = async (request, reply) => {
    const { id } = request.params;

    try {
        const deletedRenarration = await Renarration.findByIdAndDelete(id);
        if (!deletedRenarration) {
            reply.code(404).send('Renarration not found');
            return;
        }
        reply.send({ message: 'Renarration deleted successfully' });
    } catch (error) {
        console.error('Error deleting renarration:', error);
        reply.code(500).send('Error deleting renarration');
    }
};

export const verifySharing = async (request, reply) => {
    const { sharingId } = request.body;

    try {
        const renarration = await Renarration.findOne({ sharingId }).populate('blocks');
        if (!renarration) {
            reply.code(404).send('Renarration with the provided sharing ID not found');
            return;
        }
        reply.send(renarration);
    } catch (error) {
        console.error('Error fetching renarration:', error);
        reply.code(500).send('Error fetching renarration');
    }
};
