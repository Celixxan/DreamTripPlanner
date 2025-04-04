const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide activity text'],
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  }
});

const DaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Please provide a date']
  },
  activities: {
    morning: [ActivitySchema],
    afternoon: [ActivitySchema],
    evening: [ActivitySchema]
  }
});

const ExpenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please provide an expense category'],
    enum: ['transport', 'accommodation', 'food', 'activities', 'shopping', 'other']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an expense amount']
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const PhotoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please provide a photo URL']
  },
  caption: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const TripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a trip name'],
    trim: true,
    maxlength: [50, 'Trip name cannot be more than 50 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  tripType: {
    type: String,
    required: [true, 'Please provide a trip type'],
    enum: ['city-break', 'beach', 'adventure', 'cultural', 'relaxation', 'other']
  },
  destinations: {
    type: [String],
    required: [true, 'Please provide at least one destination']
  },
  itinerary: [DaySchema],
  expenses: [ExpenseSchema],
  photos: [PhotoSchema],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trip', TripSchema);
