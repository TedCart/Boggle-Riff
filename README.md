## Boggle Experiment

Challenged myself to build a boggle board and have it "solve" itself and be playable.

## The Board

All boards in this page are possible in the official boggle game. It's not just picking 16 random letters - it's picking a random boggle die (that hasn't been used yet) and picking a random side of that die.

## The "Game Logic"

I wrote a script that iterates through all possible combinations of letters on the board. If a combination is nowhere in the dictionary (like "XSFM" or something like that) the script will stop going down that path. If a combination IS in the dictionary, it adds it to a word list which is ultimately available for the player.

## The Word List

Source: http://www.luke-g.com/boggle/#thedict

The dictionary was the trickiest thing here. It used to slow the entire application constantly. No more!

I removed all the white space from the dictionary file and made it an object full of shorter arrays (instead of one long array, which wasn't playing nice with javascript's indexOf() function). Then I made the game logic check against the appropriate sub-dictionary instead of the entire dictionary and Violå! The dictionary worked!

## Other Dictionaries...

Source Host: http://www.mieliestronk.com/wordlist.html

Source: http://www.mieliestronk.com/corncob_caps.txt

I considered a more slim dictionary but it was missing certain words (like all profanity), so I ended up not using it for the player. Players enjoy finding naughty words, so the inclusion of that sort of thing was important to me.

## Computer Opponent

The CPU opponent, however, **does** use the smaller dictionary. The CPU opponent uses a basic ranking system on all available words in a board to assign them a difficulty. (The system is based on the length of the word, the number of turns in that word, whether there are more than three quarters vowels in the word, whether the word reads more left-to-right or right-to-left, etc.) Then whe the game is over, it returns all the words with a difficulty lower than the difficulty level of the CPU. As of right now, the difficulty cannot be changed by the user.

## Wireframes and Uer-Stories available [Here](https://git.generalassemb.ly/TedCart/full-stack-project-practice/blob/response/practice.md)

## Technologies Used

  - Bootstrap
  - HTML
  - SASS
  - Javascript
  - AJAX
  - Handlebars
  - Organic Fish Oil

  ## Links

  Live link to deployed back-end: https://salty-sierra-37921.herokuapp.com/

  Live link to deployed front-end: https://tedcart.github.io/Boggle-Riff

  Link to GitHub repo for back-end: https://github.com/TedCart/BigBadProjectTwo

  Link to GitHub repo for front-end: https://github.com/TedCart/Boggle-Riff
