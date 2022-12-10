import nc from 'next-connect';
import db from '../../../../src/utils/db';
import Guest from '../../../../models/Guest';

const handler = nc();

handler.put(async (req, res) => {
  console.log(req.query.id);
  await db.connect();
  const guest_order = await Guest.findById(req.query.id);
  if(guest_order) {
    guest_order.isPaid = true;
    guest_order.paidAt = Date.now();
    guest_order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.payer.email_address
    };
    const paidOrder = await order.save();
    await db.disconnect();
    res.send({ message: 'order paid', order: paidOrder });
  }else {
    await db.disconnect();
    res.status(404).send({ message: 'order not found' });
  }
  await db.disconnect();
  res.send(guest_order);
});


export default handler;