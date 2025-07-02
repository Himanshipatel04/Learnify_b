import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
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
  college: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'mentor'],
    default: 'user',
  },
  picture: String,
  bio: String,
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
    designation: String,
    company: String,
    experience: String,
    skills: String,
    reason: String,
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
