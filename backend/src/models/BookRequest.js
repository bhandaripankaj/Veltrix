import mongoose from 'mongoose'

const bookRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    message: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('BookRequest', bookRequestSchema)
