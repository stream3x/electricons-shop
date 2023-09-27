import nc from 'next-connect';
import Order from '../../../models/Order';
import db from '../../../src/utils/db';

const handler = nc();

handler.put(async (req, res) => {
  try {
    await db.connect();
    const { hasRated, slug, orderId } = req.body;
    console.log(hasRated, slug, orderId);

    const order = await Order.findById(orderId);

    if (!order) {
      // Handle the case where the order is not found.
      return res.status(404).json({ error: 'Order not found' });
    }

    // Find the product within the orderItems array with the matching slug
    const productIndex = order.orderItems.findIndex((item) => item.slug === slug);

    if (productIndex === -1) {
      // Handle the case where the product is not found in the order.
      return res.status(404).json({ error: 'Product not found in the order' });
    }

    // Update the hasRated field for the specific product to true
    order.orderItems[productIndex].hasRated = true;

    // Save the updated order document
    await order.save();
    console.log(order);

    // Now, the hasRated field should be updated for the specific product
    res.status(200).json(order);

    await db.disconnect();
  } catch (error) {
    console.error('Update to MongoDB', error);
    res.status(500).json({ error: error.message });
  }
});

export default handler;
