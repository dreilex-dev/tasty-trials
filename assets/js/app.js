const mealInput = document.getElementById('searchInput');
const feedbackMessage = document.getElementById('feedbackMessage');
const containerResults = document.getElementById('resultsRow'); 
const searchForm = document.getElementById('searchForm');
const resultMessage = document.getElementById('resultMessage');
const resultAlert = document.getElementById('result-alert');
const modalRecipe = document.getElementById('recipeModal');

const showResultMessage = (message, type) => {
    resultAlert.textContent = message;
    resultMessage.classList.remove('bg-success', 'bg-danger', 'd-none', 'show');

    if (type === "success") {
        resultMessage.classList.add('bg-success');
    } else if (type === "error") {
        resultMessage.classList.add('bg-danger');
    }

    resultMessage.classList.add('show');

    setTimeout(() => {
        resultMessage.classList.remove('show');
        resultMessage.classList.add('d-none');
    }, 3000);
};

searchForm.addEventListener("submit", function (e) {
    e.preventDefault(); 
    const mealName = mealInput.value.trim();
    if (mealName) {
        fetchData(mealName);
        mealInput.value = "";
    } else {
        showResultMessage("Please enter the meal.", "error");
    }
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("card-img-top")) {
        const mealId = e.target.getAttribute("data-id");
        fetchMealDetails(mealId);
    }
});

const fetchData = async (mealName) => {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        containerResults.innerHTML = ""; 

        if (!data.meals) {
            showResultMessage("No meals found.", "error");
            return;
        }

        showResultMessage(`These are the results for "${mealName}".`, "success");

        displayMeals(data.meals);
    } catch (error) {
        console.error("Fetch error: ", error);
        showResultMessage("An error occurred. Please try again.", "error");
    }
};

const displayMeals = (meals) => {

    containerResults.innerHTML = ""; 

    meals.forEach((meal) => {
        const card = `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}" data-id="${meal.idMeal}">
                    <div class="card-body">
                        <h5 class="card-title styleCardH5">${meal.strMeal}</h5>
                    </div>
                </div>
            </div>
        `;
        containerResults.innerHTML += card;
    });
};

const fetchMealDetails = async (id) => {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);    
        const data = await res.json();
        if (data.meals) {
            populateModal(data.meals[0]);
            const modal = new bootstrap.Modal(document.getElementById("modalRecipe"));
            modal.show();
        }
    } catch (error) {
        console.error("Error fetching meal details: ", error);
    }
};

const populateModal = (meal) => {
    document.getElementById("modalImageCover").innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid rounded-image">`;
    document.querySelector("#modalHeaderRecipe .modal-title").textContent = meal.strMeal;

    const ingredientsList = document.getElementById("ingredientsList");
    ingredientsList.innerHTML = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        console.log(`Ingredient ${i}:`, ingredient, `Measure:`, measure);
        if (ingredient && ingredient.trim() !== "") {
            ingredientsList.innerHTML += `<li>${measure ? measure : ""} ${ingredient}</li>`;
        }
    }

    document.getElementById("cookingInstructions").textContent = meal.strInstructions ? meal.strInstructions : "No instructions available.";
};
