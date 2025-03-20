/**
 * @jest-environment jsdom
 */

const { fireEvent, render, screen, within } = require('@testing-library/dom');
require('@testing-library/jest-dom'); 
const fs = require('fs');
const path = require('path');

// const html = fs.readFileSync(path.resolve(__dirname, "../login.html"), "utf8");

beforeEach(() => {
  // Load the HTML into the test DOM
  document.body.innerHTML = `
  <div class="login-container">
      <div class="login-box">
          <h2 id="popupTitle">Login</h2>

          <div class="tab-container">
              <button onclick="showTab('login')" id="loginTab">Login</button>
              <button onclick="showTab('register')" id="registerTab">Register</button>
          </div>

          <!-- Login Form -->
          <div id="loginForm" data-testid="login-form">
              <input type="text" id="loginUsername" placeholder="Username">
              <input type="password" id="loginPassword" placeholder="Password">
              <button onclick="login()">Login</button>
          </div>

          <!-- Register Form -->
          <div id="registerForm" data-testid="register-form" style="display: none;">
              <input type="text" id="registerUsername" placeholder="Username">
              <input type="password" id="registerPassword" placeholder="Password">
              <input type="email" id="registerEmail" placeholder="Email">
              <button onclick="register()">Register</button>
          </div>

          <p id="message" class="message"></p>
          <a href="index.html" class="back-link">← Back to Home</a>
      </div>
  </div>
  `;

  // Mock functions since they exist in navbar.js but are not directly available
  window.login = jest.fn();
  window.register = jest.fn();
  window.showTab = jest.fn();
});


describe("Login/Register UI", () => {
  
  test("Renders Login and Register UI elements", () => {
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();

    const loginForm = screen.getByTestId("login-form");
    expect(within(loginForm).getByPlaceholderText("Username")).toBeInTheDocument();
    expect(within(loginForm).getByPlaceholderText("Password")).toBeInTheDocument();

    const registerForm = screen.getByTestId("register-form");
    expect(within(registerForm).getByPlaceholderText("Username")).toBeInTheDocument();
    expect(within(registerForm).getByPlaceholderText("Password")).toBeInTheDocument();
    expect(within(registerForm).getByPlaceholderText("Email")).toBeInTheDocument();
  });

  test('Clicking "Register" tab switches to register form', () => {
    const registerTab = screen.getByRole("button", { name: "Register" }); 
    fireEvent.click(registerTab);
    expect(window.showTab).toHaveBeenCalledWith("register");
  });
});


