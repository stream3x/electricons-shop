import nc from 'next-connect';
import db from '../../../../src/utils/db';
import { Server } from 'socket.io';
import ProductComment from '../../../../models/ProductComment';

const handler = nc();

handler.get(async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const io = new Server(req.socket.server, {
    path: '/api/products/comment/socket.io', // Podešavanje putanje za socket.io
  });

  await db.connect();
  const comments = await ProductComment.find({});
  await db.disconnect();

  res.send(comments);

  const changeStream = ProductComment.watch();

  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const newComment = change.fullDocument;
      console.log('New comment:', newComment);
      io.emit('newComment', newComment);
    }
  });

  req.on('close', () => {
    changeStream.close();
    res.end();
  });
});

export default handler;
