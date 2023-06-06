import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    num: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    logo: {type: String, required: false},
    favicon: {type: String, required: false},
    birthday: {type: String, required: false},
    address: {type: String, required: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    postalcode: {type: String, required: true},
    phone: {type: String, required: true},
    phone_two: {type: String, required: false},
    vatNumber: {type: String, required: false},
    bank_account: {type: String, required: false},
    map: {type: String, required: false}
  },
  {
    timestamps: true
  }
);

const StoreInfo = mongoose.models.StoreInfo || mongoose.model('StoreInfo', storeSchema);

export default StoreInfo;