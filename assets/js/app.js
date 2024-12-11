const mealInput = document.getElementById('searchInput');
const feedbackMessage = document.getElementById('feedbackMessage');
const toastMessage = document.getElementById('toast-alert');
const toastElement = new bootstrap.Toast(document.getElementById('toast-1'));
const containerResults = document.getElementById('resultsRow'); 
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener("click", function() {
    const mealName = mealInput.value.trim();
    if (mealName) {
        fetchData(mealName);
        mealInput.value = "";
    } else {
        toastMessage.textContent = "Please enter the meal."
        toastElement.show();
        setTimeout(() => {
            toastElement.hide();
        }, 3000);
    }
})

mealInput.addEventListener("keypress", function(e) {
    toastMessage.textContent = "";
    if (e.code === "Enter") {
        e.preventDefault();
        if (mealInput.value.trim() != "") {
            fetchData(mealInput.value.trim());
            mealInput.value = "";
        } else {
            toastMessage.textContent = "Please enter the meal.";
            toastElement.show();
            setTimeout(() => {
                toastElement.hide(); 
            }, 3000);
        }
    }
});

const fetchData = async (mealName) => {
    toastMessage.textContent = "";
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        
        containerResults.innerHTML = ""; 
        
        if (!data.meals) {
            toastMessage.textContent = "No meals found.";
            toastElement.show();
            setTimeout(() => {
                toastElement.hide(); 
                }, 3000);
            return;
        } else {
            displayMeals(data.meals);
        }
    } catch (error) {
        console.error("Fetch error: ", error);
        feedbackMessage.textContent = "An error occurred. Please try again.";
    }
};

const displayMeals = (meals) => {

    containerResults.innerHTML = "";
    meals.forEach((meal) => {
        const card = `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                    </div>
                </div>
            </div>
        `;
        containerResults.innerHTML += card;
    });
};