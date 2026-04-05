document.addEventListener('DOMContentLoaded', function() {
  var color = '#2d6fff';

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  function updateCard() {
    var name    = val('inp-name');
    var title   = val('inp-title');
    var company = val('inp-company');
    var phone   = val('inp-phone');
    var email   = val('inp-email');
    var github  = val('inp-github');
    var linkedin= val('inp-linkedin');

    // name
    document.getElementById('card-name').textContent = name || 'Your Name';

    // title
    document.getElementById('card-title').textContent = (title || 'Job Title').toUpperCase();

    // company badge
    var coEl = document.getElementById('card-co');
    coEl.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg> ' + (company || 'Company');

    // phone
    document.getElementById('val-phone').innerHTML = phone
      ? '<span>' + phone + '</span>'
      : '<span class="contact-empty">–</span>';

    // email
    document.getElementById('val-email').innerHTML = email
      ? '<a href="mailto:' + email + '">' + email + '</a>'
      : '<span class="contact-empty">–</span>';

    // github
    var ghUrl = github ? (github.indexOf('http') === 0 ? github : 'https://' + github) : '';
    document.getElementById('val-github').innerHTML = github
      ? '<a href="' + ghUrl + '" target="_blank">' + github + '</a>'
      : '<span class="contact-empty">–</span>';

    // linkedin
    var liUrl = linkedin ? (linkedin.indexOf('http') === 0 ? linkedin : 'https://' + linkedin) : '';
    document.getElementById('val-linkedin').innerHTML = linkedin
      ? '<a href="' + liUrl + '" target="_blank">' + linkedin + '</a>'
      : '<span class="contact-empty">–</span>';

    // placeholder text
    var hasData = phone || email || github || linkedin;
    document.getElementById('card-placeholder').style.display = hasData ? 'none' : 'block';
  }

  function updateColor(newColor) {
    color = newColor;
    document.getElementById('color-hex').textContent = newColor;
    document.getElementById('card-left').style.background = newColor;

    var co = document.getElementById('card-co');
    co.style.color = newColor;
    co.style.background = newColor + '1a';
    co.style.borderColor = newColor + '44';

    // update contact icons color
    var icons = document.querySelectorAll('.contact-icon');
    for (var i = 0; i < icons.length; i++) {
      icons[i].style.color = newColor;
    }
    // update color swatch border
    document.getElementById('inp-color').style.borderColor = newColor;
  }

  // Photo
  document.getElementById('file-trigger').addEventListener('click', function() {
    document.getElementById('inp-photo').click();
  });

  document.getElementById('inp-photo').addEventListener('change', function() {
    var file = this.files[0];
    if (!file) return;
    document.getElementById('photo-name').textContent = file.name.toUpperCase();
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = document.getElementById('card-img');
      img.src = e.target.result;
      img.classList.add('show');
      document.getElementById('avatar-icon').classList.add('gone');
    };
    reader.readAsDataURL(file);
  });

  // Color
  document.getElementById('inp-color').addEventListener('input', function() {
    updateColor(this.value);
  });

  // Text inputs
  var textIds = ['inp-name','inp-title','inp-company','inp-phone','inp-email','inp-github','inp-linkedin'];
  for (var i = 0; i < textIds.length; i++) {
    (function(id) {
      var el = document.getElementById(id);
      el.addEventListener('input', updateCard);
      el.addEventListener('keyup', updateCard);
    })(textIds[i]);
  }

  // QR Code
  document.getElementById('btn-qr').addEventListener('click', function() {
    var qrDiv = document.getElementById('card-qr');
    qrDiv.innerHTML = '';
    var text = 'BEGIN:VCARD\nVERSION:3.0\nFN:' + val('inp-name') + '\nTEL:' + val('inp-phone') + '\nEMAIL:' + val('inp-email') + '\nEND:VCARD';
    new QRCode(qrDiv, { text: text || 'https://cardforge.app', width: 80, height: 80, colorDark: '#0a1628', colorLight: '#ffffff' });
  });

  // vCard download
  document.getElementById('btn-vcf').addEventListener('click', function() {
    var text = 'BEGIN:VCARD\nVERSION:3.0\nFN:' + val('inp-name') + '\nTITLE:' + val('inp-title') + '\nORG:' + val('inp-company') + '\nTEL:' + val('inp-phone') + '\nEMAIL:' + val('inp-email') + '\nURL:' + val('inp-github') + '\nURL:' + val('inp-linkedin') + '\nEND:VCARD';
    var blob = new Blob([text], { type: 'text/vcard' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (val('inp-name') || 'contact') + '.vcf';
    a.click();
  });

  // PNG download
  document.getElementById('btn-png').addEventListener('click', function() {
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = function() {
      html2canvas(document.getElementById('card-preview'), { scale: 2, backgroundColor: null }).then(function(canvas) {
        var a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'business-card.png';
        a.click();
      });
    };
    document.head.appendChild(s);
  });

  // Init
  updateCard();
  updateColor('#2d6fff');
});