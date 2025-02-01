const homeBtn = document.getElementById("Home-btn");
const recipeContainer = document.getElementById("recipeContainer");
const infoContainer = document.getElementById("infoContainer");
const recipeCard = document.querySelectorAll(".recipe-card");
const recipeImage = document.querySelectorAll(".recipe-image");
const recipeTitle = document.querySelectorAll(".recipe-title");
const search = document.getElementById("search");
const mainSection = document.getElementById("mainSection");

// RecipeInfo Section
const prepTime = document.getElementById("prep-time");
const dishServings = document.getElementById("dish-servings");
const dishtitle = document.getElementById("dishtitle");
const dishsummary = document.getElementById("dishsummary");
const dishImg = document.getElementById("dishImg");
const dishIngredients = document.getElementById("dish-Ingredients");
const dishMethods = document.getElementById("dish-Methods");

const dishCalories = document.getElementById("dish-calories");
const dishFat = document.getElementById("dish-fat");
const dishCarbs = document.getElementById("dish-carbs");
const dishProtein = document.getElementById("dish-protein");
const likedRecipes = document.getElementById("likedRecipes");
const apiKey = "baf0a75bb8954873b7e1ae6547fb887d";
// Fetch recipe data when searched
async function fetchRecipes(query = "") {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=12`
    );

    if (!response.ok) {
      throw new Error("could not fetch resource");
    }

    const data = await response.json();
    recipeInfo(data);
    getFavourite(data);

    if (query === "") {
      displayRecipeOnload(data);
    } else {
      displayRecipeData(data);

      searchRecipe.value = "";
    }
  } catch (error) {
    console.log(error);
  }
}

// Display Recipe onload
function displayRecipeOnload(data) {
  const onloadRecipes = data.results;
  recipeImage.forEach((recipeImage, index) => {
    recipeImage.src = onloadRecipes[index].image;
  });

  recipeTitle.forEach((recipeTitle, index) => {
    recipeTitle.textContent = onloadRecipes[index].title;
  });
}

// Display Recipe Data on search
function displayRecipeData(data) {
  const recipes = data.results;
  recipeImage.forEach((recipeImage, index) => {
    recipeImage.src = recipes[index].image;

    recipeImage.onload = () => {
      // Image loaded successfully
    };

    recipeImage.onerror = () => {
      recipeImage.src = "/imgs/dish.png";
      recipeImage.classList = "fallbackimg";
    };
  });

  recipeTitle.forEach((recipeTitle, index) => {
    recipeTitle.textContent = recipes[index].title;
  });
}

// Search Onclick
search.addEventListener("click", () => {
  const searchRecipe = document.getElementById("searchRecipe");
  if (searchRecipe.value !== "") {
    fetchRecipes(searchRecipe.value);
  }
});

// Fetch default recipes on page load
// document.addEventListener("DOMContentLoaded", () => {
//   fetchRecipes(); // Fetch recipes without a query for onload behavior
// });

// fetch recipe info/nutrition
async function fetchinfo(id) {
  try {
    // recipe info

    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
    );

    // nutruition info

    const nutritionResponse = await fetch(
      `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("no info found ");
    }

    const recipeinfo = await response.json();
    const nutritionInfo = await nutritionResponse.json();
    displayrecipeInfo(recipeinfo, nutritionInfo);
  } catch (error) {
    console.log(error);
  }
}

// lookup recipe information
// onclick it should get the index of the card and match it with the index of the recipe array
// and get the id of that specific recipe and log the recipe info

function recipeInfo(data) {
  const information = data.results;

  recipeCard.forEach((recipe, recipeIndex) => {
    recipe.addEventListener("click", () => {
      information.forEach((info, infoIndex) => {
        if (recipeIndex === infoIndex) {
          fetchinfo(info.id);
          recipeContainer.classList.add("hide-section");
          infoContainer.classList.add("show-section");
        }
      });
    });
  });
}

// Display recipe Information to the recipe section
function displayrecipeInfo(recipeInfo, nutritionInfo) {
  let {
    title,
    summary,
    image,
    servings,
    readyInMinutes,
    extendedIngredients,
    analyzedInstructions: [{ steps }],
  } = recipeInfo;

  let { calories, carbs, fat, protein } = nutritionInfo;

  dishtitle.textContent = title;
  dishsummary.innerHTML = summary;
  dishImg.src = image;
  dishServings.textContent = servings;
  prepTime.textContent = readyInMinutes + "Mins";

  extendedIngredients.forEach((ingredient) => {
    const newIngredient = document.createElement("li");
    newIngredient.textContent = ingredient.original;
    dishIngredients.appendChild(newIngredient);
  });

  steps.forEach((method) => {
    const newMethod = document.createElement("li");
    newMethod.innerHTML = method.step;
    dishMethods.appendChild(newMethod);
  });

  dishCalories.textContent = calories;
  dishCarbs.textContent = carbs;
  dishFat.textContent = fat;
  dishProtein.textContent = protein;
}

// Toogle between recipe card and recipe information screens
// Click to go back to Recipe Card grid
homeBtn.addEventListener("click", () => {
  recipeContainer.style.display = "grid";
  infoContainer.classList.add("hide-section");
});

// Saved recipes

let savedRecipes = [];
function getFavourite(data) {
  let info = data.results;

  document.querySelectorAll("#favourite").forEach((recipe, index) => {
    recipe.addEventListener("click", (e) => {
      e.stopPropagation();
      if (
        !savedRecipes.some(
          (recipe) =>
            recipe[0] === info[index].title && recipe[1] === info[index].image
        )
      ) {
        savedRecipes.push([info[index].title, info[index].image]);
        localStorage.setItem("saved", JSON.stringify(savedRecipes));
      }
    });
  });
}

// Display Saved dishes
const ToggleSavedRecipes = document
  .getElementById("Toggle-saved-recipes")
  .addEventListener("click", () => {
    if (likedRecipes.style.display === "none") {
      likedRecipes.style.display = "block"; // Show the section
      mainSection.style.display = "none";
      displaySavedRecipes();
    } else {
      likedRecipes.style.display = "none"; // Hide the section
      mainSection.style.display = "block";
    }
  });

function displaySavedRecipes() {
  const saved = localStorage.getItem("saved");
  JSON.parse(saved).forEach((likedRecipe) => {
    const likedRecipeCard = document.createElement("div");
    likedRecipeCard.classList.add("recipe-card");
    const likedRecipeImg = document.createElement("img");
    const likedRecipeTitle = document.createElement("h1");

    likedRecipeImg.src = likedRecipe[1];
    likedRecipeTitle.textContent = likedRecipe[0];
    likedRecipeCard.appendChild(likedRecipeImg);
    likedRecipeCard.appendChild(likedRecipeTitle);
    likedRecipes.appendChild(likedRecipeCard);
  });
}
