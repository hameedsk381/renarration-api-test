import mongoose from 'mongoose';

// Define Block schema
const BlockSchema = new mongoose.Schema({
    content: String,
    id: String,
    desc: String,
    source: String,
    image:String,
    audio:String,
    video:String,
    renarrationStatus: Boolean
});

// Define Renarration schema
const RenarrationSchema = new mongoose.Schema({
    renarrationTitle: {
        type: String,
    },
    blocks: [BlockSchema]
});

// Define Renarration model
const Renarration = mongoose.model('Renarration', RenarrationSchema);

export default Renarration;
