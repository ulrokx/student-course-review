import jQuery from "jquery";
import { useVote } from "./vote.js";
import { createReviewSchema } from "../data/validation.js";
import "bootstrap-star-rating";

(($) => {
  const reviewIds = $(".review")
    .map((_, review) => $(review).data("_id"))
    .get();
  reviewIds.forEach((_id) => useVote(_id));

  const reviewRating = $("#rating-input");
  reviewRating.rating({ showClear: false });
  const reviewContent = $("#content-input");
  const courseId = window.location.pathname.split("/")[2].slice(0, 24);

  const reviewForm = $("#review-form");

  reviewForm.attr("action", `/reviews/${courseId}`);

  reviewForm.on("submit", (e) => {
    const rating = reviewRating.val();
    const content = reviewContent.val();
    const parseResults = createReviewSchema.safeParse({
      rating,
      content,
    });
    if (!parseResults.success) {
      e.preventDefault();
    }
  });
})(jQuery);
