document.addEventListener("DOMContentLoaded", () => {
    const generateFieldsBtn = document.getElementById("generateFields");
    const submitProgressBtn = document.getElementById("submitProgress");
    const subjectFieldsContainer = document.getElementById("subjectFields");
    const termInput = document.getElementById("term");
    const subjectCountInput = document.getElementById("subjectCount");
    const progressChartCanvas = document.getElementById("progressChart");

    let progressData = [];
    let chartInstance = null; // To track the chart instance for dynamic updates

    // Generate input fields for subjects dynamically
    generateFieldsBtn.addEventListener("click", () => {
        subjectFieldsContainer.innerHTML = ""; // Clear any existing fields
        const subjectCount = parseInt(subjectCountInput.value);

        if (isNaN(subjectCount) || subjectCount <= 0) {
            alert("Please enter a valid number of subjects.");
            return;
        }

        for (let i = 1; i <= subjectCount; i++) {
            const fieldDiv = document.createElement("div");
            fieldDiv.classList.add("subject-field");
            fieldDiv.innerHTML = `
                <label for="subject${i}">Subject ${i}:</label>
                <input type="text" id="subject${i}" name="subject${i}" placeholder="Subject Name" required>
                <input type="number" id="marks${i}" name="marks${i}" placeholder="Marks" min="0" max="100" required>
            `;
            subjectFieldsContainer.appendChild(fieldDiv);
        }
    });

    // Handle form submission
    submitProgressBtn.addEventListener("click", (event) => {
        event.preventDefault();
    
        const term = termInput.value;
        const subjectCount = parseInt(subjectCountInput.value);
    
        if (!term || isNaN(subjectCount) || subjectCount <= 0) {
            alert("Please fill out all required fields.");
            return;
        }
    
        const subjects = [];
        for (let i = 1; i <= subjectCount; i++) {
            const subjectName = document.getElementById(`subject${i}`).value;
            const marks = parseInt(document.getElementById(`marks${i}`).value);
    
            if (!subjectName || isNaN(marks) || marks < 0 || marks > 100) {
                alert("Please enter valid subject names and marks.");
                return;
            }
    
            subjects.push({ subjectName, marks });
        }
    
        // Calculate CGPA
        const totalCredits = subjects.length * 4;
        let weightedSum = 0;
    
        subjects.forEach(({ marks }) => {
            let gradePoint;
            if (marks >= 81) gradePoint = 10;
            else if (marks >= 71) gradePoint = 9;
            else if (marks >= 61) gradePoint = 8;
            else if (marks >= 51) gradePoint = 7;
            else if (marks >= 41) gradePoint = 6;
            else gradePoint = 4;
    
            weightedSum += gradePoint * 4; // Credit per subject is constant
        });
    
        const cgpa = (weightedSum / totalCredits).toFixed(2);
    
        // Save progress data
        progressData.push({ term, cgpa });
        alert(`Progress for ${term} saved successfully! CGPA: ${cgpa}`);
    
        // Clear input fields
        termInput.value = "";
        subjectCountInput.value = "";
        subjectFieldsContainer.innerHTML = "";
    
        // Update Chart
        updateChart(progressData);
    });
    
    // Function to update the chart
    function updateChart(data) {
        const labels = data.map(item => item.term);
        const cgpaValues = data.map(item => parseFloat(item.cgpa));

        if (chartInstance) {
            // Destroy the existing chart instance before re-rendering
            chartInstance.destroy();
        }

        // Create a new chart instance
        chartInstance = new Chart(progressChartCanvas, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "CGPA",
                        data: cgpaValues,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, max: 10 },
                },
            },
        });
    }
});
