const menuToggle=document.getElementById('menuToggle');
const navLinks=document.getElementById('navLinks');
menuToggle.addEventListener('click',()=>{
 const open=navLinks.classList.toggle('open');
 menuToggle.setAttribute('aria-expanded',String(open));
});
navLinks.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
 navLinks.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');
}));
document.getElementById('year').textContent=new Date().getFullYear();
const toast=document.getElementById('toast');
let toastTimer;
function showToast(message){
 toast.textContent=message;toast.classList.add('show');
 clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3600);
}
const PLAY_FORUM_URL = "https://forum.arethtera.com";
const PLATFORM_URL = "https://arethtera.com/platform/";

document.getElementById('playButton').addEventListener('click', async () => {
    const playButton = document.getElementById('playButton');

    playButton.textContent = "Checking Account...";
    playButton.disabled = true;

    try {
        const response = await fetch(
            `${PLAY_FORUM_URL}/api/user/arethtera`,
            { credentials: "include" }
        );

        if (!response.ok) {
            throw new Error("Could not verify login");
        }

        const data = await response.json();

        if (data.loggedIn && data.loggedInUser?.uid) {
            window.location.href = PLATFORM_URL;
        } else {
            window.location.href = `${PLAY_FORUM_URL}/login?next=${encodeURIComponent("https://arethtera.com/")}`;
        }
    } catch (error) {
        console.error("Login check failed:", error);
        window.location.href = `${PLAY_FORUM_URL}/login`;
    }
});