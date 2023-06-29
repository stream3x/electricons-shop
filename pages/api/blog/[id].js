import nc from 'next-connect';
import db from '../../../src/utils/db';
import Blog from '../../../models/Blog';
import mongoose from 'mongoose';
import Comment from '../../../models/Comment';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const { slug } = req.query;
  const blog = await Blog.findOne({ slug }).populate('comments');
  await db.disconnect();
  res.send(blog);
});

handler.post(async (req, res) => {
  const { id } = req.query;
  const { authorName, email, content, isAdminReply, parentCommentId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid blog post ID' });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = new Comment({
      authorName,
      email,
      content,
      isAdminReply,
      parentCommentId
    });

    await comment.save(); // Save the comment first to generate the ObjectId

    blog.comments.push(comment._id.toHexString()); // Serialize the ObjectId as a string
    await blog.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

export default handler;