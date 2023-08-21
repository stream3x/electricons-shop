
import Product from '../../../../models/Product';
import db from '../../../../src/utils/db';
import nc from 'next-connect';

const handler = nc();

handler.get( async(req, res) => {
  const { query } = req;
  const { category, minPrice, maxPrice } = req.query;
  
  try {
    await db.connect();
  
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 12;
    const categoryUrl = query.categoryUrl || '';
    const subCategoryUrl = query.subCategoryUrl || '';
    const sort = query.sort || '';
    const price = query.price || '';
  
    const categories = await Product.find().distinct('category');
    const subcategories = await Product.find().distinct('subCategory');
    const brands = await Product.find().distinct('brand').lean().exec();

    const order = 
    sort === 'availability'
    ? { inStock: -1 }
    : sort === 'lowest'
    ? { price: 1 }
    : sort === 'highest'
    ? { price: -1 }
    : sort === 'namelowest'
    ? { title: 1 }
    : sort === 'namehighest'
    ? { title: -1 } 
    : sort === 'latest'
    ? { createdAt: -1 }
    : { _id: -1 };

    const filter = {};

    if (categoryUrl) {
      filter.categoryUrl = categoryUrl;
    }

    if (subCategoryUrl) {
      filter.subCategoryUrl = subCategoryUrl;
    }

    if (minPrice && maxPrice) {
      filter.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    }

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / pageSize);

    const products = await Product.find(filter)
    .sort(order) // Handle sorting
    .skip((page - 1) * pageSize)
    .limit(pageSize);

    
    console.log(subcategories);

    await db.disconnect();
    res.status(200).json({
      products,
      categories,
      subcategories,
      brands,
      totalProducts,
      totalPages
    });
  } catch (error) {
    console.error('Error connecting:', error);
  }
});

export default handler;
