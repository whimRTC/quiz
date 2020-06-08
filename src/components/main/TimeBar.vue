<template>
  <!-- <div id="barbox"> -->
  <!-- <div id="bar" :width="barWidth">{{barWidth}}</div> -->
  <canvas id="canvas"></canvas>
  <!-- </div> -->
</template>

<script>
export default {
  name: "TimeBar",
  props: {
    ratio: Number
  },
  mounted() {
    window.requestAnimFrame = (function() {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const w = document.getElementById("canvas").offsetWidth;
    const h = document.getElementById("canvas").offsetHeight;
    canvas.width = w;
    canvas.height = h;

    function reset() {
      // ctx.fillStyle = "#272822";
      // ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#171814";
      // ctx.fillRect(25, 80, 350, 25);
      ctx.fillRect(0, 0, w, h);
    }
    const calcWidth = () => w * this.ratio;

    class progressbar {
      constructor() {
        this.width = calcWidth();
        this.hue = 0;
      }

      draw = () => {
        ctx.fillStyle = "hsla(" + this.hue + ", 100%, 40%, 1)";
        ctx.fillRect(0, 0, this.width, h);
        const grad = ctx.createLinearGradient(0, 0, 0, 130);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, "rgba(0,0,0,0.5)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.width, h);
      };
    }
    this.bar = new progressbar();

    const draw = () => {
      reset();
      this.bar.hue = 126 * this.ratio;
      this.bar.draw();
    };
    draw();

    const animloop = () => {
      this.bar.width = calcWidth();
      draw();
      requestAnimationFrame(animloop);
    };
    animloop();
  }
};
</script>

<style lang="scss" scoped>
canvas {
  width: 100%;
  height: 3%;
  margin-top: 5%;
  background-color: #171814;
}
// #barbox {
//   width: 100%;
//   height: 3%;
//   margin-top: 5%;
//   background-color: #171814;
// }
// #bar {
//   position: relative;
//   background-color: rgb(216, 2, 2);
// }
</style>
