// Global app controller

import Search from "./models/Search";
import * as searchView from "./views/searchView";
import {elements} from './views/base';

// GLOBAL STATE
// -- CURRENT RECEPIE
// -- SEARCH OBJECT
// -- SHOPPING LIST OBJECT
// -- Liked Recepie
const state = {};

const controlSearch = async () => {
  // Get the query
  const query = searchView.getInput();
  console.log(query)

  if (query) {
    // New Search Object and add it to the state
    state.search = new Search(query);

    // Prepare UI for results

    // Search for Recipe

    await state.search.getResults();

    // render results on UI

    searchView.clearResults();
    searchView.renderResults(state.search.result);
    searchView.clearInput();
  }
};
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
