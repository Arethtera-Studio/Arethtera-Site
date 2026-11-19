
const FORUM_BASE_URL = "https://forum.arethtera.com";
const LANDING_PAGE_URL = "https://arethtera.com/";
const GAME_INTERFACE = "https://arethtera.com/interface/index.html"

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  loadPlayerProfile();

  // Profile button
  const profileButton = document.getElementById("profileButton");

  if (profileButton) {
    profileButton.addEventListener("click", () => {
      console.log("Profile button clicked.");
    });
  }

  // Sidebar
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("mobileMenuToggle");

  if (sidebar && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Sidebar links and logout
  document.querySelectorAll(".side-link").forEach(link => {
    link.addEventListener("click", event => {

      if (link.id === "platformLogout") {
        event.preventDefault();
        console.log("PLATFORM LOGOUT CLICKED");
        logoutFromArethtera();
        return;
      }

      document.querySelectorAll(".side-link").forEach(item => {
        item.classList.remove("active");
      });

      link.classList.add("active");

      if (sidebar) {
        sidebar.classList.remove("open");
      }

      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

   // Game Interface
  const modal = document.getElementById("gameModal");
  const launchButton = document.getElementById("launchButton");
  const gameFrame = document.getElementById("gameFrame");
  const closeButton = document.getElementById("modalClose");

  const closeModal = () => {
    if (modal) {
      modal.hidden = true;
      document.body.style.overflow = "";
    }
  };

  // Launch game
  if (launchButton && modal && gameFrame) {
    launchButton.addEventListener("click", () => {
      if (gameFrame.getAttribute("src") === "about:blank") {
        gameFrame.src = GAME_INTERFACE;
      }

      modal.hidden = false;
      document.body.style.overflow = "hidden";
    });
  }

  // Close button
  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  // Close when clicking outside the game
  if (modal) {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  // Close with Escape
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal && !modal.hidden) {
      closeModal();
    }
  });
});

async function loadPlayerProfile() {
  const nameTarget = document.getElementById("playerName");

  if (!nameTarget) return;

  try {
    const response = await fetch(
      `${FORUM_BASE_URL}/api/user/arethtera`,
      { credentials: "include" }
    );

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

async function logoutFromArethtera() {
  console.log("Starting Arethtera logout.");

  try {
    // Retrieve NodeBB homepage
    const pageResponse = await fetch(`${FORUM_BASE_URL}/`, {
      credentials: "include"
    });

    if (!pageResponse.ok) {
      throw new Error("Could not contact NodeBB.");
    }

    const html = await pageResponse.text();

    const match = html.match(/"csrf_token"\s*:\s*"([^"]+)"/);

    if (!match) {
      throw new Error("NodeBB CSRF token was not found.");
    }

    // Submit NodeBB logout POST request
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

    console.log("NodeBB logout request completed.");

    // Verify session termination
    const verifyResponse = await fetch(
      `${FORUM_BASE_URL}/api/user/arethtera`,
      { credentials: "include" }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.loggedIn) {
      throw new Error("NodeBB session is still active.");
    }

    window.location.replace(LANDING_PAGE_URL);

  } catch (error) {
    console.error("Arethtera logout failed:", error);
    alert("Logout failed. Please check the browser console.");
  }
}
