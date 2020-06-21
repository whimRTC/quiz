<template>
  <div class="box" @click="$emit('select')" v-if="!answered || selected">
    <p>{{ choice }}</p>
  </div>
</template>

<script>
export default {
  name: "Choice",
  props: {
    choice: String,
    answered: Boolean,
    selected: Boolean
  }
};
</script>
<style lang="scss" scoped>
.box {
  margin: 10px 0;
  border-radius: 5px;
  font-weight: bold;
  background: rgba(256, 256, 256, 0.9);
  width: 60vw;
  max-width: 250px;
  cursor: pointer;
  position: relative;
  left: 50%;
  transform: translate(-50%);
}
.box p {
  margin: 0;
  padding: 15px 10px;
}
</style>
