export default class Users {
  constructor() {
    this.elem = null;
    this.createUsersField();
  }

  createUsersField() {
    this.elem = document.createElement('div');
    this.elem.className = 'users';
  }

  addUser(name) {
    const userEl = document.createElement('div');
    userEl.className = 'user';
    const avatar = name === 'You' ? 'Y' : name.slice(0, 2);
    if (avatar === 'Y') {
      userEl.classList.add('you');
    }
    userEl.insertAdjacentHTML(
      'beforeend',
      `<div class="user-avatar">${avatar}</div>
      <div class="user-name">${name}</div>`
    );
    this.elem.append(userEl);
  }

  renderUsers(users) {
    this.elem.innerHTML = '';
    users.forEach((item) => this.addUser(item));
  }
}
