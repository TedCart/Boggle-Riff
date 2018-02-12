'use strict'

const store = require('../store')

const wordListTemplate = require('../templates/vs-mode.handlebars')
const directionsTemplate = require('../templates/directions.handlebars')
const miniDirectionsTemplate = require('../templates/mini-directions.handlebars')

const listToClear = [
  '#player-word-list',
  '#scored-table',
  '#wordList',
  '#opponentList',
  '#game-board',
  '#gameList'
]

const gameObjectIds = [
  '#player-word-input',
  '#player-word-form',
  '#in-game-buttons',
  '#quit-early',
  '#getWordsButton',
  '#primary-game-nav',
  '#secondary-game-nav',
  '#main-game-container',
  '#oldGames'
]

const noGameIds = [
  '#primary-game-nav',
  '#secondary-game-nav',
  '#main-game-container',
  '#in-game-buttons',
  '#oldGames'
]

const liveGameIds = [
  '#player-word-input',
  '#player-word-form',
  '#in-game-buttons',
  '#quit-early',
  '#getWordsButton',
  '#main-game-container'
]

const deadGameIds = [
  '#in-game-buttons',
  '#getWordsButton',
  '#primary-game-nav',
  '#secondary-game-nav',
  '#main-game-container',
  '#oldGames'
]

const signedOutIds = []

function moveFooter () {
  const bodyRect = document.getElementsByTagName('main')[0].getBoundingClientRect()
  const footerRect = document.getElementById('footer-div').getBoundingClientRect()
  if ($(window).height() > (bodyRect['height'] + footerRect['height'])) {
    $('#footer-div').addClass('fix-to-bottom')
  } else {
    $('#footer-div').removeClass('fix-to-bottom')
  }
  // console.log('moved footer')
  // console.log('body height: ', bodyRect['height'])
  // console.log('window height: ', $(window).height())
}

function toggleGameButtons (showArray) {
  for (let i = 0; i < gameObjectIds.length; i++) {
    // if current ID is NOT in the show array, hide it.
    // console.log('Toggling Button:', gameObjectIds[i])
    if (showArray.indexOf(gameObjectIds[i]) === -1) {
      $(gameObjectIds[i]).hide()
    } else {
      // otherwise, show it.
      $(gameObjectIds[i]).show()
    }
  }
}

let councount = 0
function clearLists () {
  for (let i = 0; i < listToClear.length; i++) {
    $(listToClear[i]).html('')
  }
  councount++
  // if (councount === 3) { debugger }
  // console.log('cleared lists')
}

function clearAreaRightOfBoard () {
  while (document.getElementById('main-game-container').children[2]) {
    document.getElementById('main-game-container').removeChild(document.getElementById('main-game-container').lastChild)
  }
}

function addWordDivs () {
  if (!document.getElementById('wordList')) {
    clearAreaRightOfBoard()
    $('#main-game-container').append(wordListTemplate)
  }
}

function addDirections () {
  if (!document.getElementById('directions')) {
    clearAreaRightOfBoard()
    $('#main-game-container').append(directionsTemplate)
  }
}

function addMiniDirections (object) {
  const specialDirections = miniDirectionsTemplate(object)
  $('#opponentList').append(specialDirections)
}

function noGame () {
  toggleGameButtons(noGameIds)
  if (!store.loadedOldGame) { clearLists() }
  if (!store.newBoard) { addDirections(); moveFooter() }
}
function liveGame () { toggleGameButtons(liveGameIds) }
function deadGame () { toggleGameButtons(deadGameIds) }
function signedOut () { toggleGameButtons(signedOutIds); clearLists() }

module.exports = {
  moveFooter,
  noGame,
  liveGame,
  deadGame,
  signedOut,
  clearLists,
  clearAreaRightOfBoard,
  addWordDivs,
  addDirections,
  addMiniDirections
}
