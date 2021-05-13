<script>
  import UserIcon from '../atoms/UserIcon.svelte';

  import { users } from '../../store';

  console.log($users);
</script>

<div class={$$props.class}>
  <h2>Players</h2>

  <ul>
    <li>
      {#each $users as user}
        <UserIcon username={user.username} img={user.image} />
      {/each}
    </li>
  </ul>
</div>

<style lang="scss"></style>
