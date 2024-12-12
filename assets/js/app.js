const mealInput = document.getElementById('searchInput');
const feedbackMessage = document.getElementById('feedbackMessage');
const containerResults = document.getElementById('resultsRow'); 
const searchButton = document.getElementById('searchButton');
const resultMessage = document.getElementById('resultMessage');
const resultAlert = document.getElementById('result-alert');
const cardTitleElement = document.querySelector('.card-title');
// cardTitleElement.classList.add('styleCardH5');

// Funcție pentru afișarea mesajelor (verde pentru succes, roșu pentru eroare)
const showResultMessage = (message, type) => {
    resultAlert.textContent = message;

    // Eliminăm clasele anterioare
    resultMessage.classList.remove('bg-success', 'bg-danger', 'd-none', 'show');

    // Adăugăm clasa corespunzătoare
    if (type === "success") {
        resultMessage.classList.add('bg-success');
    } else if (type === "error") {
        resultMessage.classList.add('bg-danger');
    }

    // Afișăm mesajul
    resultMessage.classList.add('show');

    // Ascundem mesajul după 3 secunde
    setTimeout(() => {
        resultMessage.classList.remove('show');
        resultMessage.classList.add('d-none');
    }, 3000);
};

// Event listener pentru butonul de căutare
searchButton.addEventListener("click", function () {
    const mealName = mealInput.value.trim();
    if (mealName) {
        fetchData(mealName);
        mealInput.value = "";
    } else {
        showResultMessage("Please enter the meal.", "error");
    }
});

// Event listener pentru Enter în câmpul de căutare
mealInput.addEventListener("keydown", function (e) {
    resultMessage.classList.add('d-none'); // Ascundem mesajul anterior

    if (e.code === "Enter") {
        e.preventDefault();
        const mealName = mealInput.value.trim();
        if (mealName) {
            fetchData(mealName);
            mealInput.value = "";
        } else {
            showResultMessage("Please enter the meal.", "error");
        }
    }
});

// Funcție pentru fetch API
const fetchData = async (mealName) => {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        containerResults.innerHTML = ""; // Resetăm containerul pentru rezultate

        if (!data.meals) {
            showResultMessage("No meals found.", "error");
            return;
        }

        // Afișăm mesajul de succes
        showResultMessage(`These are the results for "${mealName}".`, "success");

        // Afișăm mesele
        displayMeals(data.meals);
    } catch (error) {
        console.error("Fetch error: ", error);
        showResultMessage("An error occurred. Please try again.", "error");
    }
};

// Funcție pentru afișarea rezultatelor
const displayMeals = (meals) => {
    containerResults.innerHTML = ""; // Golește containerul înainte de a afișa noile rezultate

    meals.forEach((meal) => {
        const card = `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                    <div class="card-body">
                        <h5 class="card-title styleCardH5">${meal.strMeal}</h5>
                    </div>
                </div>
            </div>
        `;
        containerResults.innerHTML += card;
    });
    // cardTitleElement.classList.add('styleCardH5');
};