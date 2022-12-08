import nc from 'next-connect';
import db from '../../../../src/utils/db';
import Guest from '../../../../models/Guest';

const handler = nc();

handler.get(async (req, res) => {
  console.log(req.query.id);
  await db.connect();
  const guest_order = await Guest.findById(req.query.id);
  await db.disconnect();
  res.send(guest_order);
});


export default handler;