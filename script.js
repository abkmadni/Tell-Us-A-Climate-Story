document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const story = urlParams.get('story') || 'story1'; // Default to story1.json (Deforestation)
    const storyFile = `${story}.json`;
    let currentQuestion = 0;
    let score = 50;
    let totalPossibleScore = 0; // Sum of maximum possible score
    let questions = [];

    // Get slider and condition text elements
    const slider = document.getElementById("earth-slider");
    const conditionText = document.getElementById("condition-text");

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
    
                    // Check if score reaches 20 or 100, or if more questions remain
                    if (score <= 20 || score >= 100 || currentQuestion >= questions.length) {
                        endGame(); // End the game
                    } else {
                        displayQuestion(); // Display next question
                    }
                });
                optionsElement.appendChild(optionButton);
            });
        }
    }

    // Update slider and condition text
    function updateSlider() {
        const scorePercentage = (score / totalPossibleScore) * 100;
        slider.value = scorePercentage; // Update slider position
    
            if (score <= 20 || score >= 100) {
        endGame(); // End the game
    }

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
    }

    // Define GIF URLs at the beginning of your script
const earthSavedGif = "earth-saved.gif"; // Replace with your actual URL
const earthDestroyedGif = "earth-destroyed.gif"; // Replace with your actual URL

// Inside the endGame function
function endGame() {
    const resultElement = document.getElementById("result");
    const scorePercentage = (score / totalPossibleScore) * 100;
    const optionsElement = document.getElementById("options");

    // Clear options and question text
    document.getElementById("question").textContent = "";
    optionsElement.innerHTML = "";

    // Display the result based on the final score percentage
    if (scorePercentage >= 50) {
        resultElement.textContent = `Congratulations! You helped save the Earth & its condition is stable.`;
        // Show Earth Saved GIF
        const breakElement = document.createElement("br");
        const imgElement = document.createElement("img");
        imgElement.src = earthSavedGif; // Use the saved Earth GIF
        imgElement.style.width = "100%"; // Adjust width if necessary
        resultElement.appendChild(breakElement);
        resultElement.appendChild(imgElement);
    } else if (scorePercentage < 50 && scorePercentage >= 30) {
        resultElement.textContent = `Warning: You tried your best but the Earth's condition is worsening.`;
        // Optionally, add a GIF or image for this condition if you have one
    } else {
        resultElement.textContent = `Game Over: Earth is destroyed & you could not save it.`;
        // Show Earth Destroyed GIF
        const breakElement = document.createElement("br");
        const imgElement = document.createElement("img");
        imgElement.src = earthDestroyedGif; // Use the destroyed Earth GIF
        imgElement.style.width = "100%"; // Adjust width if necessary
        resultElement.appendChild(breakElement);
        resultElement.appendChild(imgElement);
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
});

