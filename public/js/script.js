document.addEventListener('DOMContentLoaded', function () {
  // Password toggle logic (existing)
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

  // Custom client-side validation for add-classification
  const addClassificationForm = document.getElementById(
    'addClassificationForm'
  );
  if (addClassificationForm) {
    addClassificationForm.addEventListener('submit', function (e) {
      const nameInput = document.getElementById('classification_name');
      const value = nameInput.value.trim();
      const errorList = document.querySelector('.errors');
      if (errorList) errorList.innerHTML = '';
      let errors = [];
      if (!value) {
        errors.push('Classification name is required.');
      } else if (!/^[A-Za-z0-9]+$/.test(value)) {
        errors.push(
          'Classification name must be alphanumeric with no spaces or special characters.'
        );
      }
      if (errors.length) {
        e.preventDefault();
        let ul = errorList || document.createElement('ul');
        ul.className = 'errors';
        ul.innerHTML = '';
        errors.forEach(function (msg) {
          let li = document.createElement('li');
          li.textContent = msg;
          ul.appendChild(li);
        });
        if (!errorList)
          addClassificationForm.parentNode.insertBefore(
            ul,
            addClassificationForm
          );
        nameInput.focus();
      }
    });
  }

  // Custom client-side validation for add-inventory
  const addInventoryForm = document.getElementById('addInventoryForm');
  if (addInventoryForm) {
    addInventoryForm.addEventListener('submit', function (e) {
      let errors = [];
      function val(id) {
        return (document.getElementById(id) || { value: '' }).value.trim();
      }
      if (!val('inv_vin')) errors.push('VIN is required.');
      if (!val('inv_make')) errors.push('Make is required.');
      if (!val('inv_model')) errors.push('Model is required.');
      const year = val('inv_year');
      if (!year || year.length !== 4 || isNaN(Number(year)))
        errors.push('Year must be 4 digits.');
      if (!val('inv_description')) errors.push('Description is required.');
      const classification =
        val('classificationList') || val('classification_id');
      if (!classification) errors.push('Classification is required.');
      // Optionally add more checks for price, miles, color, etc.
      const errorList = document.querySelector('.errors');
      if (errorList) errorList.innerHTML = '';
      if (errors.length) {
        e.preventDefault();
        let ul = errorList || document.createElement('ul');
        ul.className = 'errors';
        ul.innerHTML = '';
        errors.forEach(function (msg) {
          let li = document.createElement('li');
          li.textContent = msg;
          ul.appendChild(li);
        });
        if (!errorList)
          addInventoryForm.parentNode.insertBefore(ul, addInventoryForm);
        addInventoryForm.querySelector('input, textarea, select').focus();
      }
    });
  }
});
