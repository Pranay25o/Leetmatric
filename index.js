
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const usernameInput = document.getElementById('user-input');
    const statsContainer = document.querySelector('.stats-container');
    const easyProgressCircle = document.querySelector('.progress-item-easy');
    const mediumProgressCircle = document.querySelector('.progress-item-medium');
    const hardProgressCircle = document.querySelector('.progress-item-hard');
    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');
    const cardStatsContainer = document.querySelector('.stats-card');

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const rex = /^[A-Za-z0-9_]{3,30}$/;
        if (!rex.test(username)) {
            alert("Invalid Username");
            return false;
        }
        return true;
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty('--progress-degree', `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    async function fetchUserStats(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
            if (!response.ok) throw new Error("❌ User not found or API error");

            const data = await response.json();

            if (data.status !== "success") throw new Error("⚠️ Failed to retrieve data");

            const totalQuestions = data.totalQuestions || 2000; // fallback
            updateProgress(data.easySolved, totalQuestions, easyLabel, easyProgressCircle);
            updateProgress(data.mediumSolved, totalQuestions, mediumLabel, mediumProgressCircle);
            updateProgress(data.hardSolved, totalQuestions, hardLabel, hardProgressCircle);

            const cardsData = [
                { label: "Total Solved", value: data.totalSolved },
                { label: "Easy Solved", value: data.easySolved },
                { label: "Medium Solved", value: data.mediumSolved },
                { label: "Hard Solved", value: data.hardSolved },
                { label: "Ranking", value: data.ranking },
                { label: "Reputation", value: data.reputation }
            ];

            cardStatsContainer.innerHTML = cardsData.map(data => `
                <div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                </div>
            `).join("");

        } catch (error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`;
            console.error(error);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    searchButton.addEventListener('click', function () {
        const username = usernameInput.value.trim();
        if (validateUsername(username)) {
            fetchUserStats(username);
        }
    });
});

