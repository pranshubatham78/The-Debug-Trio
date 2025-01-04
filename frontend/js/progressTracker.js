document.getElementById('generateFields').addEventListener('click', function () {
    const subjectCount = document.getElementById('subjectCount').value;
    const subjectFields = document.getElementById('subjectFields');
    subjectFields.innerHTML = '';

    for (let i = 0; i < subjectCount; i++) {
        subjectFields.innerHTML += `
            <label for="subject${i}">Subject ${i + 1}:</label>
            <input type="text" id="subject${i}" placeholder="Subject Name" required>
            <label for="marks${i}">Marks:</label>
            <input type="number" id="marks${i}" placeholder="Marks (0-100)" required>
        `;
    }
});

document.getElementById('progressForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const term = document.getElementById('term').value;
    const subjectCount = document.getElementById('subjectCount').value;
    const subjects = [];

    for (let i = 0; i < subjectCount; i++) {
        const subjectName = document.getElementById(`subject${i}`).value;
        const marks = document.getElementById(`marks${i}`).value;
        subjects.push({ name: subjectName, marks: parseInt(marks, 10) });
    }

    const payload = { term, subjects };

    // Store in LocalStorage
    let progressData = JSON.parse(localStorage.getItem('progress')) || [];
    progressData.push(payload);
    localStorage.setItem('progress', JSON.stringify(progressData));

    alert('Progress saved!');
    location.reload();
});

// Chart Rendering
const renderChart = () => {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressData = JSON.parse(localStorage.getItem('progress')) || [];
    const terms = progressData.map(p => p.term);
    const cgpa = progressData.map(p => calculateCGPA(p.subjects));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: terms,
            datasets: [{
                label: 'CGPA',
                data: cgpa,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
};

// CGPA Calculation
const calculateCGPA = (subjects) => {
    const totalGradePoints = subjects.reduce((sum, s) => {
        const gradePoint = s.marks >= 81 ? 10 : s.marks >= 71 ? 9 : s.marks >= 61 ? 8 : s.marks >= 51 ? 7 : s.marks >= 41 ? 6 : 4;
        return sum + (gradePoint * 4); // credit is 4
    }, 0);
    return (totalGradePoints / (subjects.length * 4)).toFixed(2);
};

renderChart();
