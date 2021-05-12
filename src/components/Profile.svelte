<script>
  import { gameState, username, userImg } from './../store';
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
    // add form validity checks

    $gameState = 'lobby';
    // trim this value if needed
    $username = name.value;
  }
</script>

<main>
  <h1>✏️ Draw away</h1>

  <img class="profilePic" src={$userImg} alt="profile" />

  <form on:submit={test}>
    <TextInput label="username" name="username" req="true" />
    <!-- <div>
      <label for="username">Username</label>
      <input id="username" type="text" bind:this={name} />
    </div> -->

    <SelectInput bind:value={$userImg} options={imgOptions} />

    <!-- <div>
      <label for="profIndex">Profile index </label>
      <input id="profIndex" type="number" min="0" max="6" value="0" />
    </div> -->

    <button type="submit">Start</button>
  </form>
</main>

<style lang="scss">
  main {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 1.5rem;
    margin: 1 1.5rem;
  }

  h1 {
    grid-column: 5/8;
    margin: 6rem 0 1em 0;
    // color: white;
    color: var(--text);
    font-size: 4rem;
  }

  .profilePic {
    border-radius: 60rem;
  }

  form {
    grid-column: 5/8;
    align-items: center;
    justify-content: center;

    button {
      padding: 0.5rem 1rem;
    }
  }

  div {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;

    label {
      color: var(--white);
    }

    input {
      padding: 0.5rem 1rem;
    }
  }
</style>
