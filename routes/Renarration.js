import express from 'express'; // Assuming your Renarration model is defined in a separate file
import Renarration from '../models/Renarration.js'
const RenarrationRouter = express.Router();

// Create a renarration
RenarrationRouter.post('/create-renarration', async (req, res) => {
    try {
        const formData = req.body;

        // Create a new renarration document
        const renarration = await Renarration.create(formData);

        res.status(201).json(renarration);
    } catch (error) {
        console.error('Error creating renarration:', error);
        res.status(500).send('Error creating renarration');
    }
});

// Get all renarrations
RenarrationRouter.get('/renarrations', async (req, res) => {
    try {
        const renarrations = await Renarration.find();
        res.json(renarrations);
    } catch (error) {
        console.error('Error fetching renarrations:', error);
        res.status(500).send('Error fetching renarrations');
    }
});

// Get a renarration by ID
RenarrationRouter.get('/renarrations/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const renarration = await Renarration.findById(id);
        if (!renarration) {
            return res.status(404).send('Renarration not found');
        }
        res.json(renarration);
    } catch (error) {
        console.error('Error fetching renarration:', error);
        res.status(500).send('Error fetching renarration');
    }
});

// Update a renarration by ID
RenarrationRouter.put('/renarrations/:id', async (req, res) => {
    const { id } = req.params;
    const newData = req.body;

    try {
        const updatedRenarration = await Renarration.findByIdAndUpdate(id, newData, { new: true });
        res.json(updatedRenarration);
    } catch (error) {
        console.error('Error updating renarration:', error);
        res.status(500).send('Error updating renarration');
    }
});

// Delete a renarration by ID
RenarrationRouter.delete('/renarrations/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Renarration.findByIdAndDelete(id);
        res.json({ message: 'Renarration deleted successfully' });
    } catch (error) {
        console.error('Error deleting renarration:', error);
        res.status(500).send('Error deleting renarration');
    }
});

RenarrationRouter.get('/verify-sharing/:sharingId', async (req, res) => {
    const { sharingId } = req.params;

    try {
        const renarration = await Renarration.findOne({ sharingId: parseInt(sharingId) });
        if (!renarration) {
            return res.status(404).send('Renarration with the provided sharing ID not found');
        }
        res.json(renarration);
    } catch (error) {
        console.error('Error fetching renarration:', error);
        res.status(500).send('Error fetching renarration');
    }
});

export default RenarrationRouter;
