import jQuery from "jquery";

(($) => {
  let registrationForm = document.getElementById("register-form");
  const setFormError = (message) => {
    $("#register-form-error").text(message);
    $("#register-form-error").show();
  };

  registrationForm.addEventListener("submit", async (e) => {
    const username = $("#username-input").val();
    const email = $("#email-input").val();
    const password = $("#password-input").val();
    const confirmPassword = $("#confirm-password-input").val();
    let errors = [];
    if (!email || !password || !username) {
      e.preventDefault();
      errors.push("Please enter username, email, and password");
    }
    const usernameRegex = /^(?=.{3,16}$)[a-zA-Z0-9_.-]+$/;
    if (username) {
      if (!usernameRegex.test(username)) {
        e.preventDefault();
        errors.push(
          "Username must be between 3 and 16 characters long and can only contain letters, numbers, underscores, hyphens, and periods",
        );
      }
    }

    if (password) {
      if (password !== confirmPassword) {
        e.preventDefault();
        errors.push("Passwords do not match");
      }
      if (password.length < 8) {
        errors.push("Password must be at least 8 characters");
      }
      if (password.indexOf(" ") !== -1) {
        errors.push("Password cannot have spaces");
      }
      let count = 0;
      for (let i = 0; i <= 9; i++) {
        if (password.indexOf(i) !== -1) {
          count = 1;
        }
      }
      if (count === 0) {
        errors.push("Password must be at least 1 number");
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push("Password must be at least 1 special character");
      }
      let uppercaseLetterPresent = false;
      for (let i = 65; i <= 90; i++) {
        if (password.indexOf(String.fromCharCode(i)) !== -1) {
          uppercaseLetterPresent = true;
          break;
        }
      }
      if (!uppercaseLetterPresent) {
        errors.push("Password must contain at least one capital letter");
      }
    }

    if (errors.length > 0) {
      setFormError(errors.join(", "));
      e.preventDefault();
    } else {
      registrationForm.submit();
    }
  });
})(jQuery);
