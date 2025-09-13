const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inputType: String,
  symptoms: String,
  transcript: String,
  soap: { S: String, O: String, A: String, P: String },
  advice: {
    illness: String,
    homeRemedies: [String],
    otcMedicines: [String],
    redFlags: [String],
    disclaimer: String,
    videoUrl: String,
  },
  location: { lat: Number, lng: Number },
  nearby: [
    {
      name: { type: String },
      address: { type: String },
      type: { type: String },
      mapsUrl: { type: String },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Consultation', ConsultationSchema);
