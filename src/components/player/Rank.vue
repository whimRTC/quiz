<template>
  <div>
    <img class="ranking" :src="require(`@/assets/rank/${rank}.png`)" />
  </div>
</template>
<script>
export default {
  name: "Rank",
  props: {
    rank: Number
  }
};
</script>
<style lang="scss" scoped>
.ranking {
  // height: 800px;
  // float: left;
  position: absolute;
  width: 80vmin;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
