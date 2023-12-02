import jQuery from "jquery";
import { useConfirmDelete } from "./confirmDelete.js";

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

  useConfirmDelete(".delete-btn", async (id) => {
    await $.ajax({
      url: `/admin/universities/${id}`,
      method: "DELETE",
    }).promise();
    window.location.reload();
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
        url: "/admin/universities",
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
