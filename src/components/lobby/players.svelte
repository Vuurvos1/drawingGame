<script>
  import UserIcon from '../atoms/UserIcon.svelte';
  import { users } from '../../store';

  // console.log($users);
</script>

<div class={$$props.class}>
  <h2>Players</h2>

  <ul>
    {#each $users as user}
      <li>
        <UserIcon username={user.username} img={user.image} />
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  h2 {
    margin-bottom: 1rem;
  }
  ul {
    display: grid;
    list-style: none;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: auto;
    column-gap: 1.4rem;
    row-gap: 1.6rem;
  }
</style>
