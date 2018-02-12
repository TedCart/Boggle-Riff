'use strict'

const store = require('../store')
const getFormFields = require(`../../../lib/get-form-fields`)

const api = require('./api')
const ui = require('./ui')
// const events = require('./events')
const scores = require('./scores')
const page = require('./page')

const apiLogin = require('../login/api')
const uiLogin = require('../login/ui')

function inputWord (event) {
  event.preventDefault()
  if (store.timeLeft > 0) {
    const data = getFormFields(this)
    const newWord = data.playerWord.toUpperCase()
    if ((store.wordList.indexOf(newWord) !== -1) &&
    (store.playerWords.indexOf(newWord) === -1)) {
      store.playerWords.push(newWord)
      store.playerWordCoordinates.push(store.wordListCoordinates[store.wordList.indexOf(newWord)])
      const beforeCount = document.getElementById('player-word-list').getElementsByTagName('li').length
      addPlayerWordToList(newWord)
      const afterCount = document.getElementById('player-word-list').getElementsByTagName('li').length
      if (beforeCount === afterCount) {
        playerWordListRebuild()
      }
    }
    $('#player-word-input').val('')
  }
}

function playerWordListRebuild () {
  const parent = $('#player-words')
  const child = $('#player-word-list')
  parent.remove(child)
  const newChild = document.createElement('ul')
  newChild.setAttribute('id', 'player-word-list')
  for (let i = 0; i < store.playerWords.length; i++) {
    const x = (store.playerWords.length - (i + 1))
    const newWordElement = document.createElement('li')
    newWordElement.innerText = store.playerWords[x]
    newWordElement.setAttribute('data-squares', store.wordListCoordinates[store.wordList.indexOf(store.playerWords[x])].toString())
    newWordElement.classList.add('word-list-item')
    child.appendChild(newWordElement)
  }
  parent.appendChild(newChild)
  parent.getElementsByTagName('li')[0].click()
}

function addPlayerWordToList (newWord) {
  const newItem = document.createElement('li')
  newItem.setAttribute('data-squares', store.wordListCoordinates[store.wordList.indexOf(newWord)].toString())
  newItem.classList.add('word-list-item')
  newItem.innerText = newWord
  const listParent = document.getElementById('player-word-list')
  // if (store.playerWords.length > 1) {
  const goBeforeMe = listParent.getElementsByTagName('li')[0]
  // console.log('About to add word to player list...')
  const beforeCount = document.getElementById('player-word-list').getElementsByTagName('li').length
  listParent.insertBefore(newItem, goBeforeMe)
  const afterCount = document.getElementById('player-word-list').getElementsByTagName('li').length
  if (beforeCount === afterCount) {
    if (listParent.getElementsByTagName('li')[0]) {
      listParent.getElementsByTagName('li')[0].click()
    }
  } else {
    listParent.appendChild(newItem)
    if (listParent.lastChild) { listParent.lastChild.click()   }
  }
  // animate the new word (if it appeared like it's supposed to)

  // console.log('Added word to player list!!')
  // } else {
  // listParent.appendChild(newItem)
  // }
  page.moveFooter()
}

function resetTimer () {
  store.timerCheck = ''
  store.timeLeft = 0
}

function QuitEarly () {
  resetTimer()
  store.timerEndPoint = new Date().getTime()
  endGame()
}

function SignOutQuit () {
  store.skipScore = true
  resetTimer()
  endGame()
  apiLogin.signOut()
    .then(uiLogin.signOutSuccess)
    .catch(uiLogin.signOutFailure)
}

function endGame () {
  store.game.game_over = true
  // console.log('game_over should be true now')
  // console.log('store.game.game_over: ', store.game.game_over)
  // console.log('store.game: ', store.game)
  page.deadGame()
  localStorage.setItem('savedGame', JSON.stringify(store.game))
  // console.log('attempted overwrite of local storage game')
  if ((store.game) && (store.user) && (store.playerWords) &&
    (!store.loadedDeadGame)) {
    pushWordsToAPI()
    const NewGameData = {
      game: {
        game_over: true
      }
    }
    if (!store.reviewMode) {
      api.updateGame(NewGameData)
        .then(ui.newGameSuccess)
        .catch(ui.newGameFailure)
      $('#offline-message-box').html('')
    }
  }
  // document.getElementById('in-game-buttons').style.display = 'none'
  if ((store.game) && (store.user)) {
    store.reviewMode ? $('#timer-div').html('Review Mode') : $('#timer-div').html("Time's up!")
  }
  scores.scorePresentation()
  store.timerCheck = ''
  printOpponentsWords()
}

