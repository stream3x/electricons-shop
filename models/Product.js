import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    image: {type: String, required: true}
  },
  {
    timestamps: true
  }
);

const widgetImageSchema = new mongoose.Schema(
  {
    image: {type: String, required: false}
  },
  {
    timestamps: true
  }
);

const storeSchema = new mongoose.Schema(
  {
    store: {type: String, required: true}
  },
  {
    timestamps: true
  }
);

const detailSchema = new mongoose.Schema(
  {
    attribute: {type: String, required: false},
    detail: {type: String, required: false}
  },
  {
    timestamps: true
  }
);

const productSchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    images: [imageSchema],
    widgetImages: [widgetImageSchema],
    shortDescription: {type: String, required: true},
    description: {type: String, required: true},
    details: [detailSchema],
    rating: {type: Number, required: true, default: 0},
    price: {type: Number, required: true},
    oldPrice: {type: Number, required: true},
    slug: {type: String, required: true, unique: true},
    category: {type: String, required: true},
    categoryUrl: {type: String, required: true},
    subCategory: {type: String, required: true},
    subCategoryUrl: {type: String, required: true},
    brand: {type: String, required: true},
    brandImg: {type: String, required: true},
    reviews: {type: Number, required: true, default: 0},
    inStock: {type: Number, required: true, default: 0},
    inWidget: {type: String, required: true},
    online: {type: Boolean, required: true},
    stores: [storeSchema],
  },
  {
    timestamps: true
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;