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
document.getElementById('playButton').addEventListener('click',()=>showToast("The gates are not open just yet. Stay tuned for the realm's launch."));
document.querySelectorAll('a[href="#journey"]').forEach(a=>a.addEventListener('click',()=>{
 // The CTA remains a launch placeholder until account and game services are connected.
}));