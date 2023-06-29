import nc from 'next-connect';
import Comment from '../../../../models/Comment';
import db from '../../../../src/utils/db';

const handler = nc();

handler.get(async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  await db.connect();
  const comments = await Comment.find({});
  await db.disconnect();

  comments.forEach((comment) => {
    res.write(`data: ${JSON.stringify(comment)}\n\n`);
  });

  // Kreirajte MongoDB change stream koji će pratiti promene u komentarima
  const changeStream = Comment.watch();

  // Slušajte promene u komentarima i šaljite ažuriranja putem SSE-a
  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const newComment = change.fullDocument;
      res.write(`data: ${JSON.stringify(newComment)}\n\n`);
    }
  });
  res.status(201).send(comments);
  // Rukovanje prekidom veze sa klijentom
  req.on('close', () => {
    changeStream.close();
    res.end();
  });
});

export default handler;