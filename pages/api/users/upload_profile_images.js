import nc from 'next-connect';
import db from '../../../src/utils/db';
import fs from "fs";
import path from "path";
import User from '../../../models/User';

const handler = nc();

handler.put(async (req, res) => {
  try {

    db.connect();
    const { image_name, image, email } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is missing' });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filePath = path.join(process.cwd(), 'public/images/users', `${image_name}`);
    fs.writeFileSync(filePath, buffer);
      
      const updatedUser = await User.findOneAndUpdate({
        email
      },
      {
        $set: { image }
      },
      {
        new: true
      });
      const responseData = {
        image: updatedUser.image,
      };
      
      db.disconnect();
      
      res.status(200).json(responseData);

  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default handler;
