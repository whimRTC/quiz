<template>
  <div
    class="box"
    :class="whimPositionClass(displayUser)"
    v-if="point !== undefined"
  >
    <p>{{ point }}pts</p>
  </div>
</template>

<script>
export default {
  name: "Point",
  props: {
    point: Number,
    displayUser: Object
  }
};
</script>

<style lang="scss" scoped>
.box {
  position: absolute;
  padding: 0.5em 1em;
  margin: 0 0;
  font-weight: bold;
  color: #fff; /*文字色*/
  background: rgba(220, 40, 0, 0.8);
  border: solid 3px #dc2800; /*線*/
  max-width: 70px;
  border-radius: 4px; /*角の丸み*/

  &.left {
    left: 5%;
  }
  &.right:not(.left) {
    right: 5%;
  }
  &.top {
    top: 5%;
  }
  &.bottom:not(.top) {
    bottom: 50px;
  }
}
.box p {
  margin: 0;
  padding: 0;
  text-align: center;
  font-size: 24px;
}
// .left {
//   right: 5%;
// }
::v-deep .left .box {
  right: 5%;
}
// .right {
//   left: 5%;
// }
// .top {
//   top: 40%;
// }
// .bottom {
//   top: 40%;
// }
</style>
