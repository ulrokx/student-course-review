import jQuery from "jquery";
import {
  createCourseSchema,
  updateUniversitySchema,
} from "../data/validation.js";
import { useEditList } from "./editList.js";
import { useConfirmDelete } from "./confirmDelete.js";

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

  const updateSubmitDisabledUniversity = () => {
    if (
      nameInput.val() !== initialName ||
      locationInput.val() !== initialLocation
    ) {
      formSubmit.prop("disabled", false);
    } else {
      formSubmit.prop("disabled", true);
    }
  };

  nameInput.on("change keydown paste input", updateSubmitDisabledUniversity);

  locationInput.on(
    "change keydown paste input",
    updateSubmitDisabledUniversity,
  );

  $("#university-form").on("submit", async (e) => {
    const name = nameInput.val().trim();
    const location = locationInput.val().trim();

    const parseResults = updateUniversitySchema.safeParse({ name, location });
    if (!parseResults.success) {
      e.preventDefault();
      return setFormError(parseResults.error.errors[0].message);
    }

    try {
      const result = await $.ajax({
        url: window.location.href,
        method: "PATCH",
        data: JSON.stringify({ name, location }),
        contentType: "application/json",
      }).promise();
      window.location.reload();
    } catch (e) {
      if (e.responseJSON) {
        setFormError(e.responseJSON.message);
      }
    }
  });

  const updateSubmitDisabledCourse = () => {
    const courseName = courseNameInput.val().trim();
    const courseCode = courseCodeInput.val().trim();
    const professors = getProfessors();
    const parseResults = createCourseSchema.safeParse({
      courseName,
      courseCode,
      professors,
    });
    if (!parseResults.success) {
      return courseFormSubmit.attr("disabled", true);
    }
    courseFormSubmit.attr("disabled", false);
  };

  const courseNameInput = $("#course-name-input");
  const courseCodeInput = $("#course-code-input");
  const getProfessors = useEditList("professors", updateSubmitDisabledCourse);
  const courseFormSubmit = $("#course-form-submit");

  courseFormSubmit.attr("disabled", true);

  courseNameInput.on("change keydown paste input", updateSubmitDisabledCourse);
  courseCodeInput.on("change keydown paste input", updateSubmitDisabledCourse);

  $("#course-form").on("submit", async (e) => {
    e.preventDefault();
    const courseName = courseNameInput.val().trim();
    const courseCode = courseCodeInput.val().trim();
    const professors = getProfessors();

    const parseResults = createCourseSchema.safeParse({
      courseName,
      courseCode,
      professors,
    });
    if (!parseResults.success) {
      return setFormError(parseResults.error.errors[0].message);
    }
    clearFormError();

    try {
      const result = await $.ajax({
        url: window.location.href,
        method: "POST",
        data: JSON.stringify(parseResults.data),
        contentType: "application/json",
      }).promise();
      window.location.reload();
    } catch (e) {
      console.error(e);
      setFormError(e.responseJSON.message);
    }
  });

  useConfirmDelete(".delete-btn", async (id) => {
    await $.ajax({
      url: `/admin/courses/${id}`,
      method: "DELETE",
    }).promise();
    window.location.reload();
  });
})(jQuery);
