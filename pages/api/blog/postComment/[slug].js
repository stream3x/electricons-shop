import Comment from '../../../../models/Comment';
import nc from 'next-connect';
import db from '../../../../src/utils/db';

const handler = nc();

handler.post(async(req, res) => {
  try {
    await db.connect();
    const { slug, authorName, email, content, isAdminReply, replyCommentId } = req.body;
    // Save the new comment to the database
    const newComment = new Comment({ slug, authorName, email, content, isAdminReply, replyCommentId });
    await newComment.save();
    await db.disconnect();
    res.status(201).json({ message: 'Comment submitted successfully' });
  } catch (error) {
    console.error('Error submitting comment:', error);
    res.status(500).json({ message: 'Error submitting comment' });
  }

});

export default handler;