import ProductComment from '../../../models/ProductComment';
import nc from 'next-connect';

const handler = nc();

handler.get( async(req, res) => {
    
  if (req.method === 'GET') {
    // Retrieve comments from the database and send them to the client
    const { slug } = req.query;
    const comments = await ProductComment.find({ slug }).sort({ createdAt: -1 });
    return res.status(200).json(comments);
  }

  // Handle other HTTP methods (e.g., PUT, DELETE) if needed
  return res.status(405).json({ message: 'Method not allowed' });
});

handler.post( async (req, res) => {
  if (req.method === 'POST') {
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

    return res.status(201).json(newComment);
  }
  return res.status(405).json({ message: 'Method not allowed' });
});

export default handler;
