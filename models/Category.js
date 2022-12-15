import mongoose from 'mongoose'

const subCategorySchema = new mongoose.Schema(
  {
    url: {type: String, required: true},
    subCategoryName: {type: String, required: true},
    topCategoryName: {type: String, required: true},
    topCategoryUrl: {type: String, required: true}
  },
  {
    timestamps: true
  }
);

const categorySchema = new mongoose.Schema(
  {
    categoryName: {type: String, required: true},
    avatar: {type: String, required: true},
    slug: {type: String, required: true},
    subCategory: [subCategorySchema]
  },
  {
    timestamps: true
  }
);

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;