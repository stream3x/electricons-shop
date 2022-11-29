import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../src/utils/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../src/utils/auth';
import { onError } from '../../../src/utils/error';

const handler = nc({
  onError
});

handler.post(async (req, res) => {
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
});


export default handler;