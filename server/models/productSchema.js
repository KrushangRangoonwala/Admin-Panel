import { model, Schema } from "mongoose";

const productSchema = Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  mainImage: {
    // required: true,
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
    type: [Schema.Types.ObjectId],
    ref: 'subCategory', // reference to the subCategory model
    required: true,
  },
  // size: {
  //   type: [Schema.Types.ObjectId],
  //   ref: 'sizes',
  //   required: true,
  // },
  // quantity: {
  //   type: Number,
  //   required: true,
  // },
  stockBySize: [{
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
  }],
  mrpPrice: {
    type: Number,
    required: true
  },
  salePrice: {
    type: Number,
    required: true
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