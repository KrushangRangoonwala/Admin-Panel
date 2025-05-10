import { model, Schema } from "mongoose";

const productSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  subImages: {
    type: [String],
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'category', // reference to the category model
    required: true,
  },
  subCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'subCategory', // reference to the subCategory model
    required: true,
  },
  sizes: [
    {
      size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL'],
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    }
  ],
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['ReadyToSheep', 'onBooking'],
    default: 'active',
  },
  weigth: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
  }
})

const Products = model('products', productSchema);

export default Products;