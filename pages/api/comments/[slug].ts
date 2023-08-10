import productReview from './productReview.edge';
import { NextRequest, NextResponse } from 'next/server';

export default async function handler(req: NextRequest, res: NextResponse) {

  const edgeRequest = await productReview(req);
  const edgeResponse = await productReview(res);

  if (edgeRequest.status !== 201) {
    return edgeResponse.json(JSON.parse(edgeResponse.body));
  }
    
  // if (req.method === 'GET') {
  //   // Retrieve comments from the database and send them to the client
  //   const { slug } = req.query;
  //   const comments = await ProductComment.find({ slug }).sort({ createdAt: -1 });
  //   return res.status(200).json(comments);
  // }

  // if (req.method === 'POST') {
  //   const { slug, authorName, email, content, rating, isAdminReply, replyCommentId } = req.body;

  //   // Save the new comment to the database
  //   const newComment = new ProductComment({
  //     slug,
  //     authorName,
  //     email,
  //     content,
  //     rating,
  //     isAdminReply,
  //     replyCommentId,
  //   });
  //   await newComment.save();

  //   // Send the new comment to connected clients via Pusher
  //   pusherServer.trigger('comments', 'new-comment', newComment);

  //   return res.status(201).json(newComment);
  // }

  // Handle other HTTP methods (e.g., PUT, DELETE) if needed
  return edgeResponse.status(405).json({ message: 'Method not allowed' });
}
