(($) => {
  const nameInput = $("#name-input");
  const locationInput = $("#location-input");
  const formSubmit = $("#university-form-submit");

  formSubmit.prop("disabled", true);

  let initialName = nameInput.val();
  let initialLocation = locationInput.val();

  const updateUniversityError = $("#university-form-error");
  const setFormError = (message) => {
    updateUniversityError.show();
    updateUniversityError.text(message);
  };

  const clearFormError = () => {
    updateUniversityError.hide();
    updateUniversityError.text("");
  };

  const updateSubmitDisabled = () => {
    if (
      nameInput.val() !== initialName ||
      locationInput.val() !== initialLocation
    ) {
      formSubmit.prop("disabled", false);
    } else {
      formSubmit.prop("disabled", true);
    }
  };

  nameInput.on("change keydown paste input", updateSubmitDisabled);

  locationInput.on("change keydown paste input", updateSubmitDisabled);

  $("#university-form").on("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.val().trim();
    const location = locationInput.val().trim();

    if (name === initialName && location === initialLocation) {
      return;
    }

    if (!name || !location) {
      return setFormError("Please fill out all fields");
    }

    try {
      const result = await $.ajax({
        url: window.location.href,
        method: "PATCH",
        data: JSON.stringify({ name, location }),
        contentType: "application/json",
      }).promise();
      clearFormError();
      initialName = name;
      initialLocation = location;
      updateSubmitDisabled();
    } catch (e) {
      if (e.responseJSON) {
        setFormError(e.responseJSON.message);
      }
    }
  });
})(jQuery);
