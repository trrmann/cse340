document.addEventListener('DOMContentLoaded', function () {
  const showPasswordLoginBtn = document.getElementById('show-password-login');
  if (showPasswordLoginBtn) {
    showPasswordLoginBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const passwordInput = document.getElementById('password');
      const type = passwordInput.getAttribute('type');
      if (type == 'password') {
        passwordInput.setAttribute('type', 'text');
        showPasswordLoginBtn.innerText = 'Hide Password';
      } else {
        passwordInput.setAttribute('type', 'password');
        showPasswordLoginBtn.innerText = 'Show Password';
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', function () {
  const showPasswordBtn = document.getElementById('show-password');
  if (showPasswordBtn) {
    showPasswordBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const passwordInput = document.getElementById('account_password');
      const type = passwordInput.getAttribute('type');
      if (type == 'password') {
        passwordInput.setAttribute('type', 'text');
        showPasswordBtn.innerText = 'Hide Password';
      } else {
        passwordInput.setAttribute('type', 'password');
        showPasswordBtn.innerText = 'Show Password';
      }
    });
  }
});
