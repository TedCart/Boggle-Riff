'use strict'

const store = require('../store')

const gameBuilder = require('./game_builder')
const player = require('./player')

const refresh = function () {
  // Restores previous session on accidental page refresh
  if (localStorage.getItem('savedUser')) {
    store.user = JSON.parse(localStorage.getItem('savedUser'))
    $('#timer-div').text('Welcome Back!')
    if (localStorage.getItem('savedGame')) {
      store.game = JSON.parse(localStorage.getItem('savedGame'))
      store.newBoard = store.game.board_string.split(',')
      console.log('hooray you have a stored game...')
      if (localStorage.getItem('playerWords')) {
        try {
          store.playerWords = JSON.parse(localStorage.getItem('playerWords'))
          for (let i = 0; i < store.playerWords.length; i++) {
            player.addPlayerWordToList(store.playerWords[i])
          }
          store.timerEndPoint = JSON.parse(localStorage.getItem('timerEndPoint'))
          store.timerCheck = JSON.parse(localStorage.getItem('timerCheck'))
          gameBuilder.createBoard(null)
        } catch (e) {
          console.log(e)
        }
      }
    } else {
      $('timer-div').text('Welcome Back!')
    }
    // console.log('store.user:', store.user)
  } else {
    localStorage.clear()
  }
}

function moveFooter () {
  const bodyRect = document.getElementsByTagName('main')[0].getBoundingClientRect()
  const footerRect = document.getElementById('footer-div').getBoundingClientRect()
  if ($(window).height() > (bodyRect['height'] + footerRect['height'])) {
    $('#footer-div').addClass('fix-to-bottom')
  } else {
    $('#footer-div').removeClass('fix-to-bottom')
  }
}

module.exports = {
  refresh,
  moveFooter
}