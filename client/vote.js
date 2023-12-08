import $ from "jquery";

export const useVote = (_id) => {
  debugger;
  const container = $(`#${_id}-vote`);
  let currentVote = container.data("currentvote");
  let score = container.data("score");
  const scoreText = $(`#${_id}-score`);
  const upBtn = $(`#${_id}-up-btn`);
  const downBtn = $(`#${_id}-down-btn`);
  const upSvg = $(`#${_id}-thumbs-up`);
  const upSvgFilled = $(`#${_id}-thumbs-up-fill`);
  const downSvg = $(`#${_id}-thumbs-down`);
  const downSvgFilled = $(`#${_id}-thumbs-down-fill`);

  const updateSelected = (vote) => {
    if (vote === "upvote") {
      upSvgFilled.show();
      upSvg.hide();
      downSvgFilled.hide();
      downSvg.show();
    } else if (vote === "downvote") {
      upSvgFilled.hide();
      upSvg.show();
      downSvgFilled.show();
      downSvg.hide();
    } else {
      upSvgFilled.hide();
      upSvg.show();
      downSvgFilled.hide();
      downSvg.show();
    }
  };

  updateSelected(currentVote);

  const handleButtonClick = (vote) => async (e) => {
    updateSelected(vote);
    score = parseInt(scoreText.text());
    if (vote === "upvote") {
      score +=
        currentVote === "upvote" ? -1 : currentVote === "downvote" ? 2 : 1;
    } else {
      score +=
        currentVote === "downvote" ? -1 : currentVote === "upvote" ? -2 : -1;
    }
    scoreText.text(score);
    try {
      const result = await $.ajax({
        url: "/reviews/vote",
        type: "POST",
        data: { reviewId: _id, vote: vote === currentVote ? "novote" : vote },
      }).promise();
      currentVote = result.currentVote;
      score = result.score;
      scoreText.text(score);
      updateSelected(currentVote);
    } catch (e) {
      if (e.responseJSON?.status === 401) {
        window.location.href = `/auth/login?redirect=${window.location.pathname}`;
      }
    }
  };
  upBtn.click(handleButtonClick("upvote"));
  downBtn.click(handleButtonClick("downvote"));
};
