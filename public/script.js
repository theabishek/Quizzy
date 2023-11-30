function redirectToIndex() {
    window.location.href = 'index.html';
  }

  document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.nav_logo');

    logo.addEventListener('click', redirectToIndex);
  });

  function redirectToAdminLogin() {
    window.location.href = 'authentication.html';
  }

  document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.admin-login');

    logo.addEventListener('click', redirectToAdminLogin);
  });

  