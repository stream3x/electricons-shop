import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../src/utils/db';

const handler = nc();

handler.put(async (req, res) => {

  try {
    await db.connect();
    const { isPaid, isDeliverd, hasRated, slug } = req.body;
    const { id } = req.query;

    console.log(slug, id);


    const updatedOrder = await Order.findOneAndUpdate({
      _id: id
    },
    {
      $set: { isPaid, isDeliverd },
    },
    {
      new: true
    });

    if (!updatedOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const productOrdered = updatedOrder?.orderItems.find((order) => order.slug === slug);

    if (!updatedOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    productOrdered.hasRated = hasRated;
    console.log(productOrdered);

    const responseData = {
      isPaid: updatedOrder.isPaid,
      isDeliverd: updatedOrder.isDeliverd,
    };

    await updatedOrder.save();

    await db.disconnect();    
    res.status(200).json(responseData);
  } catch (error) {
    console.log('Update to MongoDB', error);
    res.status(500).json({ error: error });
  }
});


export default handler;