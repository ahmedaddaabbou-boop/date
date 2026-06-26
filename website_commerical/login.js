const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const rememberMe = document.getElementById('rememberMe');
const loginMessage = document.getElementById('loginMessage');
const forgotPassword = document.getElementById('forgotPassword');

const storedLogin = JSON.parse(localStorage.getItem('techhavenAuth') || 'null');

if (storedLogin) {
  loginEmail.value = storedLogin.email;
  rememberMe.checked = true;
  loginMessage.textContent = 'Auto-filled saved login details. Submit to continue.';
}

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  if (!email || !password) {
    loginMessage.textContent = 'Please provide both email and password.';
    loginMessage.style.color = '#ff5f7a';
    return;
  }

  const user = {
    name: 'Alex',
    email,
    authenticated: true
  };

  if (rememberMe.checked) {
    localStorage.setItem('techhavenAuth', JSON.stringify({ email }));
  } else {
    localStorage.removeItem('techhavenAuth');
  }

  localStorage.setItem('techhavenUser', JSON.stringify(user));
  loginMessage.textContent = 'Login successful! Redirecting to TechHaven...';
  loginMessage.style.color = '#39d98a';
  setTimeout(() => {
    window.location.href = 'techhaven.html';
  }, 1000);
});

forgotPassword.addEventListener('click', () => {
  loginMessage.textContent = 'This demo page does not support password recovery yet. Please login with any valid email.';
  loginMessage.style.color = '#ffb84d';
});
