import { model, Schema } from "mongoose";


const subCategorySchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'category', // reference to the category model
    required: true,
  },
  desc: {
    type: String,
  },
})

const subCategory = model('subCategory',subCategorySchema);

export default subCategory;