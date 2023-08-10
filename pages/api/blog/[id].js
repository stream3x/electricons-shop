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

export default handler;