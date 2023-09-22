import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../src/utils/db';

const handler = nc();

handler.delete(async (req, res) => {

  try {
    await db.connect();

    const { email, addressId } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex((address) => address._id.toString() === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    user.addresses.splice(addressIndex, 1);

    await user.save();

    await db.disconnect();

    res.status(200).json({ message: 'Address deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default handler;