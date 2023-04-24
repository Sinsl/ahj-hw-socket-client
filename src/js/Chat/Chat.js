import Users from './Users';

export default class Chat {
  constructor(element) {
    this.chatEl = element;
    this.users = new Users();
    this.msgBody = null;
    this.msgForm = null;
    this.youName = null;
    this.connectId = null;
    this.init();
  }

  init() {
    this.createChatField();
  }

  createChatField() {
    this.chatEl.append(this.users.elem);
    const msgField = document.createElement('div');
    msgField.className = 'messages';
    this.msgBody = document.createElement('div');
    this.msgBody.className = 'messages-body';
    msgField.append(this.msgBody);
    this.msgForm = document.createElement('form');
    this.msgForm.className = 'message-send';
    this.msgForm.insertAdjacentHTML(
      'beforeend',
      '<input type="text" name="msg" class="send">'
    );
    msgField.append(this.msgForm);
    this.chatEl.append(msgField);
  }

  addMessage(msg) {
    const name = msg.user === this.youName ? 'You' : msg.user;
    const date = new Date(msg.created).toLocaleString('ru-Ru', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    if (name === 'You') {
      messageEl.classList.add('you');
    }
    messageEl.insertAdjacentHTML(
      'beforeend',
      `<div class="message-header">
      <div class="message-header_name">${name}</div>
      <div class="message-header_time">${date.replace(',', '')}</div>
      </div>
      <div class="message-text">${msg.text}</div>`
    );
    this.msgBody.append(messageEl);
    this.msgBody.lastElementChild.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
  }

  openChat() {
    const ws = new WebSocket('wss://ahj-hw-socket-server.onrender.com');
    const chatInput = this.msgForm.querySelector('.send');

    this.msgForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();

      if (!message) return;

      ws.send(JSON.stringify({ message: { date: Date.now(), text: message } }));

      chatInput.value = '';
    });

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ name: this.youName }));
    });

    ws.addEventListener('close', () => {
      console.log('ws close');
    });

    ws.addEventListener('error', (e) => {
      console.log(e);
      console.log('ws error');
    });

    ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);

      if (data.joining) {
        this.connectId = data.joining;
      }

      if (data.online) {
        const arrUsers = [];
        data.online.forEach((item) => {
          if (item.id === this.connectId) {
            arrUsers.push('You');
          } else {
            arrUsers.push(item.name);
          }
        });
        this.users.renderUsers(arrUsers);
      }

      if (data.loadMsg) {
        data.loadMsg.forEach((item) => this.addMessage(item));
      }

      if (data.message) {
        this.addMessage(data.message);
      }
    });
  }
}
