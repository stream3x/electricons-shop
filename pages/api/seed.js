import db from '../../src/utils/db';
import Product from '../../models/Product';
import data from "../../src/utils/data";
import User from '../../models/User';

const handler = async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send({message: 'seeded successfuly'});
};

export default handler;