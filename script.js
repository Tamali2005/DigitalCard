

let currentColor = '#2d7cf6';
  let photoDataURL = null;
  let qrGenerated = false;

  function updateCard() {
    document.getElementById('card-name').textContent = document.getElementById('inp-name').value || 'Your Name';
    document.getElementById('card-title').textContent = document.getElementById('inp-title').value || 'Job Title';
    document.getElementById('card-company').textContent = document.getElementById('inp-company').value || 'Company';

    const contacts = [];
    const phone = document.getElementById('inp-phone').value;
    const email = document.getElementById('inp-email').value;
    const github = document.getElementById('inp-github').value;
    const linkedin = document.getElementById('inp-linkedin').value;
    const portfolio = document.getElementById('inp-portfolio').value;

    if (phone) contacts.push(`<div class="card-contact-item"><span class="icon">📞</span> ${phone}</div>`);
    if (email) contacts.push(`<div class="card-contact-item"><span class="icon">✉️</span> <a href="mailto:${email}">${email}</a></div>`);
    if (github) contacts.push(`<div class="card-contact-item"><span class="icon">🔗</span> <a href="${github}" target="_blank">${github}</a></div>`);
    if (linkedin) contacts.push(`<div class="card-contact-item"><span class="icon">🔗</span> <a href="${linkedin}" target="_blank">${linkedin}</a></div>`);
    if (portfolio) contacts.push(`<div class="card-contact-item"><span class="icon">🔗</span> <a href="${portfolio}" target="_blank">${portfolio}</a></div>`);

    document.getElementById('card-contacts').innerHTML = contacts.join('');
  }

  function updateColor(val) {
    currentColor = val;
    document.getElementById('color-hex').textContent = val;
    document.getElementById('card-preview').style.setProperty('--theme-bg', val);
    document.getElementById('card-bar').style.background = val;
    document.getElementById('card-company').style.color = val;
    // update top bar
    document.getElementById('card-preview').style.setProperty('--theme-color', val);
    document.querySelector('#card-preview::before');
    // direct override via pseudo
    const style = document.getElementById('dynamic-style') || (() => {
      const s = document.createElement('style');
      s.id = 'dynamic-style';
      document.head.appendChild(s);
      return s;
    })();
    style.textContent = `#card-preview::before { background-color: ${val} !important; }`;
  }

  function handlePhoto(input) {
    const file = input.files[0];
    if (!file) return;
    document.getElementById('photo-name').textContent = file.name;
    const reader = new FileReader();
    reader.onload = e => {
      photoDataURL = e.target.result;
      const img = document.getElementById('card-photo-img');
      img.src = photoDataURL;
      img.classList.add('visible');
    };
    reader.readAsDataURL(file);
  }

  function generateQR() {
    const qrDiv = document.getElementById('qrcode');
    qrDiv.innerHTML = '';
    const phone = document.getElementById('inp-phone').value;
    const email = document.getElementById('inp-email').value;
    const name = document.getElementById('inp-name').value;
    const qrText = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
    new QRCode(qrDiv, {
      text: qrText,
      width: 90, height: 90,
      colorDark: '#0a1628',
      colorLight: '#ffffff',
    });
    qrGenerated = true;
  }

  function downloadVCard() {
    const n = document.getElementById('inp-name').value;
    const t = document.getElementById('inp-title').value;
    const c = document.getElementById('inp-company').value;
    const p = document.getElementById('inp-phone').value;
    const e = document.getElementById('inp-email').value;
    const g = document.getElementById('inp-github').value;
    const l = document.getElementById('inp-linkedin').value;
    const pf = document.getElementById('inp-portfolio').value;
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${n}\nTITLE:${t}\nORG:${c}\nTEL:${p}\nEMAIL:${e}\nURL:${g}\nURL:${l}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (n || 'contact') + '.vcf';
    a.click();
  }

  function downloadPNG() {
    const card = document.getElementById('card-preview');
    import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js').then(() => {
      html2canvas(card, { scale: 2, backgroundColor: '#fff' }).then(canvas => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'business-card.png';
        a.click();
      });
    }).catch(() => alert('html2canvas not loaded. Please include it for PNG export.'));
  }

  // init
  updateCard();
  updateColor('#2d7cf6');