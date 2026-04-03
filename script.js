// DOM refs
const form = document.getElementById('cardForm');
const nameI = document.getElementById('name');
const titleI = document.getElementById('title');
const companyI = document.getElementById('company');
const phoneI = document.getElementById('phone');
const emailI = document.getElementById('email');
const githubI = document.getElementById('github');
const linkdinI = document.getElementById('linkdin');
const avatarI = document.getElementById('avatar');
const themeI = document.getElementById('theme');

const cardName = document.getElementById('cardName');
const cardTitle = document.getElementById('cardTitle');
const cardCompany = document.getElementById('cardCompany');
const cardContact = document.getElementById('cardContact');
const cardAvatar = document.getElementById('cardAvatar');
const cardPreview = document.getElementById('cardPreview');
const qrContainer = document.getElementById('qrcode');

const downloadVcardBtn = document.getElementById('downloadVcard');
const generateQRBtn = document.getElementById('generateQR');
const downloadPNGBtn = document.getElementById('downloadPNG');
// const exportHTMLBtn = document.getElementById('exportHTML');

let avatarData = ''; // dataURL
let qrcode = null;

// update preview from inputs
function updatePreview(){
  cardName.textContent = nameI.value || 'Your Name';
  cardTitle.textContent = titleI.value || 'Job Title';
  cardCompany.textContent = companyI.value || '';
  const contacts = [];
  if(phoneI.value) contacts.push('📞 ' + phoneI.value);
  if(emailI.value) contacts.push('✉️ ' + emailI.value);
  if(githubI.value) contacts.push('🔗 ' + githubI.value);
  if(linkdinI.value) contacts.push('🔗 ' + linkdinI.value);
  cardContact.textContent = contacts.join(' • ');
  if(avatarData) cardAvatar.src = avatarData;
  else cardAvatar.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='${themeI.value}'/></svg>`);
  document.documentElement.style.setProperty('--accent', themeI.value || '#0ea5a4');
  // save
  saveToLocal();
}

// avatar file -> dataURL
avatarI.addEventListener('change', e=>{
  const f = e.target.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = ev => { avatarData = ev.target.result; updatePreview(); };
  r.readAsDataURL(f);
});

// input listeners
[ nameI, titleI, companyI, phoneI, emailI, linkdinI, githubI, themeI ].forEach(el=>el.addEventListener('input', updatePreview));

// localStorage save/load
function saveToLocal(){
  const data = {
    name: nameI.value, title: titleI.value, company: companyI.value,
    phone: phoneI.value, email: emailI.value, linkdin: linkdinI.value,
    github: githubI.value, theme: themeI.value, avatar: avatarData
  };
  localStorage.setItem('dbc_card', JSON.stringify(data));
}
function loadFromLocal(){
  const raw = localStorage.getItem('dbc_card');
  if(!raw) return;
  const d = JSON.parse(raw);
  nameI.value = d.name||'';
  titleI.value = d.title||'';
  companyI.value = d.company||'';
  phoneI.value = d.phone||'';
  emailI.value = d.email||'';
  githubI.value = d.github||'';
  linkdinI.value = d.linkdin||'';
  themeI.value = d.theme||'#0ea5a4';
  avatarData = d.avatar||'';
  updatePreview();
}

// generate vCard text
function buildVCard(){
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${nameI.value||''}`,
    `TITLE:${titleI.value||''}`,
    `ORG:${companyI.value||''}`,
  ];
  if(phoneI.value) lines.push(`TEL;TYPE=CELL:${phoneI.value}`);
  if(emailI.value) lines.push(`EMAIL:${emailI.value}`);
  if(githubI.value) lines.push(`URL:${githubI.value}`);
  if(linkdinI.value) lines.push(`URL:${linkdinI.value}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

generateQRBtn.addEventListener("click", () => {
  qrContainer.innerHTML = ""; // clear old qr
  const vcardData = buildVCard(); // build vcard text
  new QRCode(qrContainer, {
    text: vcardData,
    width: 160,
    height: 160
  });
});


// new QRCode(document.getElementById("qrcode"), {
//   // text: "BEGIN:VCARD\nVERSION:3.0\nFN:Test User\nTEL:1234567890\nEND:VCARD",
//   // width: 160,
//   // height: 160
// });

// generic download helper
function downloadFile(filename, content, mime='text/plain'){
  const blob = new Blob([content], {type: mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 200);
}

// download vCard
downloadVcardBtn.addEventListener('click', ()=>{
  const v = buildVCard();
  downloadFile((nameI.value||'contact') + '.vcf', v, 'text/vcard');
});

// // generate QR (vCard content)
// generateQRBtn.addEventListener('click', ()=>{
//   // clear
//   qrContainer.innerHTML = '';
//   const v = buildVCard();
//   // QRCode lib usage
//   qrcode = new QRCode(qrContainer, { text: v, width: 160, height: 160 });
// });

// download PNG (html2canvas)
downloadPNGBtn.addEventListener('click', ()=>{
  html2canvas(cardPreview).then(canvas=>{
    canvas.toBlob(blob=>{
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = (nameI.value||'business-card') + '.png';
      document.body.appendChild(a); a.click();
      setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 200);
    });
  });
});

// export standalone HTML file (simple)
exportHTMLBtn.addEventListener('click', ()=>{
  const html = `<!doctype html>
  <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${(nameI.value||'Card')}</title>
  <style>
    body{font-family:system-ui;padding:20px;background:#f3f4f6}
    .card{display:flex;gap:12px;align-items:center;background:#fff;padding:16px;border-radius:10px;max-width:500px}
    img{width:96px;height:96px;border-radius:10px;object-fit:cover;border:4px solid ${themeI.value}}
  </style></head><body>
  <div class="card">
    <img src="${avatarData || ''}" alt="avatar"/>
    <div>
      <h2>${(nameI.value||'')}</h2>
      <p>${(titleI.value||'')}</p>
      <p>${(companyI.value||'')}</p>
      <p>${(phoneI.value? 'Phone: ' + phoneI.value : '')}</p>
      <p>${(emailI.value? 'Email: ' + emailI.value : '')}</p>
      <p>${(linkdinI.value? '<a href="'+linkdinI.value+'">'+linkdinI.value+'</a>' : '')}</p>
    </div>
  </div>
  </body></html>`;
  downloadFile((nameI.value||'card') + '.html', html, 'text/html');
});

// init
loadFromLocal();
updatePreview();