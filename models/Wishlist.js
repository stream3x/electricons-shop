import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    oldPrice: {type: Number, required: true},
    slug: {type: String, required: true, unique: true},
    brand: {type: String, required: true},
    inStock: {type: Number, required: true, default: 0},
  },
  {
    timestamps: true
  }
);

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;