// incomming
socket.on('userJoin', (data) => {
  playerGrid.innerHTML = '';

  for (let i of data) {
    playerGrid.innerHTML += `
    <div class="user ${i.id}">
      <p class="user__rank">#1</p>
      <div>
        <p class="user__name">${i.id}</p>
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
  const el = document.querySelector(`.${data.id}`);
  el.parentNode.removeChild(el);
});
