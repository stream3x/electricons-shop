
import db from '../../../src/utils/db';
import Product from '../../../models/Product';

const handler = async (req, res) => {
  await db.connect();
  const product = await Product.find({});
  await db.disconnect();
  res.send(product);
};


export default handler;