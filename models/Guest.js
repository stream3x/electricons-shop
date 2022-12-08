import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    image: {type: String, required: true}
  },
  {
    timestamps: true
  }
);

const guestSchema = new mongoose.Schema(
  {
    orderItems: [{
      title: {type: String, required: true},
      quantity: {type: Number, required: true},
      images: [imageSchema],
      price: {type: String, required: true},
    }],
    personalInfo: {
      name: {type: String, required: true},
      email: {type: String, required: true},
      birthday: {type: String, required: false},
      company: {type: String, required: false},
      vatNumber: {type: String, required: false}
    },
    addresses: {
      address: {type: String, required: true},
      phone: {type: String, required: true},
      country: {type: String, required: true},
      city: {type: String, required: true},
      postalcode: {type: String, required: true},
    },
    shipping: {
      shippingMethod: {type: String, required: true},
      shippingAddress: {type: String, required: false},
      shippingCity: {type: String, required: false},
      store: {type: String, required: false},
      comment: {type: String, required: false},
    },
    payment: {
      paymentMethod: {type: String, required: true}
    },
    total: {type: Number, required: true},
    shippingCost: {type: Number, required: true},
    taxCost: {type: String, required: true},
    orderNumber: {type: String, required: true},
    checkedNewsletter: {type: Boolean, required: true},
    isPaid: {type: Boolean, required: true, default: false},
    isDelivered: {type: Boolean, required: true, default: false},
    paidAt: {type: Date},
    deleveredAt: {type: Date},
  },
  {
    timestamps: true
  }
);

const Guest = mongoose.models.Guest || mongoose.model('Guest', guestSchema);

export default Guest;