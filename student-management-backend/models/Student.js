const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 4,
    maxlength: 10
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 20
  },
  gender: {
    type: String,
    required: true,
    enum: ['男', '女']
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 25
  },
  className: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    match: /^1[3-9]\d{9}$/
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

studentSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Student', studentSchema);
