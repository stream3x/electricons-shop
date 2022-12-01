import nc from 'next-connect';
import db from '../../../src/utils/db';
import Order from '../../../models/Order';
import { onError } from '../../../src/utils/error';
import { isAuth } from '../../../src/utils/auth';

const handler = nc();

handler.post( async (req, res) => {
    await db.connect();
    const newOrder = await Order({
      ...req.body,
      user: req.user._id
    });
    const order = await newOrder.save();
    res.status(201).send(order);
});

export default handler;