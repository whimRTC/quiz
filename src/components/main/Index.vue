<template>
  <div class="container">
    <div>
      <div v-if="phase === 'setting'">
        <div class="card">
          <div class="cp_ipselect cp_sl05">
            <select v-model="nQuizzes" required>
              <option value="" hidden>モードを選ぶ</option>
              <option value="5">5問クイズ</option>
              <option value="10">10問クイズ</option>
              <option value="20">20問クイズ</option>
            </select>
          </div>
          <a @click="start" class="btn-border" style="cursor: hand;"
            >スタート</a
          >
        </div>
      </div>
      <div v-else-if="phase === 'playing'">
        <div class="card">
          <div v-if="!quizAnswered">残り{{ Math.ceil(timeLeft) }}秒</div>
          <div>{{ state.quizNo }}/{{ state.nQuizzes }}</div>
          <div>{{ question }}</div>
          <div v-if="quizAnswered">答え: {{ answer }}</div>
          <a v-if="quizAnswered" @click="nextQuiz" class="btn-border">{{
            state.nQuizzes === state.quizNo ? "結果発表へ" : "次の問題へ"
          }}</a>
          <TimeBar :ratio="timeLeftRatio" />
        </div>
        <div class="choices">
          <Choice
            color="primary"
            @select="userSelect(n)"
            v-for="(choice, n) in state.choices"
            :key="n"
            :choice="choice"
            :n="n"
            :positionNumber="$whim.accessUser.positonNumber"
            :answered="quizAnswered || !!select[$whim.accessUser.id]"
            :selected="n === select[$whim.accessUser.id]"
            :correct="answerState[$whim.accessUser.id] === 'correct'"
          ></Choice>
        </div>
      </div>
      <div v-else-if="phase === 'results'">
        <div class="card">
          <div class="card champion">優勝は{{ champion }}!!</div>
          <a @click="reset" class="btn-border">もう一度やる</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { shuffle, shuffleChoices } from "../../utils/shuffle";
import { Howl } from "howler";

const QUIZZES = require("@/assets/quizzes.json").quizzes;
const TIME_LIMIT = 15;
const SE_CORRECT = new Howl({
  src: require("@/assets/correct1.mp3")
});
const SE_INCORRECT = new Howl({
  src: require("@/assets/incorrect1.mp3")
});
const SE_CHEER = new Howl({
  src: require("@/assets/people-performance-cheer1.mp3")
});
const SE_QUESTION = new Howl({
  src: require("@/assets/question1.mp3")
});

