
const FORUM_URL = "https://forum.arethtera.com";

async function checkAccount() {
    const accountArea = document.getElementById("accountArea");

    if (!accountArea) return;

    try {
        const response = await fetch(`${FORUM_URL}/api/user/arethtera`, {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Unable to retrieve forum account");
        }

        const data = await response.json();

        if (data.loggedIn && data.loggedInUser) {
            const user = data.loggedInUser;

            accountArea.innerHTML = `
                <span class="welcome-user">
                    Welcome, ${escapeAccountHTML(user.username)}!
                </span>

                <a href="${FORUM_URL}/user/${encodeURIComponent(user.userslug)}">
                    My Account
                </a>

                <a href="${FORUM_URL}/logout">
                    Log Out
                </a>
            `;
        } else {
            showLoggedOut(accountArea);
        }

    } catch (error) {
        console.error("Account status error:", error);
        showLoggedOut(accountArea);
    }
}

function showLoggedOut(container) {
    container.innerHTML = `
        <a href="${FORUM_URL}/login">Log In</a>
        <a href="${FORUM_URL}/register">Create Account</a>
    `;
}

function escapeAccountHTML(value) {
    const element = document.createElement("div");
    element.textContent = value || "";
    return element.innerHTML;
}

document.addEventListener("DOMContentLoaded", checkAccount);
