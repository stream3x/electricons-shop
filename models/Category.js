import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
  category_products: [
    {
      title: {type: String, required: true},
      avatar: {type: String, required: true},
      category: {type: String, required: true},
      categoryUrl: {type: String, required: true},
      subCategory: [
        {
          label: {type: String, required: true},
          url: {type: String, required: true}
        }
      ]
    }
  ]
  },
  {
    timestamps: true
  }
);

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;