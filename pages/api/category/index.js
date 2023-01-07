
import db from '../../../src/utils/db';
import Category from '../../../models/Category';

const handler = async (req, res) => {
  await db.connect();
  const category = await Category.find({});
  await db.disconnect();
  res.send(category);
};


export default handler;