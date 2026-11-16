const FORUM_URL = "https://forum.arethtera.com";
const CATEGORY_ID = 1;
const POST_LIMIT = 3;
async function loadRealmNews() {

    const container = document.getElementById("realmNewsFeed");

    if (!container) {
        console.error("Realm News container not found!");
        return;
    }

    container.innerHTML = "<p>Loading announcements...</p>";

    try {

        const response = await fetch(
            `${FORUM_URL}/api/category/${CATEGORY_ID}`
        );

        if (!response.ok) {
            throw new Error("Forum API returned " + response.status);
        }

        const data = await response.json();

        // Extract topics from NodeBB response
        const topics = data.topics?.topics || data.topics || [];

        if (!Array.isArray(topics) || topics.length === 0) {
            container.innerHTML = "<p>No announcements found.</p>";
            return;
        }

        // Sort newest first
        topics.sort((a, b) =>
            Number(b.timestamp) - Number(a.timestamp)
        );

        // Display selected number of announcements
        container.innerHTML = topics
            .slice(0, POST_LIMIT)
            .map(topic => {

                const title = escapeNewsHTML(topic.title);
                const excerpt = escapeNewsHTML(
                    topic.teaser?.content ||
                    "Read the latest announcement in the forum."
                );

                const date = topic.timestamp
                    ? new Date(Number(topic.timestamp)).toLocaleDateString()
                    : "";

                const link = `${FORUM_URL}/topic/${topic.tid}`;

                return `
                    <article class="news-item">

                        <div class="news-thumb">✦</div>

                        <div>
                            <a href="${link}"
                               target="_blank"
                               rel="noopener">
                                <h3>${title}</h3>
                            </a>

                            <p>${excerpt}</p>
                        </div>

                        <span class="news-date">${date}</span>

                    </article>
                `;

            }).join("");

    } catch (error) {

        console.error("Realm News Error:", error);

        container.innerHTML = `
            <p>Unable to load announcements.</p>
            <p><a href="${FORUM_URL}/category/${CATEGORY_ID}/announcements"
                  target="_blank">
                  Visit Forum Announcements →
            </a></p>
        `;
    }
}

function escapeNewsHTML(value) {
    const element = document.createElement("div");
    element.textContent = value || "";
    return element.innerHTML;
}

// Run after the page has loaded
document.addEventListener("DOMContentLoaded", loadRealmNews);

// Refresh every five minutes
setInterval(loadRealmNews, 300000);

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