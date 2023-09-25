import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../src/utils/db';

const handler = nc();

handler.put(async (req, res) => {

  try {
    await db.connect();
    const { isPaid, isDeliverd, hasRated } = req.body;
    const id = req.query.id;

    const updatedOrder = await Order.findOneAndUpdate({
      _id: id
    },
    {
      $set: { isPaid, isDeliverd, hasRated },
    },
    {
      new: true
    });
    console.log(updatedOrder, id, hasRated);
    if (updatedOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const responseData = {
      isPaid: updatedOrder.isPaid,
      isDeliverd: updatedOrder.isDeliverd,
      hasRated: updatedOrder.hasRated,
    };

    await db.disconnect();    
    res.status(200).json(responseData);
  } catch (error) {
    console.log('Update to MongoDB', error);
    res.status(500).json({ error: error });
  }
});


export default handler;