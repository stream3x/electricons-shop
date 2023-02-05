import db from '../../../src/utils/db';
import StoreInfo from '../../../models/StoreInfo';

const handler = async (req, res) => {
  await db.connect();
  const store_info = await StoreInfo.find({});
  await db.disconnect();
  res.send(store_info);
};


export default handler;