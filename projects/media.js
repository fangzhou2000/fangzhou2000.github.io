(() => {
  // Sources stay in data-src until the video is actually needed.
  const attachSource = video => {
    if (video.dataset.loaded) return;
    video.querySelectorAll('source[data-src]').forEach(source => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    video.dataset.loaded = 'true';
    video.load();
  };

  document.querySelectorAll('[data-hover-video]').forEach(row => {
    const overlay = document.getElementById(row.dataset.hoverVideo);
    const video = overlay.querySelector('video');
    let active = false;
    const hide = () => { overlay.style.opacity = '0'; };
    const show = () => {
      if (active) overlay.style.opacity = '1';
    };
    video.addEventListener('playing', show);
    video.addEventListener('error', hide);
    row.addEventListener('mouseenter', () => {
      active = true;
      attachSource(video);
      // Keep the still image visible until a video frame is available.
      video.play().then(() => {
        if (active) show();
        else video.pause();
      }).catch(hide);
    });
    row.addEventListener('mouseleave', () => {
      active = false;
      video.pause();
      hide();
    });
  });

  const videos = [...document.querySelectorAll('video[data-lazy-video]')];
  if (!videos.length) return;
  const visible = new Set();
  let pageReady = false;
  const update = video => {
    if (!pageReady) return;
    if (visible.has(video) && !document.hidden) {
      attachSource(video);
      video.play().catch(() => { /* Native controls remain available. */ });
    } else {
      video.pause();
    }
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
        update(entry.target);
      });
    }, { threshold: 0.1 });
    videos.forEach(video => observer.observe(video));
  } else {
    videos.forEach(video => visible.add(video));
  }
  // An explicit click on the native play control also starts loading.
  videos.forEach(video => video.addEventListener('play', () => {
    if (!video.dataset.loaded) {
      attachSource(video);
      video.play().catch(() => {});
    }
  }));
  document.addEventListener('visibilitychange', () => videos.forEach(update));
  const ready = () => {
    const start = () => {
      pageReady = true;
      videos.forEach(update);
    };
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 2000 });
    else window.setTimeout(start, 300);
  };
  if (document.readyState === 'complete') ready();
  else window.addEventListener('load', ready, { once: true });
})();
