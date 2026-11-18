
console.log("Arethtera account.js loaded!");

const ACCOUNT_FORUM_URL = "https://forum.arethtera.com";
const ACCOUNT_HOME_URL = "https://arethtera.com/";

async function checkAccount() {
    const accountArea = document.getElementById("accountArea");
    console.log("Account area found:", accountArea);

    if (!accountArea) return;

    try {
        const response = await fetch(
            `${ACCOUNT_FORUM_URL}/api/user/arethtera`,
            { credentials: "include" }
        );

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

                <a href="${ACCOUNT_HOME_URL}platform/">
                    My Account
                </a>

                <a href="#" id="accountLogout">
                    Log Out
                </a>
            `;

            document.getElementById("accountLogout")
                .addEventListener("click", logoutAccount);

        } else {
            showLoggedOut(accountArea);
        }

    } catch (error) {
        console.error("Account status error:", error);
        showLoggedOut(accountArea);
    }
}

async function logoutAccount(event) {
    event.preventDefault();

    const logoutButton = document.getElementById("accountLogout");

    if (logoutButton) {
        logoutButton.textContent = "Logging Out...";
        logoutButton.style.pointerEvents = "none";
    }

    try {
        const response = await fetch(
            `${ACCOUNT_FORUM_URL}/api/v3/users/logout`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Forum logout failed");
        }

        window.location.replace(ACCOUNT_HOME_URL);

    } catch (error) {
        console.error("Logout error:", error);

        window.location.href =
            `${ACCOUNT_FORUM_URL}/logout?loggedOut=1`;
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
