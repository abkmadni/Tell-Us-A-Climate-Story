document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const story = urlParams.get('story') || 'story1'; // Default to story1.json (Deforestation)
    const storyFile = `${story}.json`;
    let currentQuestion = 0;
    let score = 50;
    let totalPossibleScore = 0; // Sum of maximum possible score
    let questions = [];
    let isCO2Story = story === 'story3'; // Assuming 'story3.json' is the CO2 story

    // Get slider and condition text elements
    const slider = document.getElementById("earth-slider");
    const conditionText = document.getElementById("condition-text");
    const mapSection = document.getElementById("map-section");

    // Load the appropriate JSON file based on the story name from URL
    fetch(storyFile)
        .then(response => response.json())
        .then(data => {
            questions = data;
            totalPossibleScore = questions.length * 10; // Assuming max score per question is 10
            updateSlider(); // Initial slider update
            displayQuestion();
        });

    // Display the current question
    function displayQuestion() {
        if (currentQuestion < questions.length) {
            const storyTitle = document.getElementById("storyTitle");
            const questionObj = questions[currentQuestion];
            const questionElement = document.getElementById("question");
            const optionsElement = document.getElementById("options");

            storyTitle.textContent = questionObj.storyTitle;
            questionElement.textContent = questionObj.question;
            optionsElement.innerHTML = "";

            questionObj.options.forEach(option => {
                const optionButton = document.createElement("button");
                optionButton.textContent = option.answer;
                optionButton.addEventListener("click", () => {
                    score += option.score; // Add or subtract score based on choice
                    currentQuestion++;
                    updateSlider();

                    // Check if more questions remain, otherwise end game
                    if (currentQuestion < questions.length) {
                        displayQuestion();
                    } else {
                        endGame(); // End the game if no questions remain
                    }
                });
                optionsElement.appendChild(optionButton);
            });

            // Show the CO₂ map if it's a CO₂-related story
            if (isCO2Story && currentQuestion === 0) { // Show map at the first CO2 story question
                showMap();
            }
        }
    }

    // Update slider and condition text
    function updateSlider() {
        const scorePercentage = (score / totalPossibleScore) * 100;
        slider.value = scorePercentage; // Update slider position

        if (scorePercentage >= 50) {
            conditionText.textContent = "Stable";
            conditionText.style.color = "green";
        } else if (scorePercentage < 50 && scorePercentage >= 30) {
            conditionText.textContent = "Worsening";
            conditionText.style.color = "orange";
        } else {
            conditionText.textContent = "Destroyed";
            conditionText.style.color = "red";
        }

        // End game if Earth's condition reaches 0 or 100
        if (scorePercentage >= 100 || scorePercentage <= 0) {
            endGame();
        }
    }

    // End the game and display the result
    function endGame() {
        const resultElement = document.getElementById("result");
        const scorePercentage = (score / totalPossibleScore) * 100;
        const optionsElement = document.getElementById("options");

        // Clear options and question text
        document.getElementById("question").textContent = "";

        // Hide answer buttons
        optionsElement.innerHTML = "";

        // Display the result based on the final score percentage
        if (scorePercentage >= 50) {
            resultElement.textContent = `Congratulations! You helped save the Earth with a score of ${scorePercentage.toFixed(2)}%.`;
        } else if (scorePercentage < 50 && scorePercentage >= 30) {
            resultElement.textContent = `Warning: Earth's condition is worsening with a score of ${scorePercentage.toFixed(2)}%.`;
        } else {
            resultElement.textContent = `Game Over: Earth is destroyed with a score of ${scorePercentage.toFixed(2)}%.`;
        }

        resultElement.style.display = "block"; // Show result
        updateSlider(); // Ensure the slider reflects the final score

        // Add Restart Game button
        const restartButton = document.createElement("button");
        restartButton.textContent = "Restart Game";
        restartButton.style.marginTop = "20px"; // Add some spacing
        restartButton.addEventListener("click", () => {
            window.location.href = "next_page.html"; // Redirect to next_page.html
        });

        resultElement.appendChild(restartButton); // Append button to the result
    }

    // Initialize the CO2 Emissions Map
    function showMap() {
        mapSection.style.display = 'block';

        var map = L.map('map').setView([20, 0], 2); // Centered on the world

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Sample data for CO2 emissions
        var emissionsData = {
            "locations": [
                { "lat": 37.7749, "lon": -122.4194, "emissions": 380 },  // San Francisco
                { "lat": 34.0522, "lon": -118.2437, "emissions": 360 },  // Los Angeles
                { "lat": 40.7128, "lon": -74.0060, "emissions": 340 },   // New York
                { "lat": 51.5074, "lon": -0.1278, "emissions": 320 },    // London
                { "lat": 35.6895, "lon": 139.6917, "emissions": 300 }    // Tokyo
            ]
        };

        // Add circles for each location
        emissionsData.locations.forEach(function (location) {
            L.circle([location.lat, location.lon], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: location.emissions * 1000 // Adjust radius based on emissions
            }).addTo(map).bindPopup("CO₂ Emissions: " + location.emissions + " ppm");
        });
    }

    // Close the map and return to the game content
    function closeMap() {
        mapSection.style.display = 'none';
    }
});
