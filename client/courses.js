import jQuery from "jquery";
import "bootstrap-star-rating";

(($) => {
  $(".review-rating").rating({
    readOnly: true,
    showClear: false,
    min: 0,
    max: 5,
    step: 0.1,
    stars: 5,
  });

  const searchForm = $("#search-form");
  const searchInput = $("#search-input");
  const sortBySelect = $("#sort-by-select");
  const sortBy = sortBySelect.data("value");
  if (sortBy) {
    sortBySelect.val(sortBy);
  }
  searchForm.on("submit", (e) => {
    debugger;
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
})(jQuery);
