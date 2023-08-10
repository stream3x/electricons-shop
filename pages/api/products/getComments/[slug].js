import ProductComment from '../../../../models/ProductComment';
import db from '../../../../src/utils/db';
import nc from 'next-connect';

const handler = nc();

handler.get( async(req, res) => {    
  try {
    await db.connect();
    // Retrieve comments from the database and send them to the client
    const { slug } = req.query;
    const comments = await ProductComment.find({ slug }).sort({ createdAt: -1 });
    await db.disconnect();
    return res.status(200).json(comments);
  } catch (error) {
    console.error('Error connecting:', error);
  }
});

export default handler;
