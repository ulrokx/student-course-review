import jQuery from "jquery";
import { useEditList } from "./editList.js";
import { listEq } from "./util.js";
import { updateCourseSchema } from "../data/validation.js";

(($) => {
  let initialName = $("#course-name-input").val();
  let initialCode = $("#course-code-input").val();

  const courseNameInput = $("#course-name-input");
  const courseCodeInput = $("#course-code-input");
  const courseFormSubmit = $("#course-form-submit");

  const courseFormError = $("#course-form-error");

  const setFormError = (message) => {
    courseFormError.text(message);
    courseFormError.show();
  };

  const clearFormError = () => {
    courseFormError.hide();
    courseFormError.text("");
  };

  courseFormSubmit.attr("disabled", true);

  const updateSubmitDisabled = () => {
    if (
      $("#course-name-input").val() !== initialName ||
      $("#course-code-input").val() !== initialCode ||
      !listEq(getProfessors(), initialProfessors)
    ) {
      $("#course-form-submit").attr("disabled", false);
    } else {
      $("#course-form-submit").attr("disabled", true);
    }
  };
  const getProfessors = useEditList("professors", updateSubmitDisabled);

  const initialProfessors = getProfessors();

  courseNameInput.on("change keydown paste input", updateSubmitDisabled);
  courseCodeInput.on("change keydown paste input", updateSubmitDisabled);
  const courseForm = $("#course-form");

  courseForm.on("submit", async (e) => {
    e.preventDefault();
    const courseName = courseNameInput.val().trim();
    const courseCode = courseCodeInput.val().trim();
    const professors = getProfessors();
    const parseResults = updateCourseSchema.safeParse({
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
        method: "PATCH",
        data: JSON.stringify(parseResults.data),
        contentType: "application/json",
      }).promise();
      window.location.reload();
    } catch (e) {
      console.error(e);
      setFormError(e.responseJSON.message);
    }
  });
})(jQuery);
