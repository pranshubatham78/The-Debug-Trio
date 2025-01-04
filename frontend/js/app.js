const renderUserProfile = () => {
    const profileContainer = document.getElementById('profileContainer');
    const progressData = JSON.parse(localStorage.getItem('progress')) || [];

    if (progressData.length === 0) {
        profileContainer.innerHTML = '<p>No data submitted yet.</p>';
        return;
    }

    profileContainer.innerHTML = progressData.map((term) => `
        <div class="term-profile">
            <h3>${term.term}</h3>
            <ul>
                ${term.subjects.map(sub => `<li>${sub.name}: ${sub.marks} marks</li>`).join('')}
            </ul>
        </div>
    `).join('');
};

// Call the function to render the profile on page load
renderUserProfile();
