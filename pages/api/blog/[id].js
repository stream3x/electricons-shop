import nc from 'next-connect';
import db from '../../../src/utils/db';
import Blog from '../../../models/Blog';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const { slug } = req.query;
  const blog = await Blog.findOne({ slug }).populate('comments');
  await db.disconnect();
  res.send(blog);
});

// handler.post(async (req, res) => {
  
//   if (req.method === 'POST') {
//     const { slug, authorName, email, content, isAdminReply, blogPostId, replyCommentId } = req.body;

//     // Save the new comment to the database
//     const newComment = new Comment({ slug, authorName, email, content, isAdminReply, blogPostId, replyCommentId });
//     await newComment.save();

//     // Send the new comment to connected clients via Pusher
//     pusherServer.trigger('comments', 'new-comment', newComment);

//     return res.status(201).json(newComment);
//   }

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid blog post ID' });
//   }

//   try {
//     const blog = await Blog.findById(id);
//     if (!blog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }

//     const comment = new Comment({
//       authorName,
//       email,
//       content,
//       isAdminReply,
//       blogPostId,
//       replyCommentId
//     });

//     await comment.save(); // Save the comment first to generate the ObjectId

//     blog.comments.push(comment._id.toHexString()); // Serialize the ObjectId as a string
//     await blog.save();

//     res.status(201).json({ message: 'Comment added successfully', comment });
//   } catch (error) {
//     console.error('Error adding comment:', error);
//     res.status(500).json({ message: 'Error adding comment', error: error.message });
//   }
// });

export default handler;