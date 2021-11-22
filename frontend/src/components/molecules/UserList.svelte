<script>
  import { users } from '../../stores';
</script>

<ul>
  {#each $users as user, i}
    <!-- profile image -->
    <!-- username -->

    <li>{user.username}</li>
  {/each}
</ul>

<style></style>
