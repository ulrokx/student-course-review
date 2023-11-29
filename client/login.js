import jQuery from "jquery";

(($) => {
  const setFormError = (message) => {
    $("#login-form-error").text(message);
    $("#login-form-error").show();
  };

  const clearFormError = () => {
    $("#login-form-error").hide();
    $("#login-form-error").text("");
  };

  $("#login-form").on("submit", async (e) => {
    e.preventDefault();
    const email = $("#email-input").val();
    const password = $("#password-input").val();

    if (!email || !password) {
      setFormError("Please enter email and password");
      return;
    }

    const data = {
      email,
      password,
    };

    try {
      const result = await $.ajax({
        method: "POST",
        url: "/auth/login",
        contentType: "application/json",
        data: JSON.stringify(data),
      }).promise();
    } catch (e) {
      if (e.responseJSON) {
        setFormError(e.responseJSON.message);
      }
    }
  });
})(jQuery);
