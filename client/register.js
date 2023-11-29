import jQuery from "jquery";

(($) => {
  const setFormError = (message) => {
    $("#register-form-error").text(message);
    $("#register-form-error").show();
  };

  const clearFormError = () => {
    $("#register-form-error").hide();
    $("#register-form-error").text("");
  };

  $("#register-form").on("submit", async (e) => {
    e.preventDefault();
    const username = $("#username-input").val();
    const email = $("#email-input").val();
    const password = $("#password-input").val();
    const confirmPassword = $("#confirm-password-input").val();

    if (!email || !password || !username) {
      setFormError("Please enter username, email, and password");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    const data = {
      username,
      email,
      password,
    };

    try {
      const result = await $.ajax({
        method: "POST",
        url: "/auth/register",
        contentType: "application/json",
        data: JSON.stringify(data),
      }).promise();
      window.location.replace("/");
    } catch (e) {
      if (e.responseJSON) {
        setFormError(e.responseJSON.message);
      }
    }
  });
})(jQuery);
