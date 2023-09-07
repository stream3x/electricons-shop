import nc from 'next-connect';
import User from '../../models/User';
import db from '../../src/utils/db';

const handler = nc();

handler.put(async (req, res) => {
  try {
    await db.connect();
    const { name, email, company, vatNumber, birthday, address, country, city, postalcode, phone } = req.body;

    const updatedUser = await User.findOneAndUpdate({
      email
    },
    {
      $set: { name, email, company, vatNumber, birthday, address, country, city, postalcode, phone }
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
      address: updatedUser.address,
      city: updatedUser.city,
      country: updatedUser.country,
      postalcode: updatedUser.postalcode,
      phone: updatedUser.phone,
    };
    
    await db.disconnect();
    res.status(200).json(responseData);
  } catch (error) {
    console.log('Upload to MongoDB', error);
  }
});


export default handler;