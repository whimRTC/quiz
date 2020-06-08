<template>
  <div class="container">
    <div class="player">
      <div v-if="phase === 'setting'"></div>
      <div
        v-else-if="phase === 'playing' && isMe"
        class="choice-box"
        :class="side"
      ></div>
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
// import { shuffleChoices } from "../../utils/shuffle";
// const QUIZZES = require("@/assets/quizzes.json").quizzes;

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
    accessUserId() {
      return this.$whim.accessUser.id;
    },
    isMe() {
      return this.displayUser.id === this.accessUserId;
    },
    users() {
      return this.$whim.users;
    },
    state() {
      return this.$whim.state;
    },
    select() {
      return this.$whim.state.select || {};
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
    myAnswerState() {
      return this.$whim.state.answerState[this.accessUserId];
    },
    side() {
      const ps = this.displayUser.positionNumber;
      if (ps === 1 || ps === 3) {
        return "left";
      }
      return "right";
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
  position: absolute;
  top: 50%;
  &.left {
    left: 20%;
    transform: translateY(-50%) translateX(-20%);
  }
  &.right {
    left: 80%;
    transform: translateY(-50%) translateX(-80%);
  }
}
</style>
