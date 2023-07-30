import * as mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: false },
    rating: {type: Number, required: true, default: 0}, 
    isAdminReply: { type: Boolean, default: false },
    replyCommentId: { type: String, default: false },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductComment' }
  },
  {
    timestamps: true,
  }
);

const ProductComment = mongoose.models.ProductComment || mongoose.model('ProductComment', commentSchema);

export default ProductComment;