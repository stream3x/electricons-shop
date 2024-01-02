import nc from 'next-connect';
import db from '../../../../src/utils/db';
import Wishlist from '../../../../models/Wishlist';

const handler = nc();

handler.post( async (req, res) => {

  try {
    await db.connect();

    const { slug, userId, title, image, price, oldPrice, brand, inStock } = req.body;

    const products = await Wishlist.find();

    if (!products) {
      return res.status(404).json({ message: 'Poduct not found' });
    }

    const newProducts = new Wishlist({
      userId: userId,
      title,
      image,
      price,
      oldPrice,
      slug,
      brand,
      inStock,
    });

    await newProducts.save();
    await db.disconnect();
    return res.status(201).json(newProducts);

  } catch (error) {
    console.error('Error add to wishlist:', error);
    res.status(500).json({ message: 'Error add to wishlist' });
  }
});

export default handler;