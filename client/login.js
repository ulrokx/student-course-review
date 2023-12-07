import jQuery from "jquery";

(($) => {
  const setFormError = (message) => {
    $("#login-form-error").text(message);
    $("#login-form-error").show();
  };

  $("#login-form").on("submit", async (e) => {
    const email = $("#email-input").val();
    const password = $("#password-input").val();

    if (!email || !password) {
      e.preventDefault();
      setFormError("Please enter email and password");
      return;
    }
  });
})(jQuery);
