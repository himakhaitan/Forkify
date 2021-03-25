// Global app controller

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import {elements, renderLoader, clearLoader, elementStrings} from './views/base';

// GLOBAL STATE
// -- CURRENT RECEPIE
// -- SEARCH OBJECT
// -- SHOPPING LIST OBJECT
// -- Liked Recepie
const state = {};

const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();

  if (query) {
      // 2) New search object and add to state
      state.search = new Search(query);

      // 3) Prepare UI for results
      searchView.clearInput();
      searchView.clearResults();
      renderLoader(elements.searchRes);

      try {
          // 4) Search for recipes
          await state.search.getResults();
  
          // 5) Render results on UI
          clearLoader();
          searchView.renderResults(state.search.result);
      } catch (err) {
          alert('Something wrong with the search...');
          clearLoader();
      }
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
      const goToPage = parseInt(btn.dataset.goto, 10);
      searchView.clearResults();
      searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * 
 *  Recipe Controller
 */

const controlRecipe = async () => {
  // Get ID from URL
  const id  = window.location.hash.replace('#', '');
  console.log(id)
  if(id) {
    // Get prepared Ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe)
    // Highlight selected search 
    if (state.search) {
      searchView.highlightSelected(id); 
    }
    
    
    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
        // get recipe data and parse ingredients
    await state.recipe.getRecipe();
    state.recipe.parseIngredients();
    // calcTime
    state.recipe.calcTime();
    // CalcServings
    state.recipe.calcServings();
    // Render Service
    clearLoader();
    console.log(state.recipe)
    recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert(`Something wen't wrong🥺!`)
    }
  
  }
};

// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('reload', controlRecipe);

['hashchange', 'reload'].forEach(event => window.addEventListener(event, controlRecipe));


// Handlin Recipe Buttons

elements.recipe.addEventListener('click', e=> {
  if(e.target.matches('.btn-decrease, .btn-decrease *')){
    if(state.recipe.servings >1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe)
    }
  
  }
  else if(e.target.matches('.btn-increase, .btn-increase *')){
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe)
  }
})