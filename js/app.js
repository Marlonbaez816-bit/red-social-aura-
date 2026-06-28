import { signUp, signIn, signOut, getCurrentUser, onAuthChange } from './auth.js';
import { createPost, fetchFeed } from './feed.js';
import { createEco, fetchEcos } from './ecos.js';
import { fetchProfile, follow, unfollow, isFollowing, fetchNetwork } from './network.js';
import { renderReels as renderReelsModule } from './reel-player.js';

const view = document.getElementById('view');
const authBox = document.getElementById('auth-box');
let currentUser = null;

// ---------- RENDER HELPERS ----------
function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------- AUTH UI ----------
function renderAuth() {
  authBox.innerHTML = '';
  authBox.appendChild(el(`
    <div class="glass-card auth-card">
      <h2>Entra a AURA</h2>
      <input id="email" type="email" placeholder="Correo" />
      <input id="password" type="password" placeholder="Contraseña" />
      <input id="username" type="text" placeholder="Nombre de usuario (solo registro)" />
      <button id="btn-login">Iniciar sesión</button>
      <button id="btn-signup">Crear cuenta</button>
      <p id="auth-error" class="error"></p>
    </div>
  `));

  document.getElementById('btn-login').onclick = async () => {
    try {
      await signIn(val('email'), val('password'));
    } catch (e) { showAuthError(e.message); }
  };

  document.getElementById('btn-signup').onclick = async () => {
    try {
      await signUp(val('email'), val('password'), val('username'));
    } catch (e) { showAuthError(e.message); }
  };
}

function val(id) { return document.getElementById(id).value; }
function showAuthError(msg) { document.getElementById('auth-error').textContent = msg; }

// ---------- FEED UI ----------
async function renderFeed() {
  view.innerHTML = '<p class="loading">Cargando feed...</p>';
  const posts = await fetchFeed();
  view.innerHTML = '';

  view.appendChild(el(`
    <div class="glass-card composer">
      <textarea id="post-content" placeholder="¿Qué está pasando?"></textarea>
      <button id="btn-post">Publicar</button>
    </div>
  `));

  document.getElementById('btn-post').onclick = async () => {
    const content = val('post-content');
    if (!content.trim()) return;
    await createPost(currentUser.id, content);
    renderFeed();
  };

  const list = el('<div class="feed-list"></div>');
  posts.forEach(p => {
    list.appendChild(el(`
      <div class="glass-card post">
        <strong>${escapeHtml(p.profiles?.display_name || p.profiles?.username || 'Usuario')}</strong>
        <p>${escapeHtml(p.content)}</p>
        <span class="timestamp">${new Date(p.created_at).toLocaleString()}</span>
      </div>
    `));
  });
  view.appendChild(list);
}

// ---------- ECOS UI ----------
async function renderEcos() {
  view.innerHTML = '<p class="loading">Cargando Ecos...</p>';
  const ecos = await fetchEcos();
  view.innerHTML = '';

  view.appendChild(el(`
    <div class="glass-card composer">
      <textarea id="eco-content" placeholder="Inicia un Eco..."></textarea>
      <button id="btn-eco">Crear Eco</button>
    </div>
  `));

  document.getElementById('btn-eco').onclick = async () => {
    const content = val('eco-content');
    if (!content.trim()) return;
    await createEco(currentUser.id, content);
    renderEcos();
  };

  const list = el('<div class="feed-list"></div>');
  ecos.filter(e => !e.parent_id).forEach(e => {
    list.appendChild(el(`
      <div class="glass-card post eco">
        <strong>${escapeHtml(e.profiles?.display_name || e.profiles?.username || 'Usuario')}</strong>
        <p>${escapeHtml(e.content)}</p>
        <span class="timestamp">${new Date(e.created_at).toLocaleString()}</span>
      </div>
    `));
  });
  view.appendChild(list);
}

// ---------- PROFILE / RED DE INTERACCIÓN UI ----------
async function renderProfile() {
  view.innerHTML = '<p class="loading">Cargando perfil...</p>';
  const profile = await fetchProfile(currentUser.id);
  const network = await fetchNetwork(currentUser.id);
  view.innerHTML = '';

  view.appendChild(el(`
    <div class="glass-card profile-card">
      <h2>${escapeHtml(profile.display_name || profile.username)}</h2>
      <p>@${escapeHtml(profile.username)}</p>
      <p>${escapeHtml(profile.bio || 'Sin biografía aún.')}</p>
    </div>
  `));

  view.appendChild(el(`
    <div class="glass-card">
      <h3>Red de interacción</h3>
      <p>Siguiendo: ${network.following.length} · Seguidores: ${network.followers.length}</p>
    </div>
  `));

  const list = el('<div class="network-list"></div>');
  network.following.forEach(u => {
    if (!u) return;
    list.appendChild(el(`<div class="glass-card chip">@${escapeHtml(u.username)}</div>`));
  });
  view.appendChild(list);
}

// ---------- REELS UI ----------
async function renderReels() {
  await renderReelsModule(view, currentUser, escapeHtml, el);
}

// ---------- NAV ----------
function setupNav() {
  document.getElementById('nav-feed').onclick = renderFeed;
  document.getElementById('nav-ecos').onclick = renderEcos;
  document.getElementById('nav-reels').onclick = renderReels;
  document.getElementById('nav-profile').onclick = renderProfile;
  document.getElementById('nav-logout').onclick = signOut;
}

// ---------- INIT ----------
async function init() {
  currentUser = await getCurrentUser();
  if (currentUser) {
    authBox.classList.add('hidden');
    document.getElementById('app-nav').classList.remove('hidden');
    setupNav();
    renderFeed();
  } else {
    authBox.classList.remove('hidden');
    document.getElementById('app-nav').classList.add('hidden');
    renderAuth();
  }
}

onAuthChange(() => init());
init();
