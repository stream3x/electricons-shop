import db from '../../src/utils/db';
import Product from '../../models/Product';
import data from "../../src/utils/data";
import stores from "../../src/utils/store_info";
import category_data from "../../src/utils/category";
import User from '../../models/User';
import Category from '../../models/Category';
import StoreInfo from '../../models/StoreInfo';

const handler = async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Category.deleteMany();
  await Category.insertMany(category_data.categories);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await StoreInfo.deleteMany();
  await StoreInfo.insertMany(stores.storeOne);
  await StoreInfo.insertMany(stores.storeTwo);
  await db.disconnect();
  res.send({message: 'seeded successfuly'});
};

export default handler;