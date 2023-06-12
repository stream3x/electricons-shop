import nc from 'next-connect';
import db from '../../../src/utils/db';
import Blog from '../../../models/Blog';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const blog = await Blog.findById(req.query.id);
  await db.disconnect();
  res.send(blog);
});
export default handler;