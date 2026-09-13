(function () {
  'use strict';
  var byId = function (id) { return document.getElementById(id); };
  var dialog = byId('privateChat');
  var status = byId('chatStatus');
  var input = byId('chatText');
  var send = byId('chatSend');
  var list = byId('chatMessages');
  var auth, db, user = null, unsubscribe = null, generation = 0, allowed = false;
  var busy = false;
  var dateFormat = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  function setStatus(text) { status.textContent = text; }
  function stopListening() {
    generation++;
    if (unsubscribe) unsubscribe();
    unsubscribe = null;
    allowed = false;
    list.textContent = '';
    byId('chatRoom').hidden = true;
    byId('chatGate').hidden = false;
  }
  function render(snapshot) {
    var nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 90;
    var first = !list.children.length;
    var scroll = list.scrollTop;
    list.textContent = '';
    var docs = snapshot.docs.slice().reverse();
    if (!docs.length) {
      var empty = document.createElement('li');
      empty.className = 'chat-empty';
      empty.textContent = 'A conversa começa com um oi. Envie a primeira mensagem 💖';
      list.appendChild(empty);
    }
    docs.forEach(function (doc) {
      var data = doc.data();
      var mine = data.authorId === user.uid;
      var item = document.createElement('li');
      item.className = 'chat-message' + (mine ? ' is-mine' : '');
      var author = document.createElement('span');
      author.className = 'chat-author';
      author.textContent = mine ? 'Você' : (data.authorName || 'Seu amor');
      var text = document.createElement('p');
      text.className = 'chat-text';
      text.textContent = data.text;
      var time = document.createElement('time');
      time.className = 'chat-time';
      var date = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null;
      if (date) { time.dateTime = date.toISOString(); time.textContent = dateFormat.format(date); }
      else time.textContent = 'Enviando…';
      item.appendChild(author); item.appendChild(text); item.appendChild(time);
      list.appendChild(item);
    });
    list.scrollTop = nearBottom || first ? list.scrollHeight : scroll;
  }
  function listen() {
    stopListening();
    if (!user || !dialog.open) return;
    var active = generation;
    setStatus('Conferindo seu acesso…');
    unsubscribe = db.collection('chatPrivado').orderBy('createdAt', 'desc').limit(100)
      .onSnapshot({ includeMetadataChanges: true }, function (snapshot) {
        if (active !== generation) return;
        // Uma conta nova só vê mensagens depois de autorização do servidor.
        if (!allowed && snapshot.metadata.fromCache) return;
        allowed = true;
        byId('chatGate').hidden = true;
        byId('chatRoom').hidden = false;
        render(snapshot);
        setStatus(snapshot.metadata.fromCache ? 'Sem conexão. Reconectando…' : 'Últimas 100 mensagens · horário de Brasília');
      }, function (error) {
        if (active !== generation) return;
        stopListening();
        setStatus(error.code === 'permission-denied'
          ? 'Esta conta não tem acesso ao chat. Entre com uma das duas contas autorizadas. Se for sua conta, confira as regras do chat no Firebase.'
          : 'Não foi possível carregar a conversa. Feche e abra o chat para tentar novamente.');
      });
  }
  byId('chatOpen').addEventListener('click', function () {
    if (!dialog.open) dialog.showModal();
    if (auth) { if (user) listen(); else setStatus('Entre para acessar suas mensagens.'); }
  });
  byId('chatClose').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () { stopListening(); byId('chatOpen').focus(); });
  input.addEventListener('input', function () { byId('chatCounter').textContent = input.value.length + ' / 2000'; });

  if (!window.firebase || !firebase.apps.length || typeof firebase.auth !== 'function') {
    byId('chatSignIn').disabled = true;
    setStatus('Não foi possível conectar o chat. Recarregue a página com acesso à internet.');
    return;
  }
  auth = firebase.auth();
  db = firebase.firestore();
  auth.onAuthStateChanged(function (account) {
    stopListening();
    user = account;
    input.value = '';
    input.disabled = false;
    byId('chatCounter').textContent = '0 / 2000';
    busy = false; send.disabled = false; send.textContent = 'Enviar 💌';
    byId('chatSession').hidden = !user;
    byId('chatAccount').textContent = user ? user.email : '';
    byId('chatSignIn').textContent = user ? 'Entrar com outra conta' : 'Entrar com Google';
    setStatus(user ? 'Abra o chat para conversar.' : 'Entre para acessar suas mensagens.');
    if (user && dialog.open) listen();
  });
  byId('chatSignIn').addEventListener('click', function () {
    if (location.protocol === 'file:') {
      setStatus('Para entrar, abra este mural pelo endereço do GitHub Pages. O login não funciona no arquivo local.');
      return;
    }
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    byId('chatSignIn').disabled = true;
    setStatus('Abrindo o login Google…');
    auth.signInWithPopup(provider).catch(function (error) {
      var messages = {
        'auth/popup-closed-by-user': 'Login cancelado. Você pode tentar novamente.',
        'auth/popup-blocked': 'Permita a janela de login no navegador e tente novamente.',
        'auth/unauthorized-domain': 'Adicione este domínio aos domínios autorizados do Firebase Authentication.',
        'auth/operation-not-allowed': 'Ative o provedor Google no Firebase Authentication.',
        'auth/network-request-failed': 'Confira sua conexão e tente entrar novamente.'
      };
      setStatus(messages[error.code] || 'Não foi possível entrar. Tente novamente.');
    }).finally(function () { byId('chatSignIn').disabled = false; });
  });
  byId('chatSignOut').addEventListener('click', function () {
    stopListening();
    input.value = '';
    auth.signOut().catch(function () { setStatus('Não foi possível sair. Tente novamente.'); });
  });
  byId('chatForm').addEventListener('submit', function (event) {
    event.preventDefault();
    if (!allowed || !user || busy) return;
    var text = input.value.trim();
    if (!text || text.length > 2000) { setStatus('Escreva uma mensagem de até 2000 caracteres.'); return; }
    if (!navigator.onLine) { setStatus('Você está sem internet. Seu texto continua aqui para enviar quando voltar.'); return; }
    var sender = user.uid;
    busy = true; send.disabled = true; input.disabled = true; send.textContent = 'Enviando…';
    setStatus('Enviando mensagem…');
    db.collection('chatPrivado').add({
      authorId: sender, authorName: (user.displayName || 'Meu amor').slice(0, 80),
      text: text, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function () {
      if (!user || user.uid !== sender) return;
      input.value = ''; byId('chatCounter').textContent = '0 / 2000';
      setStatus('Mensagem enviada 💖'); list.scrollTop = list.scrollHeight;
    }).catch(function (error) {
      if (!user || user.uid !== sender) return;
      setStatus(error.code === 'permission-denied'
        ? 'Mensagem não enviada: confira as permissões da sua conta no Firebase.'
        : 'Não foi possível enviar. Seu texto foi mantido; tente novamente.');
    }).finally(function () {
      if (!user || user.uid !== sender) return;
      busy = false; send.disabled = false; input.disabled = false; send.textContent = 'Enviar 💌';
      if (dialog.open) input.focus();
    });
  });
})();
