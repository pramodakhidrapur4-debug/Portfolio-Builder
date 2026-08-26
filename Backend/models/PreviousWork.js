import mongoose from 'mongoose';

const PreviousWorkSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, 'Business Name is required'],
    trim: true,
    maxlength: [100, 'Business Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  link: {
    type: String,
    required: [true, 'Link is required'],
    validate: {
      validator: function(v) {
        if (!v) return false;
        try {
          const url = new URL(v);
          return ['http:', 'https:'].includes(url.protocol);
        } catch (err) {
          return false;
        }
      },
      message: 'Please enter a valid HTTP/HTTPS URL'
    }
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  imagePublicId: {
    type: String
  }
}, {
  timestamps: true
});

const PreviousWork = mongoose.models.PreviousWork || mongoose.model('PreviousWork', PreviousWorkSchema);

export default PreviousWork;
