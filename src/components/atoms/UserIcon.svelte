<script>
  export let img = './img/userImg/user0.png';
  export let username = 'Username';
</script>

<div class="userIcon">
  <img src={img} alt="profile photo of user {username}" />
  <p>{username}</p>
</div>

<style lang="scss">
  .userIcon {
    img {
      border-radius: 100rem;
      margin-bottom: 0.6rem;

      width: 100%;
      height: auto;
    }

    p {
      text-align: center;
    }
  }
</style>
