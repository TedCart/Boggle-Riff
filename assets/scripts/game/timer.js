'use strict'

const store = require('../store')
const moment = require(`../../../node_modules/moment/moment`)
const numeral = require(`../../../node_modules/numeral/numeral`)

const player = require('./player')

function resetTimer () {
  store.timerCheck = ''
  store.timeLeft = 0
}

function checkEndTime () {
  store.timerEndPoint = parseFloat(store.timerEndPoint)
  if ((store.timerEndPoint)) {
    // console.log('running end time check')
    // console.log('store.timerEndPoint :', store.timerEndPoint)
    const now = new Date().getTime()
    // console.log('now :', now)
    if ((store.timerEndPoint < now) || (store.timerEndPoint === 'undefined') || (isNaN(store.timerEndPoint))) {
      // console.log('now is greater than end point - game should be over')
      store.game.game_over = true
    } else {
      // console.log('now is less than end point - game should resume')
      store.timerCheck = store.timerEndPoint
    }
  }
}

function startCountdown () {
  // Set the end time
  if ((!store.game.game_over) && ((!store.timerCheck) || (store.timerCheck === 'undefined'))) {
    const newDateObj = moment(Date.now()).add((store.secondsInTimer + 2), 's').toDate()
    store.timerEndPoint = new Date(newDateObj).getTime()
    store.timerCheck = store.timerEndPoint
  }
  const endTime = store.timerEndPoint
  // console.log('endTime: ', endTime)
  // console.log('store.timerCheck: ', store.timerCheck)

  // Update the count down every 1 second
  const x = setInterval(function () {
    if (endTime !== store.timerCheck) {
      clearInterval(x)
    }
    // Get todays date and time
    const now = new Date().getTime()

    // Find the distance between now an the count down date
    store.timeLeft = endTime - now

    // Time calculations for days, hours, minutes and seconds
    // const days = Math.floor(store.timeLeft / (1000 * 60 * 60 * 24))
    // const hours = Math.floor((store.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((store.timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((store.timeLeft % (1000 * 60)) / 1000)

    // Display the result in the element with id="demo"
    if ((store.timeLeft >= 0) && (store.user) && (store.timerCheck !== '')) {
      $('#timer-div').html((store.CPUplayer ? 'VS Mode</br>' : 'Single Player Mode</br>') + minutes + ':' + numeral(seconds).format('00'))
    }

    // If the count down is finished, write some text
    if (store.timeLeft < 0) {
      clearInterval(x)
      !!store.reviewMode ? $('#timer-div').html('Review Mode') : $('#timer-div').html("Time's Up!!")
      player.endGame()
      store.timerCheck = ''
    }
  }, 1000)
}

module.exports = {
  resetTimer,
  startCountdown,
  checkEndTime
}
