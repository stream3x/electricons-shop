import mongoose from 'mongoose';

const addressesSchema = new mongoose.Schema(
  {
    address: {type: String, required: false},
    country: {type: String, required: false},
    city: {type: String, required: false},
    postalcode: {type: String, required: false},
  },
  {
    timestamps: true
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true, default: false},
    image: {type: String, required: false},
    cover_photo: {type: String, required: false},
    birthday: {type: String, required: false},
    addresses: [addressesSchema],
    address: {type: String, required: false},
    country: {type: String, required: false},
    city: {type: String, required: false},
    postalcode: {type: String, required: false},
    phone: {type: String, required: false},
    company: {type: String, required: false},
    vatNumber: {type: String, required: false},
    newsletter: {type: String, required: false},
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;