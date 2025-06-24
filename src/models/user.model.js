import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    // required: true,
    sparse: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  college: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'mentor'],
    default: 'user',
  },
  picture: {
    type: String,
  },
  bio: {
    type: String,
  },
  githubUsername: {
    type: String,
    unique: true,
    sparse: true,
  },
  linkedinUrl: {
    type: String,
    unique: true,
    sparse: true,
  },
  isProfilePrivate: {
    type: Boolean,
    default: false
  },
  mentorDetails: {
    designation: { type: String },
    company: { type: String },
    experience: { type: String },
    skills: { type: String },
    linkedin: { type: String },
    bio: { type: String },
    mentorRequestStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'default'],
      default: 'default',
    },

  },
}, {
  timestamps: true,
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
