export default class Modal {
  constructor() {
    this.elem = null;
    this.tooltipEl = null;
    this.formEl = null;
    this.eventSubmit = null;
    this.createEl();
  }

  createEl() {
    this.elem = document.createElement('div');
    this.elem.className = 'modal';
    this.elem.insertAdjacentHTML(
      'beforeend',
      `<form class="form">
        <h3>Выберите псевдоним</h3>
        <input type="text" class="nickname" name="nickname">
        <button type="submit" class="submit" disabled>Продолжить</button>
      </form>
      <div class="msg-server">Сервер на Render уже запускается. Минуточку...</div>`
    );
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'tooltip';
    this.tooltipEl.textContent = 'Такой ник уже существует. Выберите другой.';
    this.formEl = this.elem.querySelector('.form');
    this.formEl.addEventListener('submit', this.onSubmitForm.bind(this));
  }

  addListenerSubmit(callback) {
    this.eventSubmit = callback;
  }

  onSubmitForm(e) {
    e.preventDefault();
    this.eventSubmit.call(null);
  }
}
