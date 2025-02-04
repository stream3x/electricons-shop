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
const pattern= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });

  if(user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      image: user.image,
      birthday: user.birthday,
      addresses: [{address: user.address, city: user.city, country: user.country, postalcode: user.postalcode, phone: user.phone}],
      company: user.company,
      vatNumber: user.vatNumber,
      newsletter: user.newsletter
    });
  }else {
    if(req.body.email === '' && req.body.password === '') {
      console.log(res.status(401).send({ message: "Please fill the fields", severity: "error", type: 'all'  }));
    }else if(req.body.email === '' && req.body.password !== '') {
      console.log(res.status(401).send({ message: "Please fill the email", severity: "error", type: 'email' }));
    }else if(req.body.email !== '' && req.body.password === '') {
      console.log(res.status(401).send({ message: "Please fill the password", severity: "error", type: 'password' }));
    }else if(!pattern.test(req.body.email)) {
      console.log(res.status(401).send({ message: "email is not valid", severity: "error", type: 'email' }));
    }else {
      res.status(401).send({ message: "Invalid email or password", severity: 'error', type: 'all' });
    }
  }

  await db.disconnect();
});


export default handler;