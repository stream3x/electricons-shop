import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../src/utils/db';
import bcrypt from 'bcryptjs';
import { signToken, isAuth } from '../../../src/utils/auth';
import { onError } from '../../../src/utils/error';

const handler = nc({
  onError,
  isAuth
});

handler.post(async (req, res) => {
  try {
    await db.connect(); 
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      isAdmin: false,
      image: '',
      address: req.body.address,
      phone: req.body.phone,
      country: req.body.country,
      city: req.body.city,
      postalcode: req.body.postalcode,
      company: req.body.company,
      vatNumber: req.body.vatNumber,
      birthday: req.body.birthday,
      newsletter: req.body.newsletter,
    });
    const user = await newUser.save();
    const token = signToken(user);
    await db.disconnect();

      res.send({
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        image: user.image,
        birthday: user.birthday,
        address: user.address,
        phone: user.phone,
        country: user.country,
        city: user.city,
        postalcode: user.postalcode,
        company: user.company,
        vatNumber: user.vatNumber,
        newsletter: user.newsletter,
      });
      
  } catch (error) {
    res.status(500).json({ message: 'Error submitting credentials' });
  }
 
});


export default handler;