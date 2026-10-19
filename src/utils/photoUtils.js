/**
 * Photo processing utilities — enhancement, smart crop, AI-style backgrounds
 */

export function enhancePhotoDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      const brightness = 1.08;
      const contrast = 1.12;
      const factor = (259 * (contrast * 128 + 255)) / (255 * (259 - contrast * 128));

      for (let i = 0; i < d.length; i += 4) {
        d[i] = factor * (d[i] - 128) + 128 * brightness;
        d[i + 1] = factor * (d[i + 1] - 128) + 128 * brightness;
        d[i + 2] = factor * (d[i + 2] - 128) + 128 * brightness;
      }
      ctx.putImageData(imageData, 0, 0);

      // Soft vignette
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.75
      );
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.25)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function smartCropToAspect(file, targetW = 800, targetH = 1000, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        const targetRatio = targetW / targetH;
        const srcRatio = img.width / img.height;
        let sx, sy, sw, sh;

        if (srcRatio > targetRatio) {
          sh = img.height;
          sw = sh * targetRatio;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          sw = img.width;
          sh = sw / targetRatio;
          sx = 0;
          // Tall photos: keep the upper part, where faces usually are
          sy = (img.height - sh) * 0.2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Procedural decorative background (no API needed) */
export function generateAIBackground(styleId, width = 800, height = 1000) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const styles = {
    'floral-gold': {
      bg: ['#1a1208', '#2d1f0a', '#1a1208'],
      accent: '#d4af37',
      pattern: 'floral'
    },
    mandala: {
      bg: ['#1c050a', '#3d1020', '#1c050a'],
      accent: '#dfba6b',
      pattern: 'mandala'
    },
    'islamic-geometric': {
      bg: ['#0a1628', '#1a3050', '#0a1628'],
      accent: '#c9a227',
      pattern: 'geometric'
    },
    'minimal-blush': {
      bg: ['#fdf5f3', '#f8e8e4', '#fdf5f3'],
      accent: '#c48b7f',
      pattern: 'dots'
    },
    'sage-botanical': {
      bg: ['#eaece6', '#d4dace', '#eaece6'],
      accent: '#5e6f5c',
      pattern: 'botanical'
    }
  };

  const s = styles[styleId] || styles['floral-gold'];
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, s.bg[0]);
  grad.addColorStop(0.5, s.bg[1]);
  grad.addColorStop(1, s.bg[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = s.accent;
  ctx.fillStyle = s.accent;

  if (s.pattern === 'floral' || s.pattern === 'botanical') {
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = 8 + Math.random() * 30;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      for (let p = 0; p < 6; p++) {
        const a = (p / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.4, r * 0.2, a, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  } else if (s.pattern === 'mandala' || s.pattern === 'geometric') {
    for (let i = 0; i < 12; i++) {
      const cx = width / 2;
      const cy = height / 2;
      const radius = 60 + i * 35;
      ctx.beginPath();
      for (let j = 0; j <= 8; j++) {
        const angle = (j / 8) * Math.PI * 2;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  } else {
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 2 + Math.random() * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
  return canvas.toDataURL('image/jpeg', 0.8);
}

/** Theme-aware frame styles for guest keepsake composites */
const KEEPSAKE_THEMES = {
  hindu: { bg: ['#1a0808', '#2d1010', '#1a0808'], accent: '#D4AF37', label: '#D4AF37' },
  muslim: { bg: ['#0a1a16', '#0d2820', '#0a1a16'], accent: '#C9A227', label: '#C9A227' },
  christian: { bg: ['#f5f0eb', '#ebe4dc', '#f5f0eb'], accent: '#2C3E6B', label: '#2C3E6B', light: true },
  sikh: { bg: ['#fff9f0', '#fff3e6', '#fff9f0'], accent: '#E87722', label: '#1B2A4A', light: true },
  custom: { bg: ['#0a0c14', '#15101a', '#0a0c14'], accent: '#d4af37', label: '#d4af37' }
};

/** Composite selfie with bride, groom, and guest — keepsake photo */
export function compositeSelfieWithCouple(
  selfieDataUrl,
  { bridePhotoUrl, groomPhotoUrl, coupleFallbackUrl, names = '', religion = 'custom' },
  width = 720,
  height = 900
) {
  const theme = KEEPSAKE_THEMES[religion] || KEEPSAKE_THEMES.custom;

  return new Promise((resolve, reject) => {
    const loadImage = (src) =>
      new Promise((res, rej) => {
        if (!src) return res(null);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => res(img);
        // A missing couple/fallback image just leaves that slot empty
        img.onerror = () => (src === selfieDataUrl ? rej(new Error('Selfie could not be loaded')) : res(null));
        img.src = src;
      });

    const hasCouple = !!(bridePhotoUrl || groomPhotoUrl);
    Promise.all([
      loadImage(selfieDataUrl),
      loadImage(bridePhotoUrl),
      loadImage(groomPhotoUrl),
      hasCouple ? Promise.resolve(null) : loadImage(coupleFallbackUrl)
    ])
      .then(([selfie, bride, groom, fallback]) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        // Safari < 16 has no roundRect — fall back to square corners
        if (!ctx.roundRect) ctx.roundRect = (x, y, w, h) => ctx.rect(x, y, w, h);

        // Theme background
        const bg = ctx.createLinearGradient(0, 0, width, height);
        bg.addColorStop(0, theme.bg[0]);
        bg.addColorStop(0.5, theme.bg[1]);
        bg.addColorStop(1, theme.bg[2]);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        // Theme border
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 3;
        ctx.strokeRect(16, 16, width - 32, height - 32);
        ctx.strokeStyle = theme.light ? `${theme.accent}44` : 'rgba(212,175,55,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(24, 24, width - 48, height - 48);

        const labelColor = theme.label || theme.accent;
        const portraitBorder = theme.accent;
        const topY = height * 0.12;

        const drawPortrait = (img, x, y, w, h, label) => {
          if (!img) return;
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, 12);
          ctx.clip();
          const ratio = Math.max(w / img.width, h / img.height);
          const sw = img.width * ratio;
          const sh = img.height * ratio;
          ctx.drawImage(img, x + (w - sw) / 2, y + (h - sh) / 2, sw, sh);
          ctx.restore();
          ctx.strokeStyle = portraitBorder;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, 12);
          ctx.stroke();
          ctx.fillStyle = labelColor;
          ctx.font = '600 11px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText(label, x + w / 2, y + h + 18);
        };

        if (bride || groom) {
          const colW = width * 0.26;
          const colH = colW * 1.2;
          const gap = width * 0.04;
          const totalW = colW * 2 + gap * 2 + (selfie ? colW : 0);
          const startX = (width - totalW) / 2;

          drawPortrait(bride, startX, topY, colW, colH, 'Bride');

          if (selfie) {
            const guestX = startX + colW + gap;
            const guestY = topY + colH * 0.15;
            const r = colW * 0.42;
            const cx = guestX + colW / 2;
            const cy = guestY + colH * 0.35;
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.clip();
            const sr = Math.max((r * 2) / selfie.width, (r * 2) / selfie.height);
            ctx.drawImage(selfie, cx - (selfie.width * sr) / 2, cy - (selfie.height * sr) / 2, selfie.width * sr, selfie.height * sr);
            ctx.restore();
            ctx.strokeStyle = theme.light ? theme.accent : '#fff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = portraitBorder;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = labelColor;
            ctx.font = '600 11px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillText('You', cx, cy + r + 18);
          }

          drawPortrait(groom, startX + colW + gap + (selfie ? colW + gap : 0), topY, colW, colH, 'Groom');
        } else {
          // No couple photos: illustration (if it loaded) with the guest's selfie inset
          let selfieCx = width / 2;
          let selfieCy = topY + height * 0.3;
          let selfieR = width * 0.26;
          if (fallback) {
            const fw = width * 0.62;
            const fh = fw / 0.76;
            ctx.drawImage(fallback, (width - fw) / 2, topY, fw, fh);
            selfieCx = width / 2 + fw * 0.36;
            selfieCy = topY + fh * 0.82;
            selfieR = width * 0.13;
          }
          if (selfie) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(selfieCx, selfieCy, selfieR, 0, Math.PI * 2);
            ctx.clip();
            const sr = Math.max((selfieR * 2) / selfie.width, (selfieR * 2) / selfie.height);
            ctx.drawImage(selfie, selfieCx - (selfie.width * sr) / 2, selfieCy - (selfie.height * sr) / 2, selfie.width * sr, selfie.height * sr);
            ctx.restore();
            ctx.strokeStyle = portraitBorder;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(selfieCx, selfieCy, selfieR + 3, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        // Title
        ctx.fillStyle = labelColor;
        ctx.font = 'italic 22px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(names || 'With Love', width / 2, height - 50);
        ctx.font = '400 12px Georgia, serif';
        ctx.fillStyle = theme.light ? 'rgba(26,32,44,0.55)' : 'rgba(255,255,255,0.6)';
        ctx.fillText('Aura Invite — Wedding Keepsake', width / 2, height - 28);

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      })
      .catch(reject);
  });
}

/** Generate Save the Date share image */
export function generateSaveTheDateImage({ names, date, venueName, theme = 'dark-gold' }) {
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const palettes = {
    'dark-gold': { bg: '#090a0f', accent: '#d4af37', text: '#ffffff' },
    'rose-ivory': { bg: '#fdfaf5', accent: '#c48b7f', text: '#3c3530' },
    'sage-cream': { bg: '#eaece6', accent: '#5e6f5c', text: '#2f382e' }
  };
  const p = palettes[theme] || palettes['dark-gold'];

  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, width, height);

  // Decorative border
  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, width - 120, height - 120);
  ctx.lineWidth = 1;
  ctx.strokeRect(80, 80, width - 160, height - 160);

  ctx.textAlign = 'center';
  ctx.fillStyle = p.accent;
  ctx.font = '600 36px Georgia, serif';
  ctx.fillText('SAVE THE DATE', width / 2, 280);

  ctx.font = 'italic 72px Georgia, serif';
  ctx.fillText(names || 'Couple', width / 2, 520);

  ctx.font = '400 32px Georgia, serif';
  ctx.fillStyle = p.text;
  const dateStr = date
    ? new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Date TBA';
  ctx.fillText(dateStr, width / 2, 640);

  if (venueName) {
    ctx.font = '400 28px Georgia, serif';
    ctx.globalAlpha = 0.8;
    ctx.fillText(venueName, width / 2, 720);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = p.accent;
  ctx.font = '400 24px Georgia, serif';
  ctx.fillText('Aura Invite', width / 2, height - 120);

  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
