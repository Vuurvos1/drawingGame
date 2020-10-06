// incomming
socket.on('userJoin', (data) => {
  playerGrid.innerHTML = '';

  for (let i of data) {
    playerGrid.innerHTML += `
        <div class="players__user ${i.id}">
          <img src="img/userImg/user${i.imageId}.png" 
            alt="User photo ${i.imageId}" />
          <h3>User ${i.imageId}</h3>
          <h4>${i.you ? 'You' : ''}</h4>
        </div>
    `;
  }
});

socket.on('userLeave', (data) => {
  const el = document.querySelector(`.${data.id}`);
  el.parentNode.removeChild(el);
});

// outgoing
