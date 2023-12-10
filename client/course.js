import jQuery from "jquery";
import { useVote } from "./vote.js";
import { createReviewSchema } from "../data/validation.js";
import "bootstrap-star-rating";
import { useConfirmDelete } from "./confirmDelete.js";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(PieController, ArcElement, Tooltip, Legend);

(($) => {
  const reviewIds = $(".review")
    .map((_, review) => $(review).data("_id"))
    .get();
  reviewIds.forEach((_id) => useVote(_id));

  $(".review-rating").rating({ displayOnly: true });

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

  useConfirmDelete(".delete-btn", async (id) => {
    const result = await $.ajax({
      url: `/reviews/${id}`,
      method: "DELETE",
    });
    window.location.reload();
  });

  const pie = $("#ratings-pie");

  const data = pie.data("data");

  const chart = new Chart(pie, {
    type: "pie",
    data: {
      labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
      datasets: [
        {
          label: "Ratings",
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
        },
      ],
    },
  });
})(jQuery);
