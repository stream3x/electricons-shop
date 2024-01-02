import nc from 'next-connect';
import fs from "fs";
import path from "path";
import db from '../../../src/utils/db';
import Product from '../../../models/Product';

const handler = nc();

handler.post(async (req, res) => {
  try {

    db.connect();
    const { brandImg, brandUrl } = req.body;

    if (!brandUrl) {
      return res.status(400).json({ error: 'Image data is missing' });
    }

    const base64Data = brandUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filePath = path.join(process.cwd(), 'public/logo/', `${brandImg}`);
    fs.writeFileSync(filePath, buffer);

    const responseData = {
      image: brandUrl,
    };

    db.disconnect();
    
    res.status(200).json(responseData);

  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default handler;
