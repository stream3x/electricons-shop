import nc from 'next-connect';
import db from '../../../../src/utils/db';
import Wishlist from '../../../../models/Wishlist';

const handler = nc();

handler.get( async (req, res) => {
  const dataId = req.headers.id;

  try {
    await db.connect();

    const products = await Wishlist.find({userId: dataId});

    if (!products) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await db.disconnect();
    return res.status(201).json(products);

  } catch (error) {
    console.error('Error get wishlist:', error);
    res.status(500).json({ message: 'Error get wishlist' });
  }
});

export default handler;