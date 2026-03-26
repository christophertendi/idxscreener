/**
 * IDX STREAM — Reddit-style community discussion
 * Firebase Auth (email/password + anonymous) + Firestore
 */

const firebaseConfig = {
  apiKey: "AIzaSyB0w-MLDR9OyFplq3oiXyZ2jnpQpSazSa0",
  authDomain: "idxscreener44.firebaseapp.com",
  projectId: "idxscreener44",
  storageBucket: "idxscreener44.firebasestorage.app",
  messagingSenderId: "478298355589",
  appId: "1:478298355589:web:58cdfc4cd2d13dba5976ec"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let expandedPosts = new Set();

auth.onAuthStateChanged(user => {
  currentUser = user;
  const loggedOut = document.getElementById('authLoggedOut');
  const loggedIn = document.getElementById('authLoggedIn');
  const composer = document.getElementById('streamComposer');
  const userName = document.getElementById('authUserName');

  if (user) {
    if (loggedOut) loggedOut.style.display = 'none';
    if (loggedIn) loggedIn.style.display = 'block';
    if (composer) composer.style.display = 'block';
    if (userName) userName.textContent = user.isAnonymous ? 'Anonymous User' : (user.email || 'User');
  } else {
    if (loggedOut) loggedOut.style.display = 'block';
    if (loggedIn) loggedIn.style.display = 'none';
    if (composer) composer.style.display = 'none';
  }
});

async function streamSignIn() {
  const email = document.getElementById('authEmail').value.trim();
  const pw = document.getElementById('authPassword').value;
  if (!email || !pw) return;
  try {
    await auth.signInWithEmailAndPassword(email, pw);
    loadStreamPosts();
  } catch (e) { alert(e.message); }
}

async function streamSignUp() {
  const email = document.getElementById('authEmail').value.trim();
  const pw = document.getElementById('authPassword').value;
  if (!email || !pw) return;
  try {
    await auth.createUserWithEmailAndPassword(email, pw);
    loadStreamPosts();
  } catch (e) { alert(e.message); }
}

async function streamSignInAnon() {
  try {
    await auth.signInAnonymously();
    loadStreamPosts();
  } catch (e) { alert(e.message); }
}

async function streamSignOut() {
  await auth.signOut();
}

async function streamCreatePost() {
  if (!currentUser) return;
  const title = document.getElementById('postTitle').value.trim();
  const body = document.getElementById('postBody').value.trim();
  const tag = document.getElementById('postTag').value;
  const ticker = document.getElementById('postTicker').value.trim().toUpperCase();
  if (!title) return;

  await db.collection('posts').add({
    title,
    body,
    tag,
    ticker: ticker || null,
    authorId: currentUser.uid,
    authorName: currentUser.isAnonymous ? 'Anonymous' : (currentUser.email || 'User'),
    upvotes: 0,
    downvotes: 0,
    voters: {},
    commentCount: 0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  document.getElementById('postTitle').value = '';
  document.getElementById('postBody').value = '';
  document.getElementById('postTicker').value = '';
  loadStreamPosts();
}

async function loadStreamPosts() {
  const feed = document.getElementById('streamFeed');
  if (!feed) return;

  try {
    const snap = await db.collection('posts').orderBy('createdAt', 'desc').limit(50).get();

    if (snap.empty) {
      feed.innerHTML = '<div class="stream-empty">No posts yet. Be the first to share your analysis!</div>';
      return;
    }

    feed.innerHTML = snap.docs.map(doc => {
      const p = doc.data();
      const id = doc.id;
      const ago = p.createdAt ? timeAgo(p.createdAt.toDate().toISOString()) : 'just now';
      const net = (p.upvotes || 0) - (p.downvotes || 0);
      const myVote = currentUser && p.voters ? p.voters[currentUser.uid] : null;
      const tagClass = p.tag === 'analysis' ? 'post-tag-analysis' : p.tag === 'question' ? 'post-tag-question' : p.tag === 'dd' ? 'post-tag-dd' : p.tag === 'meme' ? 'post-tag-meme' : '';
      const bodyPreview = (p.body || '').length > 200 ? p.body.slice(0, 200) + '...' : (p.body || '');
      const expanded = expandedPosts.has(id);

      return `
        <div class="stream-post">
          <div class="post-vote">
            <button class="vote-btn ${myVote === 'up' ? 'upvoted' : ''}" onclick="streamVote('${id}','up')">▲</button>
            <span class="vote-count">${net}</span>
            <button class="vote-btn ${myVote === 'down' ? 'downvoted' : ''}" onclick="streamVote('${id}','down')">▼</button>
          </div>
          <div class="post-content">
            <div class="post-meta">
              <span class="post-tag ${tagClass}">${(p.tag || 'discussion').toUpperCase()}</span>
              <span class="post-author">${p.authorName || 'Anonymous'}</span>
              <span class="post-time">${ago}</span>
              ${p.ticker ? `<span class="post-ticker" onclick="openStockModal('${p.ticker}')">${p.ticker}</span>` : ''}
            </div>
            <div class="post-title" onclick="streamToggleComments('${id}')">${escapeHtml(p.title)}</div>
            <div class="post-body-preview">${escapeHtml(bodyPreview)}</div>
            <div class="post-actions">
              <button class="post-action-btn" onclick="streamToggleComments('${id}')">💬 ${p.commentCount || 0} comments</button>
            </div>
            ${expanded ? `<div class="post-comments" id="comments-${id}"><div class="loading" style="padding:10px;">Loading...</div></div>` : ''}
          </div>
        </div>
      `;
    }).join('');

    expandedPosts.forEach(id => loadComments(id));
  } catch (e) {
    feed.innerHTML = `<div class="stream-empty">Failed to load stream: ${e.message}</div>`;
  }
}

function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

async function streamVote(postId, direction) {
  if (!currentUser) { alert('Please sign in to vote.'); return; }
  const ref = db.collection('posts').doc(postId);
  const doc = await ref.get();
  if (!doc.exists) return;
  const p = doc.data();
  const voters = p.voters || {};
  const prev = voters[currentUser.uid];

  const update = {};
  if (prev === direction) {
    update[`voters.${currentUser.uid}`] = firebase.firestore.FieldValue.delete();
    update[direction === 'up' ? 'upvotes' : 'downvotes'] = firebase.firestore.FieldValue.increment(-1);
  } else {
    if (prev) {
      update[prev === 'up' ? 'upvotes' : 'downvotes'] = firebase.firestore.FieldValue.increment(-1);
    }
    update[`voters.${currentUser.uid}`] = direction;
    update[direction === 'up' ? 'upvotes' : 'downvotes'] = firebase.firestore.FieldValue.increment(1);
  }

  await ref.update(update);
  loadStreamPosts();
}

function streamToggleComments(postId) {
  if (expandedPosts.has(postId)) {
    expandedPosts.delete(postId);
  } else {
    expandedPosts.add(postId);
  }
  loadStreamPosts();
}

async function loadComments(postId) {
  const el = document.getElementById(`comments-${postId}`);
  if (!el) return;

  const snap = await db.collection('posts').doc(postId).collection('comments').orderBy('createdAt', 'asc').limit(30).get();

  let html = snap.docs.map(d => {
    const c = d.data();
    const ago = c.createdAt ? timeAgo(c.createdAt.toDate().toISOString()) : 'just now';
    return `<div class="comment"><div class="comment-meta"><span class="comment-author">${escapeHtml(c.authorName || 'Anonymous')}</span> · ${ago}</div><div class="comment-body">${escapeHtml(c.body || '')}</div></div>`;
  }).join('');

  if (!snap.docs.length) html = '<div style="font-size:10px;color:var(--text-muted);padding:8px 0;">No comments yet.</div>';

  if (currentUser) {
    html += `<div class="comment-input-row"><input class="comment-input" id="ci-${postId}" placeholder="Write a comment..."><button class="auth-btn" onclick="streamAddComment('${postId}')">Reply</button></div>`;
  }

  el.innerHTML = html;
}

async function streamAddComment(postId) {
  if (!currentUser) return;
  const input = document.getElementById(`ci-${postId}`);
  const body = input.value.trim();
  if (!body) return;

  await db.collection('posts').doc(postId).collection('comments').add({
    body,
    authorId: currentUser.uid,
    authorName: currentUser.isAnonymous ? 'Anonymous' : (currentUser.email || 'User'),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  await db.collection('posts').doc(postId).update({
    commentCount: firebase.firestore.FieldValue.increment(1),
  });

  input.value = '';
  loadComments(postId);
}

// Load stream when switching to Stream tab
const origSwitchView = window.switchView;
window.switchView = function(view) {
  origSwitchView(view);
  if (view === 'stream') loadStreamPosts();
};

// Initial load if already on stream tab
if (document.getElementById('view-stream')?.classList.contains('active')) {
  loadStreamPosts();
}
