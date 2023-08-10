import Comment from '../../../../models/Comment';
import nc from 'next-connect';

const handler = nc();

handler.post(async(req, res) => {

  if (req.method === 'POST') {
    const { slug, authorName, email, content, isAdminReply, replyCommentId } = req.body;

    // Save the new comment to the database
    const newComment = new Comment({ slug, authorName, email, content, isAdminReply, replyCommentId });
    await newComment.save();

    return res.status(201).json(newComment);
  }
});

handler.get(async(req, res) => {
  const { slug } = req.query;

  if (req.method === 'GET') {
    // Retrieve comments from the database and send them to the client
    const comments = await Comment.find({ slug }).sort({ createdAt: -1 });
    return res.status(200).json(comments);
  }
});

export default handler;