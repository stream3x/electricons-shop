import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../src/utils/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../src/utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
    image: '',
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
      newsletter: user.newsletter,
    });
  await db.disconnect();
});


export default handler;