function printWordsToPage () {
  // console.log(availableWords)
  const listElement = document.createElement('dl')
  listElement.classList.add('complete-word-list')
  listElement.classList.add('dl-horizontal')
  const headRowHeader1 = document.createElement('dt')
  headRowHeader1.innerText = 'Word'
  headRowHeader1.setAttribute('style', 'text-align: left; width: 100px;')
  const headRowHeader2 = document.createElement('dd')
  headRowHeader2.innerText = 'Difficulty'
  headRowHeader2.setAttribute('style', 'text-align: left; width: 20px; padding: 0;')
  listElement.appendChild(headRowHeader1)
  listElement.appendChild(headRowHeader2)
  for (let i = 0; i < store.wordList.length; i++) {
    const newItem = document.createElement('dt')
    newItem.setAttribute('data-squares', store.wordListCoordinates[i].toString())
    newItem.setAttribute('style', 'text-align: left; width: 100px;')
    newItem.classList.add('word-list-item')
    newItem.innerText = store.wordList[i]
    const newItem2 = document.createElement('dd')
    newItem2.innerText = store.wordListDifficulty[i]
    newItem2.setAttribute('style', 'text-align: left; width: 20px; padding: 0;')
    listElement.appendChild(newItem)
    listElement.appendChild(newItem2)
  }
  page.addWordDivs()
  document.getElementById('wordList').innerHTML = ''
  document.getElementById('wordList').appendChild(listElement)
  document.getElementById('wordList').style.outline = '1px solid black'
  if (store.user) {
    // api.getAllWords()
    //   .then(ui.getAllWordsSuccess)
    //   .catch(ui.getAllWordsFailure)
  }
  page.moveFooter()
  if (!store.game.game_over) {
    document.getElementById('player-word-input').focus()
  }
  // tableConsoleWordList()
}

function printOpponentsWords () {
  if ((store.CPUplayer) && (!store.reviewMode)) {
    const titleElement = document.createElement('p')
    titleElement.innerText = "CPU's List"
    const listElement = document.createElement('table')
    // listElement.classList.add('complete-word-list')
    listElement.setAttribute('style', 'padding:0; margin:0;')
    // listElement.classList.add('dl-horizontal')
    listElement.innerHTML = '<tr style="padding:0;"><th style="padding:0;">Word</th><th style="padding:0;">Points</th></tr>'
    for (let i = 0; i < store.opponentWords.length; i++) {
      const word = store.opponentWords[i]
      if (word) {
        const newItem = '<tr><td class="word-list-item" data-squares="' + store.opponentWordCoordinates[i].toString() + '">' + word + '</td><td>' + store.scoreCard[word.length] + '</td></tr>'
        listElement.innerHTML = listElement.innerHTML + newItem
      }
    }
    document.getElementById('opponentList').innerHTML = ''
    document.getElementById('opponentList').appendChild(titleElement)
    document.getElementById('opponentList').appendChild(listElement)
    // if (store.user) {
    //   api.getAllWords()
    //     .then(ui.getAllWordsSuccess)
    //     .catch(ui.getAllWordsFailure)
    page.moveFooter()
  }
  // tableConsoleWordList()
}

function WordDetail (word, difficulty, points) {
  this.word = word
  this.difficulty = difficulty
  this.points = points
}

function tableConsoleWordList () {
  const xTable = {}
  let xCounter = 0
  console.log(`Details regarding this board's word list:`)
  for (let i = 0; i < store.wordList.length; i++) {
    const word = store.wordList[i]
    const difficulty = store.wordListDifficulty[i]
    const points = store.scoreCard[word.length]
    xTable[i] = new WordDetail(word, difficulty, points)
    xCounter++
  }
  console.log('Number of words in list:', xCounter)
  console.table(xTable)
  // console.log(dictionaryObject['LI'].indexOf('LIT'))
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

module.exports = {
  inputWord,
  addPlayerWordToList,
  endGame,
  QuitEarly,
  SignOutQuit,
  printWordsToPage,
  printOpponentsWords
}
