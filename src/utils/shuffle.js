export const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const shuffleChoices = quiz => {
  const choices = [];
  const order = shuffle([-1, 0, 1, 2]);
  let answerIdx;
  for (let i = 0; i < order.length; i++) {
    const ord = order[i];
    if (ord === -1) {
      choices.push(quiz.answer);
      answerIdx = i;
    } else {
      choices.push(quiz.incorrectAnswers[ord]);
    }
  }
  return [choices, answerIdx];
};
