const FORUM_BASE_URL = "https://forum.arethtera.com";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Read the signed-in NodeBB profile. The forum's CORS settings must allow
  // https://arethtera.com and credentialed requests for this to work.
  loadPlayerProfile();

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

  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("mobileMenuToggle");
  menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".side-link").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".side-link").forEach(item => item.classList.remove("active"));
      link.classList.add("active");
      sidebar.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  const modal = document.getElementById("gameModal");
  const closeModal = () => { modal.hidden = true; };
  document.getElementById("launchButton").addEventListener("click", () => { modal.hidden = false; });
  document.getElementById("launchInfo").addEventListener("click", () => { modal.hidden = false; });
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOkay").addEventListener("click", closeModal);
  modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });
});

async function loadPlayerProfile() {
  const nameTarget = document.getElementById("playerName");
  try {
    const response = await fetch(`${FORUM_BASE_URL}/api/user/arethtera`, {
      credentials: "include"
    });
    if (!response.ok) throw new Error(`Forum API returned ${response.status}`);
    const data = await response.json();

    if (data.loggedIn && data.loggedInUser?.username) {
      nameTarget.textContent = data.loggedInUser.username;
    } else {
      nameTarget.textContent = "Guest";
    }
  } catch (error) {
    console.warn("Could not load the forum profile. Showing the default account label.", error);
    // This fallback keeps the dashboard usable if a visitor is not signed in.
    nameTarget.textContent = "Guest";
  }
}