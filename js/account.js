
console.log("Arethtera account.js loaded!");

const ACCOUNT_FORUM_URL = "https://forum.arethtera.com";
const ACCOUNT_HOME_URL = "https://arethtera.com/";
const PLATFORM_URL = "https://arethtera.com/platform/";

async function checkAccount() {
    const accountArea = document.getElementById("accountArea");

    console.log("Account area found:", accountArea);

    if (!accountArea) return;

    try {
        const response = await fetch(
            `${ACCOUNT_FORUM_URL}/api/user/arethtera`,
            {
                credentials: "include"
            }
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

                <a href="${PLATFORM_URL}">
                    My Account
                </a>

                <a href="#" id="accountLogout">
                    Log Out
                </a>
            `;

            document
                .getElementById("accountLogout")
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
        // Retrieve NodeBB homepage and CSRF token
        const pageResponse = await fetch(
            `${ACCOUNT_FORUM_URL}/`,
            {
                credentials: "include"
            }
        );

        if (!pageResponse.ok) {
            throw new Error("Unable to retrieve NodeBB homepage");
        }

        const pageHTML = await pageResponse.text();

        // Find NodeBB CSRF token
        const csrfMatch = pageHTML.match(
            /"csrf_token"\s*:\s*"([^"]+)"/
        );

        if (!csrfMatch) {
            throw new Error("NodeBB CSRF token not found");
        }

        const csrfToken = csrfMatch[1];

        console.log("NodeBB CSRF token retrieved.");

        // Submit the verified NodeBB logout route
        const logoutResponse = await fetch(
            `${ACCOUNT_FORUM_URL}/logout`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-Csrf-Token": csrfToken,
                    "X-Requested-With": "XMLHttpRequest"
                }
            }
        );

        if (!logoutResponse.ok) {
            throw new Error(
                `NodeBB logout failed: ${logoutResponse.status}`
            );
        }

        // Verify the forum session is actually logged out
        const verifyResponse = await fetch(
            `${ACCOUNT_FORUM_URL}/api/user/arethtera`,
            {
                credentials: "include"
            }
        );

        const verifyData = await verifyResponse.json();

        if (verifyData.loggedIn) {
            throw new Error("Forum session is still active");
        }

        // Return to the landing page
        window.location.replace(ACCOUNT_HOME_URL);

    } catch (error) {
        console.error("Logout error:", error);

        if (logoutButton) {
            logoutButton.textContent = "Log Out";
            logoutButton.style.pointerEvents = "auto";
        }

        alert(
            "Logout could not be completed. Please check the browser console."
        );
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
