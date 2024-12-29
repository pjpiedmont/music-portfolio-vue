<script setup lang="ts"></script>

<!----------------------------------------------------------------------------->

<template>
  <div id="hero" class="container full-width center p-5">
    <div id="content" class="container ltr border rounded">
      <img id="profile-pic" class="border-right"
        src="@/assets/images/tulips.jpeg" />

      <div class="container ttb fill">
        <div class="container ttb center fill border-bottom">
          <h1>Parker Piedmont</h1>
          <p>Computer Music Man</p>
        </div>

        <div class="container ltr fill">
          <a href="#" class="fill">Listen</a>
          <a href="#" class="fill border-left">About</a>
          <a href="#" class="fill border-left">Contact</a>
        </div>
      </div>
    </div>
  </div>
</template>

<!----------------------------------------------------------------------------->

<style lang="scss" scoped>
.container {
  display: flex;
  max-width: 1400px;

  &.full-width {
    max-width: 100%;
  }

  &.ltr {
    justify-content: flex-start;
  }

  &.ttb {
    flex-direction: column;
    justify-content: flex-start;
  }

  &.center {
    justify-content: center;
    align-items: center;
  }
}

.fill {
  flex: 1;
}

.p-5 {
  padding: 5rem;
}

.border {
  border: 2px solid rgb(153, 40, 194);

  &.rounded {
    border-radius: 2rem;
    overflow: hidden;
  }
}

.border-left {
  border-left: 2px solid rgb(153, 40, 194);
}

.border-right {
  border-right: 2px solid rgb(153, 40, 194);
}

.border-bottom {
  border-bottom: 2px solid rgb(153, 40, 194);
}

#hero {
  min-height: 50vh;

  background-image: url('@/assets/images/unnamed_album.png');
  background-size: cover;
  background-position: center;
}

#content {
  box-shadow: 0 0.5rem 2rem 1rem rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.4);
}

#profile-pic {
  width: 40%;
  max-width: 100rem;
}

a {
  display: block;
  line-height: 100%;
  text-decoration: none;
  color: #fff;

  &:hover {
    color: #000;
    background-color: rgb(153, 40, 194);
  }
}
</style>
