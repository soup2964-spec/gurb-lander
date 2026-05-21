const form = document.querySelector(".signup");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.querySelector('input[name="email"]');
    if (!email?.value) return;

    const button = form.querySelector("button");
    const originalText = button.textContent;
    button.textContent = "You're on the list!";
    button.disabled = true;
    email.value = "";

    window.setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 2500);
  });
}
