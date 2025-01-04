// Login Form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); // Save token to localStorage
            alert('Login successful!');
            window.location.href = '/index.html'; // Redirect to dashboard
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred. Please try again.");
        }
    });
}

// Register Form
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const userData = {};
        formData.forEach((value, key) => {
            userData[key] = value;
        });

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            const data = await response.json();
            alert('Registration successful! Please log in.');
            window.location.href = '/login.html'; // Redirect to login page
        } catch (error) {
            console.error("Registration error:", error);
            alert("An error occurred. Please try again.");
        }
    });
}

// Forgot Password Form
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;

        try {
            const response = await fetch('/api/auth/requestPasswordReset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            alert('Password reset OTP sent to your email.');
            window.location.href = '/resetPassword.html'; // Redirect to reset password page
        } catch (error) {
            console.error("Forgot password error:", error);
            alert("An error occurred. Please try again.");
        }
    });
}

// Reset Password Form
const resetPasswordForm = document.getElementById("resetPasswordForm");
if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const otp = document.getElementById("otp").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('/api/auth/resetPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, password: newPassword, confirmPassword })
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            alert('Password reset successful! Please log in.');
            window.location.href = '/login.html'; // Redirect to login page
        } catch (error) {
            console.error("Reset password error:", error);
            alert("An error occurred. Please try again.");
        }
    });
}
