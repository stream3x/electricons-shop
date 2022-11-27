import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true, default: false},
    image: {type: String, required: false},
    birthday: {type: Date, required: false},
    address: {type: String, required: false},
    phone: {type: Number, required: false},
    country: {type: String, required: false},
    city: {type: String, required: false},
    postalcode: {type: Number, required: false},
    company: {type: String, required: false},
    vatNumber: {type: Number, required: false},
    newsletter: {type: String, required: false},
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;