export const useCourseSearch = () => {
  const searchForm = $("#search-form");
  const searchInput = $("#search-input");
  const sortBySelect = $("#sort-by-select");
  const sortBy = sortBySelect.data("value");
  if (sortBy) {
    sortBySelect.val(sortBy);
  }
  searchForm.on("submit", (e) => {
    const searchQuery = searchInput.val();
    const sortBy = sortBySelect.val();
    // if there is no query, load all
    if (sortBy === "" && searchQuery === "") {
      return;
    }
    // allow just sortBy
    if (sortBy && searchQuery === "") {
      return;
    }
    // don't allow empty search
    if (searchQuery.trim() === "") {
      e.preventDefault();
    }
  });
};
