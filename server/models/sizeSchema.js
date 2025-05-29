import { model, Schema } from "mongoose";


const sizeSchema = Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true, // is this correct property
    },
    shortName: {
        type: String,
        required: true,
        unique: true,
    },
})

const Size = model('size', sizeSchema);

export default Size;