export default {
  name: "Main",
  data: function() {
    return {
      nQuizzes: 10,
      nQuizzesChoices: [5, 10, 20],
      now: new Date().getTime(),
      timeBegin: undefined
    };
  },
  components: {
    TimeBar: () => import("@/components/main/TimeBar"),
    Choice: () => import("@/components/main/Choice")
  },
  computed: {
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
    sound() {
      return this.$whim.state.sound;
    },
    quizAnswered() {
      if (this.state.quizAnswered) {
        return true;
      }
      return false;
    },
    accessUserId() {
      return this.$whim.accessUser.id;
    },
    answer() {
      return this.state.choices[this.state.answerIdx];
    },
    timeLeft() {
      const timeBegin = this.state.timeBegin;
      if (timeBegin === undefined) return undefined;
      const between = this.now - timeBegin;
      const t = TIME_LIMIT - between / 1000;
      if (t <= 0) {
        this.$whim.assignState({
          quizAnswered: true
        });
      }
      return t;
    },
    timeLeftRatio() {
      if (this.state.quizAnswered) return 0;
      return this.timeLeft / TIME_LIMIT;
    },
    question() {
      const q = this.state.question;
      if (this.state.quizAnswered) return q;
      const ratio = 1 - this.timeLeftRatio;
      return q.slice(0, Math.ceil(ratio * q.length * 3));
    },
    champion() {
      let champ,
        tmp = -1000000000;
      for (const user of this.users) {
        if (tmp < this.state.points[user.id]) {
          tmp = this.state.points[user.id];
          champ = user.name;
        }
      }
      return champ;
    }
  },
  methods: {
    start() {
      const indices = Array.from({ length: QUIZZES.length }, (v, k) => k);
      const quizIndices = shuffle(indices).slice(0, this.nQuizzes);
      const points = {};
      for (const user of this.users) {
        points[user.id] = 0;
      }
      this.$whim.assignState({
        nQuizzes: this.nQuizzes,
        quizNo: 1,
        quizIndices: quizIndices,
        points: points
      });
      this.setQuiz(quizIndices[0]);
    },
    setQuiz(idx) {
      const quiz = QUIZZES[idx];
      this.sendSound("question");

      const [choices, answerIdx] = shuffleChoices(quiz);
      this.$whim.assignState({
        phase: "playing",
        question: quiz.question,
        answerIdx: answerIdx,
        choices: choices,
        timeBegin: new Date().getTime(),
        quizAnswered: false
      });
    },
    userSelect(choiceIdx) {
      const myState = this.answerState[this.accessUserId];
      if (myState === "correct" || myState === "incorrect") return;
      const answerIdx = this.state.answerIdx;
      const state = this.state;

      let answerState, points, quizAnswered;
      if (answerIdx === choiceIdx) {
        answerState = "correct";
        this.sendSound("correct");
        quizAnswered = true;
        points = state.points[this.accessUserId] + 1;
      } else {
        answerState = "incorrect";
        points = state.points[this.accessUserId] - 1;
        this.sendSound("incorrect");

        quizAnswered = false;
      }

      this.$whim.assignState({
        select: { [this.accessUserId]: choiceIdx },
        answerState: { [this.accessUserId]: answerState },
        points: { [this.accessUserId]: points },
        quizAnswered: quizAnswered
      });

      // 終了判定
      if (this.$whim.users.every(user => this.answerState[user.id])) {
        this.$whim.assignState({
          quizAnswered: true
        });
      }
    },
    nextQuiz() {
      const state = this.state;
      const nextNo = this.$whim.state.quizNo + 1;
      if (nextNo > state.nQuizzes) {
        this.end();
        return;
      }
      this.sendSound("question");
      const idx = state.quizIndices[nextNo];
      const quiz = QUIZZES[idx];
      const [choices, answerIdx] = shuffleChoices(quiz);
      this.$whim.assignState({
        quizNo: nextNo,
        question: quiz.question,
        answerIdx: answerIdx,
        choices: choices,
        timeBegin: new Date().getTime(),
        quizAnswered: false,
        answerState: null,
        select: null
      });
      // this.question = ''
      // setTimeout(this.generateQuestion, 1000);
      // const orderedChoices = quiz.slice(1)
      // this.choices = shuffle(orderedChoices)
    },
    end() {
      this.sendSound("cheer");
      this.$whim.assignState({
        phase: "results"
      });
    },
    reset() {
      const nQuizzes = this.$whim.state.nQuizzes;
      this.$whim.assignState({
        phase: "setting",
        nQuizzes: nQuizzes
      });
    },
    sendSound(src) {
      this.$whim.assignState({
        sound: src
      });
    }
  },
  watch: {
    sound: function(newSound) {
      let s;
      switch (newSound) {
        case "correct":
          s = SE_CORRECT;
          break;
        case "incorrect":
          s = SE_INCORRECT;
          break;
        case "cheer":
          s = SE_CHEER;
          break;
        case "question":
          s = SE_QUESTION;
          break;
        default:
          return;
      }
      s.volume(0.4);
      s.play();
      this.$whim.assignState({
        sound: null
      });
    }
  },
  mounted() {
    setInterval(() => {
      this.now = new Date().getTime();
    }, 10);
    this.$whim.assignState({ phase: "setting" });
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

// .titletext{
//   font-weight:bold;
//   font-size:32px;
//   padding-top:24px;
//   border:1px solid blue;
// }
.cp_ipselect {
  /* 収まらない時、収まらない部分を非表示にする */
  overflow: hidden;

  width: 80%;
  margin: 16px auto 32px auto;
  text-align: center;
  padding: 4px;
}
.cp_ipselect select {
  width: 100%;
  padding-right: 1em;
  cursor: pointer;
  text-indent: 0.01px;
  text-overflow: ellipsis;
  border: none;
  outline: none;
  background: transparent;
  background-image: none;
  box-shadow: none;
  -webkit-appearance: none;
  appearance: none;
  font-weight: bold;
}

/* 選択ボックス特有の矢印 */
.cp_ipselect select::-ms-expand {
  display: none;
}

.cp_ipselect.cp_sl05 {
  position: relative;
  /* border-radius: 2px; */
  border-radius: 8px;
  /* background: #da3c41; */
  background: white;
  border: 2px solid black;
  display: inline-block;
}

/* 選択ボックス横の矢印のCSS */
.cp_ipselect.cp_sl05::before {
  position: absolute;
  top: 18px;
  right: 20px;
  width: 0;
  height: 0;
  padding: 0;
  content: "";
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 12px solid black;
  pointer-events: none;
}
.cp_ipselect.cp_sl05 select {
  padding: 8px 32px 8px 8px;
  /* padding: 8px 38px 8px 8px; */
  color: black;
}

/* ボタンのCSS */
.btn-border {
  display: block;
  max-width: 180px;
  text-align: left;
  border: 2px solid #9ec34b;
  font-size: 16px;
  color: #9ec34b;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  transition: 0.4s;
  cursor: hand;
  cursor: pointer;
}

/* ボタンのホバー時のcss */
.btn-border:hover {
  background-color: #9ec34b;
  border-color: #cbe585;
  color: #fff;
}

/* カードを中央に配置している */
.card {
  background: #fff;
  height: 240px;
  width: 320px;
  opacity: 0.85;
  position: relative;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  border-radius: 4px;
  flex-direction: column;
}

.champion {
  font-weight: bold;
  font-size: 20px;
}
</style>
