const Progress = require('../models/performance');

// Save Progress
exports.saveProgress = async (req, res) => {
    try {
        const { term, subjects } = req.body;
        const credit = 4;

        let totalGradePoints = 0;
        subjects.forEach(sub => {
            const gradePoint = 
                sub.marks >= 81 ? 10 :
                sub.marks >= 71 ? 9 :
                sub.marks >= 61 ? 8 :
                sub.marks >= 51 ? 7 :
                sub.marks >= 41 ? 6 : 4;
            sub.gradePoint = gradePoint;
            totalGradePoints += credit * gradePoint;
        });

        const cgpa = totalGradePoints / (subjects.length * credit);
        const progress = new Progress({ term, subjects, cgpa });

        await progress.save();
        res.status(201).json({ message: 'Progress saved successfully', progress });
    } catch (error) {
        res.status(500).json({ message: 'Error saving progress', error: error.message });
    }
};

// Get All Progress
exports.getAllProgress = async (req, res) => {
    try {
        const progress = await Progress.find();
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error: error.message });
    }
};
