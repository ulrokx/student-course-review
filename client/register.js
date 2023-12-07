import jQuery from "jquery";

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

    if (!email || !password || !username) {
      e.preventDefault();
      setFormError("Please enter username, email, and password");
      return;
    }

    if (password !== confirmPassword) {
      e.preventDefault();
      setFormError("Passwords do not match");
      return;
    }
  });
})(jQuery);
