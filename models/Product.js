import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    image: {type: String, required: true}
  },
  {
    timestamps: true
  }
);

const productSchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    images: [imageSchema],
    shortDescription: {type: String, required: true},
    description: {type: String, required: true},
    rating: {type: Number, required: true, default: 0},
    price: {type: String, required: true},
    oldPrice: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    category: {type: String, required: true},
    categoryUrl: {type: String, required: true},
    brandImg: {type: String, required: true},
    reviews: {type: Number, required: true, default: 0},
    inStock: {type: Number, required: true, default: 0},
    inWidget: {type: String, required: true}      
  },
  {
    timestamps: true
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;