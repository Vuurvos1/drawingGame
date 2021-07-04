// incomming
socket.on('userJoin', (data) => {
  const users = q('.users');
  users.innerHTML = '';
  playerGrid.innerHTML = '';

  for (let i of data) {
    // lobby users
    users.innerHTML += `
    <div class="user ${i.id}">
      <img class="user__img" 
        src="img/userImg/user${i.imageId}.png" 
        alt="User photo ${i.imageId}" />
      <p class="user__name">${i.username}</p>
    </div>
    `;

    // game users
    playerGrid.innerHTML += `
    <div class="user ${i.id}">
      <p class="user__rank">#1</p>
      <div>
        <p class="user__name">${i.username}</p>
        <p class="user__score">Score: 0</p>
      </div>
      <img class="user__img" 
        src="img/userImg/user${i.imageId}.png" 
        alt="User photo ${i.imageId}" />
    </div>
    `;
  }
});

socket.on('userLeave', (data) => {
  // remove all users elements with user id class
  const el = qa(`.${data.id}`);

  for (let i of el) {
    i.parentNode.removeChild(i);
  }
});

q('.updateUsername').addEventListener('click', (e) => {
  e.preventDefault();

  const data = {
    username: q('#name').value.trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;'),
    id: socket.id,
  };

  socket.emit('updateUsername', data);
});
