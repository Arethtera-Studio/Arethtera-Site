console.log("Arethtera account.js loaded!");
const ACCOUNT_FORUM_URL = "https://forum.arethtera.com";
const PLATFORM_URL = "https://arethtera.com/platform/";

async function checkAccount() {
    const accountArea = document.getElementById("accountArea");
    console.log("Account area found:", accountArea);
    if (!accountArea) return;

    try {
        const response = await fetch(`${ACCOUNT_FORUM_URL}/api/user/arethtera`, {
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

                <a href="${PLATFORM_URL}">
                    My Account
                </a>

                <a href="${ACCOUNT_FORUM_URL}/logout">
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
        <a href="${ACCOUNT_FORUM_URL}/login">Log In</a>
        <a href="${ACCOUNT_FORUM_URL}/register">Create Account</a>
    `;
}

function escapeAccountHTML(value) {
    const element = document.createElement("div");
    element.textContent = value || "";
    return element.innerHTML;
}

document.addEventListener("DOMContentLoaded", checkAccount);
