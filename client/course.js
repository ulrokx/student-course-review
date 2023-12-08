import jQuery from "jquery";
import { useVote } from "./vote.js";

(($) => {
  const reviewIds = $(".review")
    .map((_, review) => $(review).data("_id"))
    .get();
  reviewIds.forEach((_id) => useVote(_id));
})(jQuery);
