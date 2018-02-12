'use strict'

const store = require('../store')

const gameBuilder = require('./game_builder')
const player = require('./player')
const timer = require('./timer')
const page = require('./page')

const refresh = function () {
  store.loadedOldGame = false
  store.loadedDeadGame = false
  // Restores previous session on accidental page refresh
  // console.log('localStorage.getItem(\'savedUser\') :\n', localStorage.getItem('savedUser'))
  if (localStorage.getItem('savedUser')) {
    store.user = JSON.parse(localStorage.getItem('savedUser'))
    // console.log('successfully retrieved user login info')
    $('#timer-div').html(`Welcome Back, ${store.user.email}!`)
    page.noGame()
    // console.log('savedGame : ', localStorage.getItem('savedGame'))
    // console.log(`(localStorage.getItem('savedGame')) !== '""' :`, (localStorage.getItem('savedGame')) !== '""')
    // console.log(`(localStorage.getItem('savedGame')) !== 'undefined' :`, (localStorage.getItem('savedGame')) !== 'undefined')
    if ((localStorage.getItem('savedGame')) &&
        ((localStorage.getItem('savedGame')) !== '""') &&
        ((localStorage.getItem('savedGame')) !== 'undefined')) {
      store.game = JSON.parse(localStorage.getItem('savedGame'))
      // console.log('store.game.board_string: ', store.game.board_string)
      if (store.game.board_string) {
        store.newBoard = store.game.board_string.split(',')
        // console.log('hooray you have a stored game...')
        // console.log('store.game :', store.game)
        try {
          store.timerEndPoint = (localStorage.getItem('timerEndPoint'))
          store.timerCheck = (localStorage.getItem('timerCheck'))
          store.CPUplayer = (localStorage.getItem('CPUplayer'))
          if ((store.CPUplayer === 'undefined') || (store.CPUplayer === 'false')) { store.CPUplayer = false }
          // console.log('store.CPUplayer: ', store.CPUplayer)
          // console.log('timerEndPoint', store.timerEndPoint)
          // console.log('timerCheck', store.timerCheck)
          timer.checkEndTime()
          gameBuilder.createBoard(null)
          store.loadedOldGame = true
          store.loadedDeadGame = store.game.game_over
          if (localStorage.getItem('playerWords') !== 'undefined') {
            // console.log('The player words from last time is NOT undefined - we should have words from before.')
            store.playerWords = JSON.parse(localStorage.getItem('playerWords'))
            store.playerWordCoordinates = JSON.parse(localStorage.getItem('playerWordCoordinates'))
          } else {
            // console.log('The player words from last time is undefined')
            store.playerWords = []
            store.playerWordCoordinates = []
          }
          for (let i = 0; i < store.playerWords.length; i++) {
            player.addPlayerWordToList(store.playerWords[i])
          }
        } catch (e) {
          // console.log('Made it here - failed to load saved game')
          // console.log(e)
        }
      }
    } else {
      // console.log('savedGame is undefined')
    }
    // console.log('store.user:', store.user)
  } else {
    localStorage.clear()
  }
}

module.exports = {
  refresh
}
