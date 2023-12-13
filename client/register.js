import jQuery from "jquery";
import { registerSchema } from "../data/validation.js";

(($) => {
  const setFormError = (message) => {
    $("#register-form-error").text(message);
    $("#register-form-error").show();
  };

  $("#register-form").on("submit", async (e) => {
    const username = $("#username-input").val();
    const email = $("#email-input").val();
    const password = $("#password-input").val();
    const confirmPassword = $("#confirm-password-input").val();

    if (password !== confirmPassword) {
      e.preventDefault();
      setFormError("Passwords do not match");
      return;
    }

    const parseResults = registerSchema.safeParse({
      username,
      email,
      password,
    });
    if (!parseResults.success) {
      e.preventDefault();
      setFormError(parseResults.error.issues[0].message);
      return;
    }
  });
})(jQuery);
