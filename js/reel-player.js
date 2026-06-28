import { fetchReels, uploadReel, likeReel, unlikeReel, hasLiked, countLikes } from './reels.js';

export async function renderReels(view, currentUser, escapeHtml, el) {
  view.innerHTML = '<p class="loading">Cargando Reels...</p>';
  const reels = await fetchReels();
  view.innerHTML = '';

  // Subir nuevo Reel
  view.appendChild(el(`
    <div class="glass-card composer">
      <input id="reel-file" type="file" accept="video/*" />
      <input id="reel-caption" type="text" placeholder="Descripción del Eco Reel..." />
      <button id="btn-reel-upload">Subir Eco</button>
      <p id="reel-upload-status"></p>
    </div>
  `));

  document.getElementById('btn-reel-upload').onclick = async () => {
    const fileInput = document.getElementById('reel-file');
    const caption = document.getElementById('reel-caption').value;
    const status = document.getElementById('reel-upload-status');
    if (!fileInput.files[0]) { status.textContent = 'Selecciona un video.'; return; }
    status.textContent = 'Subiendo...';
    try {
      await uploadReel(currentUser.id, fileInput.files[0], caption);
      renderReels(view, currentUser, escapeHtml, el);
    } catch (e) {
      status.textContent = 'Error: ' + e.message;
    }
  };

  if (reels.length === 0) {
    view.appendChild(el('<p class="loading">Aún no hay Eco Reels. ¡Sube el primero!</p>'));
    return;
  }

  const container = el('<div class="reel-container"></div>');
  view.appendChild(container);

  let currentIndex = 0;

  function loadReel(index) {
    container.innerHTML = '';
    if (index >= reels.length) {
      container.appendChild(el('<p class="loading">Llegaste al final de los Eco Reels.</p>'));
      return;
    }
    const reel = reels[index];
    const card = el(`
      <div class="glass-card reel-card">
        <video class="reel-video" src="${reel.video_url}" autoplay playsinline></video>
        <p><strong>@${escapeHtml(reel.profiles?.username || 'usuario')}</strong></p>
        <p>${escapeHtml(reel.caption || '')}</p>
        <button class="btn-like">❤ <span class="like-count">...</span></button>
      </div>
    `);
    container.appendChild(card);

    const video = card.querySelector('.reel-video');
    // Autoplay automático al siguiente Eco Reel cuando termina
    video.addEventListener('ended', () => {
      currentIndex++;
      loadReel(currentIndex);
    });

    // Likes reales
    countLikes(reel.id).then(c => { card.querySelector('.like-count').textContent = c; });
    const likeBtn = card.querySelector('.btn-like');
    hasLiked(reel.id, currentUser.id).then(liked => {
      if (liked) likeBtn.classList.add('liked');
    });
    likeBtn.onclick = async () => {
      const liked = likeBtn.classList.contains('liked');
      if (liked) {
        await unlikeReel(reel.id, currentUser.id);
        likeBtn.classList.remove('liked');
      } else {
        await likeReel(reel.id, currentUser.id);
        likeBtn.classList.add('liked');
      }
      const c = await countLikes(reel.id);
      card.querySelector('.like-count').textContent = c;
    };
  }

  loadReel(currentIndex);
}
