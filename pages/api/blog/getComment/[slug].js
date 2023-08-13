import Comment from '../../../../models/Comment';
import nc from 'next-connect';
import db from '../../../../src/utils/db';

const handler = nc();

handler.get(async(req, res) => {
  try {
    await db.connect();
    const { slug } = req.query;
    // Retrieve comments from the database and send them to the client
    const comments = await Comment.find({ slug }).sort({ createdAt: -1 });
    await db.disconnect();
    return res.status(200).json(comments);

  } catch (error) {
    console.error('Error connecting:', error);
  }
});

export default handler;