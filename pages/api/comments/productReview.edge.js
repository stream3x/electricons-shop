import ProductComment from '../../../models/ProductComment';
import pusherServer from '../../../src/utils/server/pusher';

export const config = {
  runtime: 'edge',
}

export default async function handler (req, res) {
  if (req.method === 'GET') {
    // Retrieve comments from the database and send them to the client
    const slug = req.url;
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

    // Send the new comment to connected clients via Pusher
    pusherServer.trigger('comments', 'new-comment', newComment);

    return res.status(201).json(newComment);
  };
}
