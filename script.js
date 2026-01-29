(() => {
  const resolveImg = (base) => {
    const exts = ['png','jpg','jpeg','webp'];
    // We already have correct files in assets/, but base comes like "image-4"
    // We'll try the common extensions.
    for (const ext of exts) return `assets/${base}.${ext}`;
  };

  const tooltip = document.getElementById('tooltip');
  const timg = tooltip.querySelector('img');
  const tcap = tooltip.querySelector('.grow');
  const tclose = tooltip.querySelector('.close');

  let pinned = false;

  const show = (btn, pin=false) => {
    const base = btn.dataset.img;
    const caption = btn.dataset.caption || '';
    timg.src = resolveImg(base);
    tcap.textContent = caption;
    pinned = pin;

    tooltip.style.display = 'block';

    // position near cursor or button
    const rect = btn.getBoundingClientRect();
    const pad = 10;
    const width = tooltip.getBoundingClientRect().width || 360;
    const height = tooltip.getBoundingClientRect().height || 320;

    let left = rect.left + (rect.width/2) - (width/2);
    left = Math.max(pad, Math.min(left, window.innerWidth - width - pad));

    let top = rect.bottom + 10;
    if (top + height + pad > window.innerHeight) {
      top = rect.top - height - 10;
    }
    top = Math.max(pad, Math.min(top, window.innerHeight - height - pad));

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  const hide = () => {
    if (pinned) return;
    tooltip.style.display = 'none';
    timg.removeAttribute('src');
  };

  // Desktop: hover; Mobile: click to pin
  const isTouch = () => window.matchMedia('(hover: none)').matches;

  document.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('.imgref');
    if (!btn || isTouch()) return;
    show(btn, false);
  });

  document.addEventListener('mouseout', (e) => {
    const btn = e.target.closest('.imgref');
    if (!btn || isTouch()) return;
    hide();
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.imgref');
    if (btn) {
      e.preventDefault();
      if (tooltip.style.display === 'block' && pinned) {
        pinned = false;
        tooltip.style.display = 'none';
        return;
      }
      show(btn, true);
      return;
    }
    // close if click outside
    if (tooltip.style.display === 'block' && pinned && !e.target.closest('#tooltip')) {
      pinned = false;
      tooltip.style.display = 'none';
    }
  });

  tclose.addEventListener('click', (e) => {
    e.preventDefault();
    pinned = false;
    tooltip.style.display = 'none';
  });

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('.grow');
  const lbClose = lb.querySelector('.close');

  const openLb = (img, cap) => {
    lbImg.src = `assets/${img}`;
    lbCap.textContent = cap || '';
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    lb.style.display = 'none';
    lbImg.removeAttribute('src');
    document.body.style.overflow = '';
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('.open-lightbox');
    if (!a) return;
    e.preventDefault();
    openLb(a.dataset.img, a.dataset.caption);
  });

  lbClose.addEventListener('click', (e) => { e.preventDefault(); closeLb(); });
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { pinned=false; tooltip.style.display='none'; closeLb(); } });

  // Scroll spy (lightweight)
  const links = Array.from(document.querySelectorAll('.nav-card a[href^="#"]'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const setActive = () => {
    const y = window.scrollY + 120;
    let active = null;
    for (const s of sections) if (s.offsetTop <= y) active = s;
    for (const a of links) a.classList.remove('active');
    if (active) {
      const a = links.find(l => l.getAttribute('href') === `#${active.id}`);
      if (a) a.classList.add('active');
    }
  };
  window.addEventListener('scroll', setActive, {passive:true});
  setActive();
})();