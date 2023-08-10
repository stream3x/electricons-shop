import nc from 'next-connect';
import ProductComment from '../../../../models/ProductComment';
import db from '../../../../src/utils/db';

const handler = nc();

handler.post( async (req, res) => {

  try {
    await db.connect();
    const { slug, authorName, email, content, rating, isAdminReply, replyCommentId } = req.body;

    // Save the new comment to the database
    const newComment = new ProductComment({
      slug,
      authorName,
      email,
      content,
      rating,
      isAdminReply,
      replyCommentId,
    });
    await newComment.save();
    await db.disconnect();
    return res.status(201).json(newComment);
  } catch (error) {
    console.error('Error submitting comment:', error);
    res.status(500).json({ message: 'Error submitting comment' });
  }
});

export default handler;
