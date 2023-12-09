import jQuery from "jquery";

(($) => {
  const searchInput = $("#search-input");
  const searchForm = $("#search-form");
  searchForm.on("submit", (e) => {
    debugger;
    const searchQuery = searchInput.val();
    if (searchQuery === "") {
      e.preventDefault();
      window.location.href = window.location.href.split("?")[0];
    }
    if (searchQuery.trim() === "") {
      e.preventDefault();
    }
  });
})(jQuery);
