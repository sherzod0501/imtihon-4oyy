let elForm = document.querySelector(".main__form");
let elUsernameInput = document.querySelector(".main__user-input");
let elPasswordInput = document.querySelector(".main__password-input");
let elError = document.querySelector(".error__login");
let elLogin = document.querySelector(".main__btn");

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let UsernameValue = elUsernameInput.value;
  let PasswordValue = elPasswordInput.value;

  fetch("https://reqres.in/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: UsernameValue,
      password: PasswordValue,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.token) {
        window.localStorage.setItem("token", data.token);
        window.location.replace("main.html");
        elLogin.style.backgroundColor = "green";
        elUsernameInput.setAttribute("style", "border-color: green");
        elPasswordInput.setAttribute("style", "border-color: green");
      } else {
        elLogin.setAttribute("style", "color: white");
        elLogin.style.backgroundColor = "red";
        elUsernameInput.setAttribute("style", "border-color: red");
        elPasswordInput.setAttribute("style", "border-color: red");
        elError.classList.remove("visually-hidden");
      }
    });
  elUsernameInput.value = "";
  elPasswordInput.value = "";
});
elUsernameInput.addEventListener("keydown", function () {
  elUsernameInput.setAttribute("style", "border-color:white;");
  elError.classList.add("visually-hidden");
  elLogin.style.backgroundColor = "white";
});
elPasswordInput.addEventListener("keydown", function () {
  elPasswordInput.setAttribute("style", "border-color:white;");
  elError.classList.add("visually-hidden");
  elLogin.style.backgroundColor = "white";
});
