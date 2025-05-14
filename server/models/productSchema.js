import { model, Schema } from "mongoose";

const productSchema = Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  mainImage: {
    data: Buffer,
    contentType: String,
    originalName: String,
  },
  subImages: [{
    data: Buffer,
    contentType: String,
    originalName: String,
  }],
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
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  // sizes: [
  //   {
  //     size: {
  //       type: String,
  //       enum: ['S', 'M', 'L', 'XL', 'XXL'],
  //       required: true,
  //     },
  //     quantity: {
  //       type: Number,
  //       required: true,
  //     },
  //   }
  // ],
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['ReadyToShip', 'onBooking'],
    default: 'active',
  },
  weight: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
  }
})

const Products = model('products', productSchema);

export default Products;