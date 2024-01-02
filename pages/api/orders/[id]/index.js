import nc from 'next-connect';
import db from '../../../../src/utils/db';
import Order from '../../../../models/Order';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  await db.disconnect();
  res.send(order);
});

export default handler;