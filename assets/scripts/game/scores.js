'use strict'

const store = require('../store')

const scoreList16 = {
  3: 1,
  4: 1,
  5: 2,
  6: 3,
  7: 5,
  8: 11,
  9: 11,
  10: 11,
  11: 11,
  12: 11,
  13: 11,
  14: 11,
  15: 11,
  16: 11,
  17: 11
}

const scoreList25 = {
  3: 0,
  4: 1,
  5: 2,
  6: 3,
  7: 5,
  8: 11,
  9: 11,
  10: 11,
  11: 11,
  12: 11,
  13: 11,
  14: 11,
  15: 11,
  16: 11,
  17: 11,
  18: 11,
  19: 11,
  20: 11,
  21: 11,
  22: 11,
  23: 11,
  24: 11,
  25: 11,
  26: 11
}

const scoreList36 = {
  3: 0,
  4: 1,
  5: 2,
  6: 3,
  7: 5,
  8: 11,
  9: 13,
  10: 15,
  11: 17,
  12: 19,
  13: 21,
  14: 23,
  15: 25,
  16: 27,
  17: 29,
  18: 31,
  19: 33,
  20: 35,
  21: 37,
  22: 39,
  23: 41,
  24: 43,
  25: 45,
  26: 47,
  27: 49,
  28: 51,
  29: 53,
  30: 55,
  31: 57,
  32: 59,
  33: 61,
  34: 63,
  35: 65,
  36: 67
}

const scoreGame = function () {
  let score = 0
  for (let i = 0; i < store.playerWords.length; i++) {
    const word = store.playerWords[i]
    if (word) {
      score += store.scoreCard[word.length]
    }
  }
  // add API push score somewhere
  return score
}

function scoreOpponent () {
  let score = 0
  for (let i = 0; i < store.opponentWords.length; i++) {
    const word = store.opponentWords[i]
    if (word) {
      score += store.scoreCard[word.length]
    }
  }
  // add API push score somewhere
  return score
}

const scorePresentation = function () {
  if ((store.game) && (!store.skipScore)) {
    let i = 0
    const iAmParent = document.getElementById('scored-table')
    iAmParent.innerHTML = '<tr><th>Word</th><th>Points</th></tr>'
    const removeMyLastChild = document.getElementById('player-word-list')
    const x = setInterval(function () {
      if (store.playerWords) {
        // remove word from original list
        if (removeMyLastChild.lastChild) {
          removeMyLastChild.removeChild(removeMyLastChild.lastChild)
        }

        // add word and its score to a description list
        const word = store.playerWords[i]
        if (word) {
          const newItem = '<tr><td class="word-list-item" data-squares="' + store.playerWordCoordinates[i].toString() + '">' + word + '</td><td>' + store.scoreCard[word.length] + '</td></tr>'
          iAmParent.innerHTML = iAmParent.innerHTML + newItem
        }
        i++
        if (i >= store.playerWords.length) {
          clearInterval(x)

          $('#timer-div').html('<div>You Got: ' + scoreGame() + '</div>' + (store.CPUplayer ? '<div>They Got: ' + scoreOpponent() + '</div>' : ''))
          // console.log('store.CPUplayer (after scoring):', store.CPUplayer)
          // console.log(typeof store.CPUplayer)
        }
      } else {
        clearInterval(x)
      }
    }, 200)
  }
}

module.exports = {
  scoreList16,
  scoreList25,
  scoreList36,
  scoreGame,
  scoreOpponent,
  scorePresentation
}
