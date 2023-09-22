import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../src/utils/db';

const handler = nc();

handler.put(async (req, res) => {

  try {
    await db.connect();
    const { name, email, company, vatNumber, birthday, addresses } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email cannot be empty' });
    }

    const updatedUser = await User.findOneAndUpdate({
      email
    },
    {
      $set: { name, email, company, vatNumber, birthday },
      $push: { addresses: addresses }
    },
    {
      new: true
    });
    const responseData = {
      name: updatedUser.name,
      email: updatedUser.email,
      company: updatedUser.company,
      vatNumber: updatedUser.vatNumber,
      birthday: updatedUser.birthday,
      addresses: updatedUser.addresses
    };
    
    await db.disconnect();
    res.status(200).json(responseData);
  } catch (error) {
    console.log('Upload to MongoDB', error);
    res.status(500).json({ error: error });
  }
});


export default handler;