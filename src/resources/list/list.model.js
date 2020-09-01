import mongoose from 'mongoose'

const listSchema = new mongoose.Schema(
  {
    stockSymbol: {
      type: String,
      required: true,
      trim: true,
    },
    stockName: {
      type: String,
      required: true,
      trim: true,
    },
    stockImage: {
      type: String,
      required: true,
      trim: true,
    },
    cmp: {
      type: Number,
      required: true,
    },
    qtyAvailable: {
      type: Number,
      required: true,
    },
    yearHigh: Number,
    yearLow: Number,
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    }
  },
  { timestamps: true }
)

listSchema.index({ stockSymbol: 1 }, { unique: true })

export const List = mongoose.model('list', listSchema)
