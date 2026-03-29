import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the event'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description for the event'],
    },
    date: {
      type: Date,
      required: [true, 'Please add an event date'],
    },
    location: {
      type: String,
      required: [true, 'Please add an event location'],
    },
    organizer: {
      type: String,
      required: [true, 'Please add an organizer name'],
    },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
