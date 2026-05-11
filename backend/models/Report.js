const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    
    // Doctor Reference
    
    doctor: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

   
    // Patient Reference
    
    patient: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Patient',
      default: null,
    },

    // Patient snapshot data
    patientName: {
      type:    String,
      default: '',
      trim:    true,
    },

    patientAge: {
      type: Number,
      min:  0,
    },

    patientGender: {
      type: String,
      enum: ['male', 'female', 'other', 'Male', 'Female', 'Other', ''],
    },

   
    // X-ray Image
    
    imageId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'XrayImage',
      default: null,
    },

    imagePath: {
      type:    String,
      default: '',
      trim:    true,
    },

    // Annotated image with bounding boxes 
    annotatedImageUrl: {
      type:    String,
      default: null,
      trim:    true,
    },

    
    // Phase 1 — Classification Result 
    
    phase1: {

  result: {

    type: String,

    enum: [
      'stone',
      'normal'
    ],

    default: 'normal',
  },

  confidence: {

    type: Number,

    default: 0,
  },
},


    // Raw AI Result
   
    aiResult: {
      detectedObjects: {
        type:    Array,
        default: [],
      },
      rawOutput: {
        type:    Object,
        default: {},
      },
    },

    
    // Detection Summary
    
    hasStones: {
      type:    Boolean,
      default: false,
    },

    stoneCount: {
      type:    Number,
      default: 0,
      min:     0,
    },

    // Individual stone details 
    details: [
      {
        location:   { type: String, default: 'Unknown' },
        size:       { type: Number, default: 0 },
        confidence: { type: Number, default: 0 },
      },
    ],

   
    // AI Diagnosis Support
  
    diagnosisData: {
      estimatedSize:  { type: Number, default: 0 },
      riskLevel: {
        type:    String,
        enum:    ['No Risk', 'Low', 'Medium', 'High'],
        default: 'No Risk',
      },
      confidence:     { type: Number, default: 0 },
      recommendation: { type: String, default: '', trim: true },
    },

    
    // AI Draft Report
  
    aiDraft: {
      type:    String,
      default: '',
      trim:    true,
    },

    
    // Doctor Review
   
    doctorNotes: {
      type:    String,
      default: '',
      trim:    true,
    },

    doctorAdvice: {
      type:    String,
      default: '',
      trim:    true,
    },

    finalDiagnosis: {
      type:    String,
      default: '',
      trim:    true,
    },

    followUp: {
      type:    String,
      default: '',
      trim:    true,
    },

    
    // Doctor Validation Controls
   
    doctorConfirmed: {
      type:    Boolean,
      default: false,
    },

    doctorEdited: {
      type:    Boolean,
      default: false,
    },

    reviewedAt: {
      type:    Date,
      default: null,
    },

    confirmedAt: {           
      type:    Date,
      default: null,
    },

    rejectedAt: {            
      type:    Date,
      default: null,
    },

    
    // Workflow Status
    
    status: {
      type:    String,
      enum:    ['pending', 'under_review', 'confirmed', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Indexes for performance
reportSchema.index({ doctor:          1 });
reportSchema.index({ patient:         1 });
reportSchema.index({ status:          1 });
reportSchema.index({ createdAt:      -1 });
reportSchema.index({ doctorConfirmed: 1 });

module.exports = mongoose.model('Report', reportSchema);