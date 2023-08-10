import ProductComment from '../../../models/ProductComment';

export default async function handler(req, res) {
    
  if (req.method === 'GET') {
    // Retrieve comments from the database and send them to the client
    const { slug } = req.query;
    const comments = await ProductComment.find({ slug }).sort({ createdAt: -1 });
    return res.status(200).json(comments);
  }

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

  // Handle other HTTP methods (e.g., PUT, DELETE) if needed
  return res.status(405).json({ message: 'Method not allowed' });
}
