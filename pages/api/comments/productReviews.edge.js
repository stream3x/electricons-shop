// api/productReviews.edge.js
import ProductComment from '../../../models/ProductComment';
import pusherServer from '../../../src/utils/server/pusher';

export default async function handler(req) {
  if (req.method === 'POST') {

    // Fetch the product being reviewed
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
console.log('Pusher', newComment);
    return new Response(JSON.stringify(newComment), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Handle other HTTP methods (e.g., GET, PUT, DELETE) if needed
  return new Response(JSON.stringify({ message: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}
