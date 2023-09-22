import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../src/utils/db';

const handler = nc();

handler.put(async (req, res) => {

  try {
    await db.connect();
    const { email, addresses, addressId } = req.body;

    const user = await User.findOne({ email });

    const addressIndex = user.addresses.findIndex((address) => (address._id).toString() === addressId);

    if (addressIndex === -1) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }

    user.addresses[addressIndex] = addresses[0];
 
    const updatedUser = await user.save();

    await db.disconnect();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log('Upload to MongoDB', error);
    res.status(500).json({ error: error });
  }
});


export default handler;