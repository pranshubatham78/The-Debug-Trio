const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    marks: { type: Number, required: true },
    gradePoint: { type: Number, required: true },
});

const progressSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        term: { type: String, required: true },
        subjects: [subjectSchema],
        cgpa: { type: Number, required: true },
        strongSubjects: [{ type: String }],
        weakSubjects: [{ type: String }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
