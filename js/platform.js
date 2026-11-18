
const FORUM_BASE_URL = "https://forum.arethtera.com";
const LANDING_PAGE_URL = "https://arethtera.com/";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Load the signed-in NodeBB profile
  loadPlayerProfile();

  // Profile dropdown
  const profileButton = document.getElementById("profileButton");
  const profileMenu = document.getElementById("profileMenu");

  profileButton.addEventListener("click", () => {
    const isOpen = profileButton.getAttribute("aria-expanded") === "true";
    profileButton.setAttribute("aria-expanded", String(!isOpen));
    profileMenu.hidden = isOpen;
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".profile-wrap")) {
      profileMenu.hidden = true;
      profileButton.setAttribute("aria-expanded", "false");
    }
  });

  // Sidebar navigation
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("mobileMenuToggle");

  menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".side-link").forEach(link => {
    link.addEventListener("click", (event) => {
    if (link.id === "platformLogout") {
      event.preventDefault();

      console.log("PLATFORM LOGOUT CLICKED");

      alert("Logout button detected. Starting logout...");

      logoutFromArethtera();
      return;
    }

      document.querySelectorAll(".side-link").forEach(item => item.classList.remove("active"));
      link.classList.add("active");
      sidebar.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Game modal
  const modal = document.getElementById("gameModal");
  const closeModal = () => { modal.hidden = true; };

  document.getElementById("launchButton").addEventListener("click", () => {
    modal.hidden = false;
  });

  document.getElementById("launchInfo").addEventListener("click", () => {
    modal.hidden = false;
  });

  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOkay").addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });
});

async function loadPlayerProfile() {
  const nameTarget = document.getElementById("playerName");

  try {
    const response = await fetch(`${FORUM_BASE_URL}/api/user/arethtera`, {
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`Forum API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.loggedIn && data.loggedInUser?.username) {
      nameTarget.textContent = data.loggedInUser.username;
    } else {
      nameTarget.textContent = "Guest";
    }

  } catch (error) {
    console.warn("Could not load forum profile.", error);
    nameTarget.textContent = "Guest";
  }
}

// Shared platform logout handler
async function logoutFromArethtera() {
  try {
    // Retrieve the NodeBB homepage
    const pageResponse = await fetch(`${FORUM_BASE_URL}/`, {
      credentials: "include"
    });

    if (!pageResponse.ok) {
      throw new Error("Could not contact NodeBB");
    }

    const html = await pageResponse.text();

    // Find NodeBB CSRF token
    const match = html.match(/"csrf_token"\s*:\s*"([^"]+)"/);

    if (!match) {
      throw new Error("NodeBB CSRF token was not found");
    }

    // Send NodeBB logout POST request
    const logoutResponse = await fetch(`${FORUM_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-Csrf-Token": match[1],
        "X-Requested-With": "XMLHttpRequest"
      }
    });

    if (!logoutResponse.ok) {
      throw new Error(`NodeBB logout failed: ${logoutResponse.status}`);
    }

    // Return to landing page
    window.location.replace(LANDING_PAGE_URL);

  } catch (error) {
    console.error("Platform logout failed:", error);
    alert("Unable to log out. Please try again.");
  }
}
