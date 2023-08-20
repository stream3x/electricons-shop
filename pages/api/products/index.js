
import db from '../../../src/utils/db';
import Product from '../../../models/Product';
import Order from '../../../models/Order';
import Guest from '../../../models/Guest';

const handler = async (req, res) => {
  const { query } = req;

  try {
    db.connect();

    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const searchQuery = query.searchQuery || '';
    const category = query.category || '';
    const subCategory = query.subCategory || '';

    const filter = {};
    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
        { subCategory: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    if (category) {
      filter.category = category;
    }
    if (subCategory) {
      filter.subCategory = subCategory;
    }
    
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / pageSize);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const orders = await Order.find().lean().exec();
    const guestOrders = await Guest.find().lean().exec();

    db.disconnect();
    
    const productOrderCounts = products.map(product => {
      const orderCount = [...orders, ...guestOrders].reduce((count, order) => {
        if (order.orderItems.some(orderProduct => orderProduct._id.toString() === product._id.toString())) {
          return count + 1;
        }
        return count;
      }, 0);
      return { ...product.toObject(), orderCount };
    });

    res.send({products: productOrderCounts, totalProducts, totalPages, searchProducts: products});

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
};


export default handler;