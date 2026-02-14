const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: String, // For now, simple string. Later ObjectId if we add Auth.
        required: true,
        index: true
    },
    moduleId: {
        type: String,
        required: true,
        index: true
    },
    // Granular Scores (0-100)
    drillScore: { type: Number, default: 0 },
    visualizerScore: { type: Number, default: 0 },
    templateScore: { type: Number, default: 0 },
    recognitionScore: { type: Number, default: 0 },
    edgeCaseScore: { type: Number, default: 0 },

    // Aggregate Confidence
    confidence: { type: Number, default: 0 },

    // Sub-pattern Breakdown (e.g. { "fixed": 80, "variable": 40 })
    subPatternConfidence: {
        type: Map,
        of: Number,
        default: {}
    },

    lastPracticed: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for fast lookup
userProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
