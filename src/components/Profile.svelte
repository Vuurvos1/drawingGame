<script>
  import { gameState, username, userImg, socket } from './../store';
  import SelectInput from './atoms/SelectInput.svelte';
  import TextInput from './atoms/TextInput.svelte';

  let name = '';
  let imgOptions = [
    { name: 'moffel 1', value: 'img/userImg/user0.png' },
    { name: 'moffel 2', value: 'img/userImg/user1.png' },
    { name: 'moffel 3', value: 'img/userImg/user2.png' },
    { name: 'moffel 4', value: 'img/userImg/user3.png' },
    { name: 'moffel 5', value: 'img/userImg/user4.png' },
    { name: 'moffel 6', value: 'img/userImg/user5.png' },
    { name: 'moffel 7', value: 'img/userImg/user6.png' },
  ];

  function test(e) {
    e.preventDefault();
    // add form validity checks and trim/clean values

    if (!$username) {
      $username = 'img/userImg/user0.png';
    }

    const data = {
      username: $username,
      img: $userImg,
    };

    // update users in all sockets in room
    $socket.emit('updateUsers', data);

    // update game state
    $gameState = 'lobby';
  }
</script>

<main>
  <h1>✏️ Draw away</h1>

  <img class="profilePic" src={$userImg} alt="profile" />

  <form on:submit={test}>
    <TextInput
      bind:value={$username}
      label="username"
      name="username"
      req="true"
    />
    <!-- <div>
      <label for="username">Username</label>
      <input id="username" type="text" bind:this={name} />
    </div> -->

    <SelectInput bind:value={$userImg} options={imgOptions} />

    <!-- <div>
      <label for="profIndex">Profile index </label>
      <input id="profIndex" type="number" min="0" max="6" value="0" />
    </div> -->

    <button class="submit" type="submit">Start</button>
  </form>
</main>

<style lang="scss">
  main {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: 1.5rem;
    margin: 0 1.5rem;
  }

  h1 {
    grid-column: 5 / 9;
    margin: 6rem 0 2.625rem 0;

    color: var(--text);
    font-size: 4rem;
    text-align: center;
  }

  .profilePic {
    border-radius: 60rem;
    grid-column: 6 / 8;

    margin-bottom: 2.625rem;
  }

  form {
    grid-column: 5 / 9;
    align-items: center;
    justify-content: center;

    .submit {
      display: block;
      min-width: 10ch;

      margin-left: auto;
      padding: 1rem 0.8rem;

      font-size: 1rem;
      background: none;

      border: 1px solid rgba(var(--rgbText), 0.5);
      border-radius: 0.25rem;
    }
  }
</style>
