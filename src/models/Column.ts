import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    }],
  },
  {
    timestamps: true,
  }
);

const Column = mongoose.models.Column || mongoose.model('Column', columnSchema);

export default Column;