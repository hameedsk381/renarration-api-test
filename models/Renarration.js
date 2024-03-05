import mongoose from 'mongoose';

// Define Block schema
const BlockSchema = new mongoose.Schema({
    content: String,
    id: String,
    desc: String,
    source: String,
    img:String,
    aud:String,
    vid:String,
    renarrationStatus: Boolean,
    
});

// Define Block model
export const Block = mongoose.model('Block', BlockSchema);

// Define Renarration schema
const RenarrationSchema = new mongoose.Schema({
    renarrationTitle: {
        type: String,
    },
    blocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Block' }],
    sharingId: {
        type: String,
        required: true
    }
});

// Define Renarration model
export const Renarration = mongoose.model('Renarration', RenarrationSchema);


