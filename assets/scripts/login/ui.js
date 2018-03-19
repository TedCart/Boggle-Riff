'use strict'

const store = require('../store')
const page = require('../game/page')
// const api = require('./api')

// const gameApi = require('../game/api')

const clearFields = function () {
  $('input:text, input:password').val('')
}

const toggleSignInButtons = function () {
  // console.log(store.user)
  if (store.user) {
    $('#sign-in-form').hide()
    $('#createAccountButton').hide()
    $('#changePasswordButton').show()
    $('#sign-out').show()
    $('#main-game-container').show()
    if (store.game) {
      if (store.game.game_over !== false) { page.noGame() }
    } else {
      page.noGame()
    }
  } else {
    $('#sign-in-form').show()
    $('#createAccountButton').show()
    $('#changePasswordButton').hide()
    $('#sign-out').hide()
    page.signedOut()
  }
}

const signUpSuccess = function (data) {
  // console.log(data)
  $('#timer-div').html('Make a new board to play!')
  const placeholderHTML = document.getElementById('create-account-message-box').innerHTML
  $('#create-account-message-box').html('<p>Account Created! Signing in...</p>')
  setTimeout(() => {
    document.getElementById('close-create-account-button').click()
    $('#create-account-message-box').html(placeholderHTML)
  }, 900)
  // console.log(data)
  // $('#message-box').text('Successfully created account!')
  clearFields()
  toggleSignInButtons()
  // $('#timer-div').html('Make a new board to play!')
}

const signUpFailure = function (error) {
  console.error(error)
  const placeholderHTML = document.getElementById('create-account-message-box').innerHTML
  $('#create-account-message-box').html('<p>Account Creation failed.</p>' + placeholderHTML)
  // $('#timer-div').text('FAIL. Check your info.')
  clearFields()
}

const signInSuccess = function (data) {
  // console.log(data)
  store.user = data.user
  // $('#message-box').text('Successfully signed in!')
  store.name = store.user.email
  $('#timer-div').html(`Welcome, ${store.name}!<br>Make a new board to play!`)
  // console.log('store.user: ', store.user)
  clearFields()
  toggleSignInButtons()
  localStorage.setItem('savedUser', JSON.stringify(store.user))
  // fetchPlayerProfile()
  // gameEvents.resetBoard()
}

const signInFailure = function (error) {
  console.error(error)
  $('#timer-div').text('Sign-in failed. Check your info.')
  clearFields()
}

const changePasswordSuccess = function (data) {
  // console.log(data)
  $('#change-password-status-message').text('Password updated.')
  clearFields()
  toggleSignInButtons()
}

const changePasswordFailure = function (error) {
  console.error(error)
  $('#change-password-status-message').text('Password change failed.')
  clearFields()
  toggleSignInButtons()
}

const signOutSuccess = function (data) {
  // console.log(data)
  store.user = ''
  store.game = ''
  store.newBoard = ''
  $('#timer-div').text(`You signed out!`)
  page.clearLists()
  localStorage.clear()
  clearFields()
  toggleSignInButtons()
  document.getElementById('sign-in-email').focus()
  page.moveFooter()
  // gameEvents.resetBoard()
}

const signOutFailure = function (error) {
  console.error(error)
  signOutSuccess()
  clearFields()
}

module.exports = {
  signUpSuccess,
  signUpFailure,
  signInSuccess,
  signInFailure,
  changePasswordSuccess,
  changePasswordFailure,
  signOutSuccess,
  signOutFailure,
  toggleSignInButtons
  // fetchPlayerProfile
}
