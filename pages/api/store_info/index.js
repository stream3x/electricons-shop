import db from '../../../src/utils/db';
import nc from 'next-connect';
import StoreInfo from '../../../models/StoreInfo';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const store_info = await StoreInfo.find({});
  await db.disconnect();
  res.send(store_info);
});


export default handler;