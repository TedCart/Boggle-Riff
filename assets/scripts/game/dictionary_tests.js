'use strict'

const dictionaryFile = require('./sensibleDictionary')
const dictionaryObject = dictionaryFile

const testThing = function () {
  const xTable = {}
  let xCounter = 0
  console.log(`Details regarding this page's dictionary:`)
  for (const key in dictionaryObject) {
    const curDict = dictionaryObject[key]
    const numberWords = curDict.length
    const numberLetters = curDict.toString().length
    const lastWord = curDict[curDict.length - 1]
    const indexOfLastWord = curDict.toString().indexOf(lastWord)
    xTable[key] = new DictionaryDetail(numberWords, numberLetters, lastWord, indexOfLastWord)
    xCounter++
  }
  console.log('Number of subdivisions in dictionary:', xCounter)
  console.table(xTable)
}

function DictionaryDetail (numberWords, numberLetters, lastWord, indexOfLastWord) {
  this.numberWords = numberWords
  this.numberLetters = numberLetters
  this.lastWord = lastWord
  this.indexOfLastWord = indexOfLastWord
}

// On document ready
function AddHandlers () {
  $('#testSomething').on('click', testThing)
}

module.exports = {
  AddHandlers
}