import { model, Schema } from "mongoose";


const categorySchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique:true,
  },
  slug: {
    type: String,
    required: true,
    match: [/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens are allowed'],
  },
  image: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  }
})

const category = model('category', categorySchema);  // automatically converted to `categories` in mongodb

export default category;