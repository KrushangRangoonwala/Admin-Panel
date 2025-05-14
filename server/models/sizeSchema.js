import { model, Schema } from "mongoose";


const sizeSchema = Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    shortName: {
        type: String,
        required: true,
    },
})

const Size = model('size', sizeSchema);

export default Size;