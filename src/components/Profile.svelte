<script>
  import { gameState, username } from './../store';

  let name = '';

  function test(e) {
    e.preventDefault();
    // add form validity checks

    $gameState = 'lobby';
    // trim this value if needed
    $username = name.value;
  }
</script>

<main>
  <h1>Drawing game</h1>
  <!-- <p>Profile</p> -->

  <form on:submit={test}>
    <div>
      <label for="username">Username</label>
      <input id="username" type="text" bind:this={name} />
    </div>

    <div>
      <label for="profIndex">Profile index </label>
      <input id="profIndex" type="number" min="0" max="6" value="0" />
    </div>

    <button type="submit">submit</button>
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
    color: white;
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
      color: white;
    }

    input {
      padding: 0.5rem 1rem;
    }
  }
</style>
