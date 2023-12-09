import jQuery from "jquery";

($) => {
  const searchInput = $("#search-input");
  const searchForm = $("#search-form");
  searchForm.on("submit", (e) => {
    const searchQuery = searchInput.val();
    if (searchQuery.trim() === "") {
      e.preventDefault();
    }
  });
};
