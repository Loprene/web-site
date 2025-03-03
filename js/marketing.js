document.addEventListener("DOMContentLoaded", function () {
    const registerSection = document.getElementById("register-section");
    const loginSection = document.getElementById("login-section");
    const userSection = document.getElementById("user-section");
    const downloadSection = document.getElementById("download-section");
    const reviewForm = document.getElementById("review-form");
    const pendingReviewsSection = document.getElementById("pending-reviews");
    const userRoleDisplay = document.getElementById("user-role");
    const reviewContainer = document.getElementById("reviews-container");
    
    let users = JSON.parse(localStorage.getItem("users")) || {};
    let role = localStorage.getItem("role");
    let approvedReviews = JSON.parse(localStorage.getItem("approvedReviews")) || [];
    let pendingReviews = JSON.parse(localStorage.getItem("pendingReviews")) || [];

    function updateUI() {
        if (role) {
            registerSection.style.display = "none";
            loginSection.style.display = "none";
            userSection.style.display = "block";
            downloadSection.style.display = "block";
            reviewForm.style.display = "block";

            if (role === "admin") {
                pendingReviewsSection.style.display = "block";
                userRoleDisplay.innerText = "Admin";
            } else {
                userRoleDisplay.innerText = "User";
            }
        } else {
            registerSection.style.display = "block";
            loginSection.style.display = "none";
            userSection.style.display = "none";
            downloadSection.style.display = "none";
            reviewForm.style.display = "none";
            pendingReviewsSection.style.display = "none";
        }
        displayApprovedReviews();
        displayPendingReviews();
    }

    window.register = function () {
        let username = document.getElementById("reg-username").value.trim();
        let password = document.getElementById("reg-password").value.trim();
        let confirmPassword = document.getElementById("reg-confirm-password").value.trim();
        let isAdmin = document.getElementById("admin-checkbox")?.checked || false;
        let errorMessage = document.getElementById("reg-error-message");

        if (!username || !password || !confirmPassword) {
            errorMessage.innerText = "All fields are required!";
            return;
        }

        if (users[username]) {
            errorMessage.innerText = "Username already exists!";
            return;
        }

        if (password !== confirmPassword) {
            errorMessage.innerText = "Passwords do not match!";
            return;
        }

        users[username] = { password: password, role: isAdmin ? "admin" : "user" };
        localStorage.setItem("users", JSON.stringify(users));

        errorMessage.innerText = "Account created successfully!";
        setTimeout(() => {
            showLogin();
        }, 1000);
    };

    window.login = function () {
        let username = document.getElementById("login-username").value.trim();
        let password = document.getElementById("login-password").value.trim();
        let errorMessage = document.getElementById("login-error-message");

        if (users[username] && users[username].password === password) {
            localStorage.setItem("role", users[username].role);
            role = users[username].role;
            updateUI();
        } else {
            errorMessage.innerText = "Incorrect username or password!";
        }
    };

    window.logout = function () {
        localStorage.removeItem("role");
        role = null;
        updateUI();
    };

    window.showLogin = function () {
        registerSection.style.display = "none";
        loginSection.style.display = "block";
    };

    window.showRegister = function () {
        registerSection.style.display = "block";
        loginSection.style.display = "none";
    };

    // Ajout de commentaire
    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let commentText = document.getElementById("comment-text").value.trim();

        if (!commentText) {
            alert("Le commentaire ne peut pas être vide !");
            return;
        }

        let username = localStorage.getItem("role") || "Guest";

        if (role === "admin") {
            approvedReviews.push({ username, comment: commentText });
            localStorage.setItem("approvedReviews", JSON.stringify(approvedReviews));
        } else {
            pendingReviews.push({ username, comment: commentText });
            localStorage.setItem("pendingReviews", JSON.stringify(pendingReviews));
        }

        document.getElementById("comment-text").value = ""; // Effacer le champ après envoi
        displayPendingReviews();
        displayApprovedReviews();
    });

    // Affichage des avis en attente pour Admin
    function displayPendingReviews() {
        if (role !== "admin") return; // Seul un admin peut voir cette section

        let pendingContainer = document.getElementById("pending-reviews-container");
        pendingContainer.innerHTML = "";

        pendingReviews.forEach((review, index) => {
            let reviewDiv = document.createElement("div");
            reviewDiv.classList.add("review");
            reviewDiv.innerHTML = `
                <strong>${review.username}</strong>: ${review.comment} 
                <button onclick="approveReview(${index})">✔ Approve</button> 
                <button onclick="deleteReview(${index}, 'pending')">❌ Delete</button>`;
            pendingContainer.appendChild(reviewDiv);
        });
    }

    // Affichage des avis approuvés
    function displayApprovedReviews() {
        reviewContainer.innerHTML = "";

        approvedReviews.forEach((review) => {
            let reviewDiv = document.createElement("div");
            reviewDiv.classList.add("review");
            reviewDiv.innerHTML = `<strong>${review.username}</strong>: ${review.comment}`;
            reviewContainer.appendChild(reviewDiv);
        });
    }

    // Approuver un avis
    window.approveReview = function (index) {
        let approvedReview = pendingReviews.splice(index, 1)[0];
        approvedReviews.push(approvedReview);

        localStorage.setItem("pendingReviews", JSON.stringify(pendingReviews));
        localStorage.setItem("approvedReviews", JSON.stringify(approvedReviews));

        displayPendingReviews();
        displayApprovedReviews();
    };

    // Supprimer un avis
    window.deleteReview = function (index, type) {
        if (type === "pending") {
            pendingReviews.splice(index, 1);
            localStorage.setItem("pendingReviews", JSON.stringify(pendingReviews));
            displayPendingReviews();
        } else if (type === "approved") {
            approvedReviews.splice(index, 1);
            localStorage.setItem("approvedReviews", JSON.stringify(approvedReviews));
            displayApprovedReviews();
        }
    };

    updateUI();
});
