(($) => {
  const createUniversityError = $("#university-form-error");
  const setFormError = (message) => {
    createUniversityError.show();
    createUniversityError.text(message);
  };

  const clearFormError = () => {
    createUniversityError.hide();
    createUniversityError.text("");
  };

  let pendingDeleteId = undefined;

  $(".delete-btn").on("click", async (e) => {
    e.stopPropagation();
    if (pendingDeleteId === e.target.dataset.id) {
      await $.ajax({
        url: `/admin/university/${e.target.dataset.id}`,
        method: "DELETE",
      }).promise();
      window.location.reload();
    } else {
      $(".delete-btn").text("Delete");
      $(".delete-btn").removeClass("btn-danger");
      $(".delete-btn").addClass("btn-warning");
      pendingDeleteId = e.target.dataset.id;
      e.target.innerText = "Confirm Delete";
      e.target.classList.add("btn-danger");
      e.target.classList.remove("btn-warning");
    }
  });

  $(document).on("click", async (e) => {
    console.log("yo");
    $(".delete-btn").text("Delete");
    $(".delete-btn").removeClass("btn-danger");
    $(".delete-btn").addClass("btn-warning");
    pendingDeleteId = undefined;
  });

  $("#university-form").on("submit", async (e) => {
    e.preventDefault();

    const name = $("#name-input").val().trim();
    const location = $("#location-input").val().trim();

    if (!name || !location) {
      return setFormError("Please fill out all fields");
    }

    try {
      const result = await $.ajax({
        url: "/admin/university",
        method: "POST",
        data: JSON.stringify({ name, location }),
        contentType: "application/json",
      }).promise();
      window.location.reload();
      clearFormError();
    } catch (e) {
      if (e.responseJSON) {
        setFormError(e.responseJSON.message);
      }
    }
  });
})(jQuery);
