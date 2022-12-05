import nc from 'next-connect';
import db from '../../../src/utils/db';
import Order from '../../../models/Order';

const handler = nc();

handler.post( async (req, res) => {
    await db.connect();
    const newOrder = await Order({
      ...req.body,
    });
    const order = await newOrder.save();
    res.status(201).send(order);
});

export default handler;