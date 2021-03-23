// Global app controller

import Search from "./models/Search";
import * as searchView from "./views/searchView";
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
