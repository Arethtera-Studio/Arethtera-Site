// Interface File
const entries=[["Character Sheet","♙"],["Inventory","▣"],["World Map","⌖"],["Abilities / Skills","✧"],["Profession","⚒"],["Finances","◈"],["Relationships","♧"],["Journal","▤"],["Settings","⚙"]];
const nav=document.getElementById("nav");
entries.forEach(([name,ico])=>{let b=document.createElement("button");b.className="navbtn";b.dataset.menu=name;b.innerHTML=`<span class="ico">${ico}</span><span class="navlabel">${name}</span>`;nav.appendChild(b)});
const $=id=>document.getElementById(id),overlay=$("overlay"),map=$("map");
const descriptions={"Town Market":"Merchants trade beneath colourful awnings as townsfolk move through the square.","Westfield Village":"A small settlement of cottages, workshops, and fields beyond the town road.","Northwatch":"A northern settlement near the wooded frontier.","Southern Farmlands":"Open fields, farmsteads, and country lanes stretch across the southern region."};
function toast(s){$("toast").textContent=s;$("toast").classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2600)}
function setLocation(place){$("locationHeader").textContent=place;$("sceneLocation").textContent=place;$("locationTitle").textContent=place;$("locationDescription").textContent=descriptions[place];$("status").textContent="You are now at "+place+".";map.hidden=true;toast("Location selected: "+place+". Travel is illustrative in this prototype.");}
const content={
"Character Sheet":`<div class="grid"><div class="card"><h3>Personal Details</h3><p><b>Name:</b> Alden<br><b>Age:</b> 24<br><b>Status:</b> Citizen<br><b>Birthplace:</b> Not recorded</p></div><div class="card"><h3>Physical Condition</h3><p><b>Health:</b> 100 / 100<br><b>Stamina:</b> 85 / 100<br><b>Hunger:</b> 20 / 100</p></div><div class="card"><h3>Character Background</h3><p>History, family origins, personality, and personal characteristics.</p></div><div class="card"><h3>Social Standing</h3><p>Reputation, status, community recognition, and personal milestones.</p></div></div>`,
"Inventory":`<div class="card"><h3>Carried Possessions</h3><div class="grid">${["Clothing","Food","Tools","Materials","Personal Items","Valuables"].map(x=>`<div class="card">◈ ${x}</div>`).join("")}</div><p>Items, equipment, storage, weight, and descriptions.</p></div>`,
"Abilities / Skills":`<div class="card"><h3>Skills and Abilities</h3>${["Craftsmanship","Agriculture","Trading","Cooking","Social Skills","Animal Husbandry"].map(x=>`<p>${x}<span style="float:right">Untrained</span></p>`).join("")}</div>`,
"Profession":`<div class="grid"><div class="card"><h3>Current Profession</h3><p>Not yet employed.</p></div><div class="card"><h3>Work and Opportunities</h3><p>Employment, available tasks, work history, and professional progression.</p></div></div>`,
"Finances":`<div class="card"><h3>Personal Ledger</h3><h2>125 Gold</h2><p>Income · Expenses · Transactions · Savings · Debts · Property</p></div>`,
"Relationships":`<div class="grid"><div class="card"><h3>Family</h3><p>Family members and household relationships.</p></div><div class="card"><h3>Acquaintances</h3><p>Friends, neighbours, colleagues, and contacts.</p></div><div class="card"><h3>Social Standing</h3><p>Reputation, trust, and community relationships.</p></div></div>`,
"Journal":`<div class="card"><h3>Personal Journal</h3><p><b>14th Day of Spring</b><br>Arrived at the Town Market. The marketplace is busy with merchants and townsfolk.</p><p>Events, discoveries, milestones, and personal notes will be recorded here.</p></div>`,
"Settings":`<div class="card"><h3>Game Settings</h3><p>Interface, display, audio, accessibility, and control preferences.</p><p><label><input type="checkbox" checked> Show contextual interaction hints</label></p><p><label><input type="checkbox" checked> Confirm before exiting</label></p></div>`,
"Exit Game":`<div class="card"><h3>Leave Arethtera?</h3><p>Your character's location and world state would be saved before exiting.</p><button class="close" onclick="toast('Save and exit are not connected in this prototype.')">Save and Exit</button> <button class="close" onclick="closePanel()">Return to Game</button></div>`
};
function openMenu(name){document.querySelectorAll(".navbtn[data-menu]").forEach(b=>b.classList.toggle("selected",b.dataset.menu===name));if(name==="World Map"){overlay.hidden=true;map.hidden=false;return}map.hidden=true;$("panelTitle").textContent=name;$("panelBody").innerHTML=content[name]||"";overlay.hidden=false}
function closePanel(){overlay.hidden=true;document.querySelectorAll(".navbtn").forEach(b=>b.classList.remove("selected"))}
document.addEventListener("click",e=>{let b=e.target.closest("[data-menu]");if(b)openMenu(b.dataset.menu)});
$("collapse").onclick=()=>$("sidebar").classList.toggle("collapsed");
$("closePanel").onclick=closePanel;$("mapBtn").onclick=()=>openMenu("World Map");
$("closeMap").onclick=()=>{map.hidden=true;document.querySelectorAll(".navbtn").forEach(b=>b.classList.remove("selected"))};
document.querySelectorAll(".place").forEach(b=>b.onclick=()=>setLocation(b.dataset.place));
$("interact").onclick=()=>toast("Nearby: Speak to merchant · Browse goods · Look around · Inspect stalls");
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!map.hidden)$("closeMap").click();else if(!overlay.hidden)closePanel()}if(e.key.toLowerCase()==="e"&&overlay.hidden&&map.hidden)toast("Nearby interactions: Speak to merchant · Browse goods · Look around")});
/* Production clock note: obtain authoritative UTC from the game server, then format it in the character's in-game IANA time zone. */
