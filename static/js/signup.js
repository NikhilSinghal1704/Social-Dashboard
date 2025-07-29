document.addEventListener("DOMContentLoaded", () => {
  const passwordField = document.querySelector("input[name='password1']");
  const emailField = document.querySelector("input[name='email']");
  const usernameField = document.querySelector("input[name='username']");

  const rules = {
    length: document.getElementById("rule-length"),
    personal: document.getElementById("rule-personal"),
    common: document.getElementById("rule-common"),
    numeric: document.getElementById("rule-numeric"),
    alphaNum: document.getElementById("rule-alpha-num"),
    special: document.getElementById("rule-special"),
  };

  const commonPasswords = ["password", "12345678", "qwerty", "letmein", "abc123"];

  function updateRule(ruleElement, conditionMet) {
    ruleElement.classList.toggle("line-through", conditionMet);
    ruleElement.classList.toggle("text-gray-400", conditionMet);
  }

  passwordField?.addEventListener("input", () => {
    const value = passwordField.value.toLowerCase();

    // 1. Length
    updateRule(rules.length, value.length >= 8);

    // 2. Not entirely numeric
    updateRule(rules.numeric, !/^\d+$/.test(value));

    // 3. Common password
    updateRule(rules.common, !commonPasswords.includes(value));

    // 4. Letters and numbers
    updateRule(rules.alphaNum, /[a-zA-Z]/.test(value) && /\d/.test(value));

    // 5. Special character
    updateRule(rules.special, /[^A-Za-z0-9]/.test(value));

    // 6. Personal info similarity
    const emailVal = emailField?.value.toLowerCase() || "";
    const usernameVal = usernameField?.value.toLowerCase() || "";

    // Extract words from email and username
    const emailParts = emailVal.split(/[@._\d]+/).filter(Boolean);
    const usernameParts = usernameVal.split(/[\W_]+/).filter(Boolean);
    const personalParts = [...new Set([...emailParts, ...usernameParts])];

    const tooSimilar = personalParts.some(part => part && value.includes(part));
    updateRule(rules.personal, !tooSimilar);
  });

  // Username availability check
  const usernameStatus = document.createElement("p");
  usernameStatus.className = "text-sm mt-1";
  usernameField?.parentElement.appendChild(usernameStatus);

  usernameField?.addEventListener("input", debounce(async () => {
    const username = usernameField.value.trim();

    if (username.length < 3) {
      usernameStatus.textContent = "Username is too short.";
      usernameStatus.classList.remove("text-green-600");
      usernameStatus.classList.add("text-red-600");
      return;
    }

    try {
      const res = await fetch(`/check-username/?username=${encodeURIComponent(username)}`);
      const data = await res.json();

      if (data.exists) {
        usernameStatus.textContent = "Username is already taken.";
        usernameStatus.classList.remove("text-green-600");
        usernameStatus.classList.add("text-red-600");
      } else {
        usernameStatus.textContent = "Username is available!";
        usernameStatus.classList.remove("text-red-600");
        usernameStatus.classList.add("text-green-600");
      }
    } catch (err) {
      console.error("Error checking username:", err);
      usernameStatus.textContent = "Unable to check username.";
      usernameStatus.classList.remove("text-green-600");
      usernameStatus.classList.add("text-red-600");
    }
  }, 400));

  function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Password confirmation check
  const confirmPasswordField = document.querySelector("input[name='password2']");
  const confirmPasswordStatus = document.createElement("p");
  confirmPasswordStatus.className = "text-sm mt-1";
  confirmPasswordField?.parentElement.appendChild(confirmPasswordStatus);

  function checkPasswordMatch() {
    const pwd1 = passwordField?.value || "";
    const pwd2 = confirmPasswordField?.value || "";

    if (!pwd2) {
      confirmPasswordStatus.textContent = "";
      return;
    }

    if (pwd1 === pwd2) {
      confirmPasswordStatus.textContent = "Passwords match!";
      confirmPasswordStatus.classList.remove("text-red-600");
      confirmPasswordStatus.classList.add("text-green-600");
    } else {
      confirmPasswordStatus.textContent = "Passwords do not match.";
      confirmPasswordStatus.classList.remove("text-green-600");
      confirmPasswordStatus.classList.add("text-red-600");
    }
  }

  passwordField?.addEventListener("input", checkPasswordMatch);
  confirmPasswordField?.addEventListener("input", checkPasswordMatch);

});
