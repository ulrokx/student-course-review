import jQuery from "jquery";
import "bootstrap-star-rating";
import { useCourseSearch } from "./coursesSearch.js";

(($) => {
  $(".review-rating").rating({
    readOnly: true,
    showClear: false,
    min: 0,
    max: 5,
    step: 0.1,
    stars: 5,
  });
  useCourseSearch();
})(jQuery);
