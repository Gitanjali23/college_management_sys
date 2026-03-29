import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the notice'],
    },
    content: {
      type: String,
      required: [true, 'Please add content to the notice'],
    },
    author: {
      type: String,
      required: true,
      default: 'Admin',
    },
    attachmentName: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.models.Notice || mongoose.model('Notice', noticeSchema);

export default Notice;
