import requestServer from './requestServer';
import Modal from './Modal';
import Chat from './Chat';

export default class Controller {
  constructor(element) {
    this.parent = element;
    this.chat = null;
    this.modal = new Modal();
    this.init();
  }

  init() {
    this.createChatField();
    this.pingServer();
    this.registerEvent();
  }

  createChatField() {
    const headerChat = document.createElement('h2');
    headerChat.textContent = 'Chat';
    this.parent.append(headerChat);
    const chatEl = document.createElement('div');
    chatEl.className = 'chat';
    this.chat = new Chat(chatEl);
    this.parent.append(this.chat.chatEl);
    document.body.append(this.modal.elem);
  }

  pingServer() {
    const id = setInterval(() => {
      requestServer({ url: '', method: 'GET' }, async (resp) => {
        const result = await resp;
        if (resp.status) {
          const msg = this.modal.elem.querySelector('.msg-server');
          msg.textContent = 'Сервер запущен.';
          msg.style.color = 'green';
          this.modal.elem.querySelector('.submit').disabled = false;
          clearInterval(id);
        } else {
          if (result instanceof TypeError) {
            console.log('сервер ожидает запуска');
          }
        }
      });
    }, 2000);
  }

  registerEvent() {
    this.modal.addListenerSubmit(this.onSubmitForm.bind(this));
  }

  onSubmitForm() {
    const str = this.modal.formEl.nickname.value.trim();
    if (str.length > 2) {
      const options = {
        url: '/users/entry',
        method: 'POST',
        body: JSON.stringify({ name: str }),
      };
      requestServer(options, async (resp) => {
        const result = await resp;
        if (result.status === 'find') {
          this.modal.formEl.append(this.modal.tooltipEl);
          setTimeout(() => {
            this.modal.tooltipEl.remove();
          }, 4000);
        } else if (result.status === 'ok') {
          this.modal.formEl.reset();
          this.modal.elem.remove();
          this.chat.youName = result.name;
          this.chat.openChat();
        } else {
          console.log(result);
        }
      });
    }
  }
}
