'use strict'

const api = require('./api.js')
const ui = require('./ui.js')
const store = require('../store')

const gameBuilder = require('./game_builder.js')
const player = require('./player.js')
const page = require('./page.js')

const onNewGame = function () {
  const NewGameData = {
    game: {
      board_string: store.newBoard.toString(),
      game_over: false
    }
  }
  if (store.user) {
    api.newGame(NewGameData)
      .then(ui.newGameSuccess)
      .catch(ui.newGameFailure)
    store.game = NewGameData.game
    $('#offline-message-box').html('')
  }
  store.game = NewGameData.game
}

const onBeforeUnload = function () {
  // if ((store.game) && (store.timerCheck !== '')) {
  if ((store.game) || (true)) {
    localStorage.setItem('savedGame', JSON.stringify(store.game))
    localStorage.setItem('playerWords', JSON.stringify(store.playerWords))
    localStorage.setItem('playerWordCoordinates', JSON.stringify(store.playerWordCoordinates))
    localStorage.setItem('timerEndPoint', (store.timerEndPoint))
    localStorage.setItem('timerCheck', (store.timerCheck))
    localStorage.setItem('CPUplayer', (store.CPUplayer))
    alert('saving stuff')
  } else {
    localStorage.removeItem('playerWords')
    localStorage.removeItem('playerWordCoordinates')
    localStorage.removeItem('timerEndPoint')
    localStorage.removeItem('timerCheck')
  }
}

function pushWordsToAPI () {
  const data = {
    word: {
      player_id: store.user.id,
      game_id: store.game.id,
      word: store.playerWords.toString()
    }
  }
  // console.log(data)
  // api.uploadWords(data)
  //   .then(ui.wordPushSuccess)
  //   .catch(ui.wordPushFailure)
}

function onGetAllGames () {
  api.getAllGames()
    .then(ui.getAllGamesSuccess)
    .then(page.moveFooter)
    .catch(ui.getAllGamesFailure)
}

function onRemoveGame (event) {
  event.preventDefault()
  const data = event.target
  const gameId = data.parentNode.parentNode.dataset.id
  data.parentNode.parentNode.innerHTML = '<li>Game Deleted!!</li>'
  api.removeGame(gameId)
    .then(ui.removeGameSuccess)
    .catch(ui.removeGameFailure)
}

function rebuildGame (event) {
  event.preventDefault()
  store.reviewMode = true
  const data = event.target
  if (!store.game) { store.game = {} }
  store.game.id = data.parentNode.parentNode.dataset.id
  store.game.board_string = data.parentNode.parentNode.dataset.board_string
  store.game.game_over = true
  store.newBoard = store.game.board_string.split(',')
  store.playerWords = []
  store.playerWordCoordinates = []
  store.CPUplayer = false
  $('#timer-div').html('Review Mode')
  page.clearAreaRightOfBoard()
  gameBuilder.createBoard(null)
}

// On document ready
function AddHandlers () {
  // createBoard16()
  $('#newBoardButtonCPU').on('click', () => { store.CPUplayer = true; gameBuilder.createBoard16() })
  $('#newBoardButtonCPU2').on('click', () => { store.CPUplayer = true; gameBuilder.createBoard25() })
  $('#newBoardButtonCPU3').on('click', () => { store.CPUplayer = true; gameBuilder.createBoard36() })
  $('#newBoardButton').on('click', () => { store.CPUplayer = false; gameBuilder.createBoard16() })
  $('#newBoardButton2').on('click', () => { store.CPUplayer = false; gameBuilder.createBoard25() })
  $('#newBoardButton3').on('click', () => { store.CPUplayer = false; gameBuilder.createBoard36() })
  $('#getWordsButton').on('click', player.printWordsToPage)
  $('#player-word-form').on('submit', player.inputWord)
  $('#quit-early').on('click', player.QuitEarly)
  $('#oldGames').on('click', onGetAllGames)
  $('body').on('click', '.remove-button', onRemoveGame)
  $('body').on('click', '.review-button', rebuildGame)
  $(window).on('beforeunload', onBeforeUnload)
  $(window).on('resize', page.moveFooter)
}

module.exports = {
  AddHandlers,
  pushWordsToAPI,
  onNewGame
}
