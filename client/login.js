import jQuery from "jquery";
import { loginSchema } from "../data/validation.js";

(($) => {
  const setFormError = (message) => {
    $("#login-form-error").text(message);
    $("#login-form-error").show();
  };

  $("#login-form").on("submit", async (e) => {
    const email = $("#email-input").val();
    const password = $("#password-input").val();

    const parseResults = loginSchema.safeParse({ email, password });
    if (!parseResults.success) {
      e.preventDefault();
      setFormError(parseResults.error.issues[0].message);
      return;
    }
  });
})(jQuery);
