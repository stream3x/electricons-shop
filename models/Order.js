import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    image: {type: String, required: true}
  },
  {
    timestamps: true
  }
);

const orderSchema = new mongoose.Schema(
  {
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    orderItems: [{
      title: {type: String, required: true},
      quantity: {type: Number, required: true},
      images: [imageSchema],
      price: {type: String, required: true},
    }],
    userInfo: {
      name: {type: String, required: true},
      email: {type: String, required: true},
      image: {type: String, required: false},
      birthday: {type: Date, required: false},
      newsletter: {type: String, required: false},
      company: {type: String, required: false},
      vatNumber: {type: String, required: false},
      isAdmin: {type: Boolean, required: false},
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
    isPaid: {type: Boolean, required: true, default: false},
    isDelevered: {type: Boolean, required: true, default: false},
    paidAt: {type: Date},
    deleveredAt: {type: Date},
  },
  {
    timestamps: true
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;