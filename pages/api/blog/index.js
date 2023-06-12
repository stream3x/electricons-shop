
import Blog from '../../../models/Blog';
import db from '../../../src/utils/db';

const handler = async (req, res) => {
  await db.connect();
  const blog = await Blog.find({});
  await db.disconnect();
  res.send(blog);
};


export default handler;