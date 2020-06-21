<template>
  <div class="container">
    <div class="player">
      <div v-if="phase === 'setting'"></div>
    </div>
    <div
      class="choice-box"
      :class="whimPositionClass(displayUser)"
      v-if="!isMe && quizAnswered && choice !== undefined"
    >
      <p>{{ choice }}</p>
    </div>
    <Point :point="point" :displayUser="displayUser" />
    <img
      v-if="phase === 'playing' && answerState[displayUser.id] === 'correct'"
      src="../../assets/circle.svg"
      class="circle"
    />
    <img
      v-else-if="
        phase === 'playing' && answerState[displayUser.id] === 'incorrect'
      "
      src="../../assets/cross.svg"
      class="cross"
    />
    <Rank :rank="rank" v-if="phase === 'results'" />
  </div>
</template>

<script>
export default {
  name: "Player",
  props: {
    displayUser: Object
  },
  components: {
    Point: () => import("@/components/player/Point"),
    Rank: () => import("@/components/player/Rank")
  },
  computed: {
    isMe() {
      return this.displayUser.id === this.$whim.accessUser.id;
    },
    state() {
      return this.$whim.state;
    },
    answerState() {
      return this.$whim.state.answerState || {};
    },
    phase() {
      return this.$whim.state.phase;
    },
    point() {
      const points = this.state.points;
      if (!points) return undefined;
      return points[this.displayUser.id];
    },
    quizAnswered() {
      return this.state.quizAnswered;
    },
    rank() {
      const points = [];
      for (const user of this.$whim.users) {
        points.push({
          p: this.state.points[user.id],
          isPlayer: user.id === this.displayUser.id
        });
      }
      points.sort((a, b) => b.p - a.p);
      let pointBefore = -10000000000;
      let j = -1;
      for (let i = 0; i < points.length; i++) {
        const pi = points[i];
        if (pi.p === pointBefore) {
          pi.rank = j;
        } else {
          pi.rank = j = i + 1;
          pointBefore = pi.p;
        }
      }
      return points.filter(e => e.isPlayer)[0].rank;
    },
    choice() {
      const select = (this.$whim.state.select || {})[this.displayUser.id];
      return (this.$whim.state.choices || {})[select];
    }
  },
  methods: {
    end() {
      this.$whim.assignState({
        phase: "results"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

img {
  margin: 0;
  opacity: 0.5;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.circle {
  width: 180%;
}
.cross {
  width: 40%;
}
.choice-box {
  margin: 10px 0;
  border-radius: 5px;
  font-weight: bold;
  background: rgba(256, 256, 256, 0.9);
  width: 60vw;
  max-width: 250px;
  cursor: pointer;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%) translateY(-10%);
  p {
    margin: 0;
    padding: 15px 10px;
  }
  &.bottom:not(.top) {
    top: 90%;
    transform: translateX(-50%) translateY(-90%);
  }
}
</style>
