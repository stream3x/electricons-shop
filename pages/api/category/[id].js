import nc from 'next-connect';
import db from '../../../src/utils/db';
import Category from '../../../models/Category';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const category = await Category.findById(req.query.id);
  await db.disconnect();
  res.send(category);
});
export default handler;