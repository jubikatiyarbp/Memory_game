// ------------------------------------------------------------------------------
// navbar functions
const authURI = "http://localhost:5221/api/Auth/";

let isLoggedIn = false;

function showMessage(messageElement, msg, isSuccess) {
  messageElement.textContent = msg;
  messageElement.style.display = "block";
  messageElement.className = isSuccess ? "message success" : "message";
}

function showTab(tab) {
  document.getElementById("popupTitle").innerText =
    tab === "login" ? "Login" : "Register";
  document.getElementById("loginForm").style.display =
    tab === "login" ? "block" : "none";
  document.getElementById("registerForm").style.display =
    tab === "register" ? "block" : "none";
}

function showloginorlogoutbutton(isLoggedIn) {
  if (isLoggedIn == true) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
}

async function register() {
  let username = document.getElementById("registerUsername").value;
  let password = document.getElementById("registerPassword").value;
  let email = document.getElementById("registerEmail").value;
  const registerData = {
    Username: username,
    Password: password,
    Email: email,
  };
  console.log(username, password, email, registerData);
  const resp = await fetch(`${authURI}register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });
  console.log(`resp - ${resp}`);
  const data = await resp.json();
  let messageElement = document.getElementById("message");
  if (!resp.ok) {
    if (resp.status == 400 && data.errors != {}) {
      let error = "";
      let emailError = data.errors["Email"];
      let passwordError = data.errors["Password"];
      let usernameError = data.errors["Username"];
      if (emailError) {
        error = error + emailError;
      }
      if (passwordError) {
        error = error + " Password is less than 8 characters";
      }
      if (usernameError) {
        error = error + " Username should be 4 charcters long";
      }
      showMessage(messageElement, error, false);
    } else if (resp.status == 400 && data.message != null) {
      showMessage(messageElement, data.errors, false);
      throw new Error(`${data.message}`);
    }
  } else {
    console.log("Error registering user - ", data.message);
    showMessage(messageElement, data.message, true);
  }
}

async function logout() {
  try {
    const authValue = `Bearer ${localStorage.getItem("accessToken")}`;

    const resp = await fetch(`${authURI}logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authValue,
      },
    });
    const data = await resp.json();

    if (!resp.ok) {
      alert(data.message);
      throw new Error(data.message);
    } else {
      // console.log(data);
      isLoggedIn = false;
      localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem('selectedDifficulty');
      showloginorlogoutbutton(isLoggedIn);

      if (window.location.pathname.includes("game.html")) {
        window.location.href = 'index.html';
}
    }
  } catch (error) {
    alert("Logout Unsucessful, Please try after some time");
    console.log("Logout not successful - ", error);
  }
}

async function login() {
  let username = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;
  let loginData = {
    Username: username,
    Password: password,
  };

  const resp = await fetch(`${authURI}login`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });
  // console.log(`resp - ${resp}`);
  const data = await resp.json();

  let messageElement = document.getElementById("message");

  if (!resp.ok) {
      showMessage(messageElement, data.message, false);
      throw new Error(`${data.message}`);
  }
  // console.log(`datra - ${data}`);
  isLoggedIn = true;
  localStorage.setItem("isLoggedIn", isLoggedIn);
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  //remove guest user info from session storage
  sessionStorage.removeItem('guestUserName');
  sessionStorage.removeItem('guestUserScore');
  sessionStorage.removeItem('guestUserTimeTaken');
  sessionStorage.removeItem('isGuestUser');
  sessionStorage.removeItem('selectedDifficulty');

  showMessage(messageElement, "Login successful!", true);

  window.location.href = "game.html";
}

async function checkAccessTokenValidity(accessToken) {
  const resp = await fetch(`${authURI}getUserInfo`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!resp.ok) {
    return false;
  }

  // const data = await resp.json();
  return true;
}

function setupNavbar() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!loginBtn || !logoutBtn) {
    console.error("Navbar elements not found!");
    return;
  }

  loginBtn.addEventListener("click", function () {
    window.location.href = "login.html";
  });

  window.register = register;

  logoutBtn.addEventListener("click", logout);

  window.addEventListener("load", async function () {
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
    const accessToken = localStorage.getItem("accessToken");
    const isAccessTokenValid = await checkAccessTokenValidity(accessToken);
    
    if (isLoggedIn && accessToken && !isAccessTokenValid) {
      isLoggedIn = false;
      localStorage.setItem("isLoggedIn", JSON.stringify(false));
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.window.href = "index.html";
    }
    // console.log(
    //   "just before sending to show button function isLoggedIn = ",
    //   this.localStorage.getItem("isLoggedIn")
    // );
    showloginorlogoutbutton(
      JSON.parse(this.localStorage.getItem("isLoggedIn"))
    );
  });
}
