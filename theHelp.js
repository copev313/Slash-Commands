/** ============================================================================ *
    == == == == == == == == == == HELPER FUNCTIONS == == == == == == == == == ==
 ** ============================================================================ */


/**
 * Retreives just the first name of the user sending a chat's message.
 * @param {object} event The event object from Hangouts Chat.
 * @return {string} The first name from the user's chat display name.
 */
const _getFirstName = (event) => event.user.displayName.split(' ', 2)[0]


/**
  * Returns a random element from an array.
  * @param {array} choices An array holding the possible choices to return.
  * @return {any} An array element from choices.
  */
const choose = (choices) => choices[Math.floor(Math.random() * choices.length)]


/**
  * Generates a random integer between min and max.
  * @param {integer} min The minimum included in the range.
  * @param {integer} max The maximum excluded from the range.
  * @return {integer} The number on a roll, or series of rolls.
  */
const getRandomInt = (min, max) => {
  // Round up/down:
  mini = Math.ceil(min)
  maxi = Math.floor(max)
  // The maximum is exclusive and the minimum is inclusive:
  return Math.floor(Math.random() * (maxi - mini) + mini)
}

/**
  * Returns a string in titleCase.
  * @param {string} str The string to format to titleCase.
  * @return {string} The sentence in titleCase.
  */
const toTitleCase = (str) => {
  if((str===null) || (str==='')) {
      return false
  }
  else {
    str = str.toString()
  }

  return str.replace(/\w\S*/g, (x) => x.charAt(0).toUpperCase() + x.substr(1).toLowerCase())
}


/**
  * Creates a Chat's message card with a clickable image widget.
  * @param {string=} imgUrl An image link for the image to display.
  * @param {string} link The URL link that gets launched when the image is clicked.
  * @return {object} A chat bot card response message.
  */
const createImgCard = (imgUrl="https://example.com/kitten.png",
                       link="https://example.com/",
                       headerTitle='Boop Bop Bot',
                       headerSubtitle='beep booboo bop',
                       headerImgUrl="") => {

  const card = { "cards": [
                  {
                    "header": {
                      "title": `<u><b>${headerTitle}</b></u>`,
                      "subtitle": headerSubtitle,
                      "imageUrl": headerImgUrl
                    },
                      "sections": [
                        {
                          "widgets": [{
                            "image": {
                              "imageUrl": imgUrl,
                              "onClick": {
                                "openLink": {
                                  "url": link
                                }
                              }
                            }
                          }]
                        }
                      ]
                  }
                ]
  }
  return card
}


/**
  * Generates a random number to simulate a dice roll. The 'roll' slash command also accepts
  * additional arguments: number of dice and type of die. (i.e. /roll 2d3)
  * @param {object} event The Google Chat event object.
  * @return {string} A response with the total of the roll, and if multiple rows a list of
  *     each result.
  */
const rollDice = (event) => {
  // The string we'll return:
  let result = ""
  // Grab sender's first name for return message:
  const firstName = _getFirstName(event)
  // Boolean of whether the event object has the 'argumentText' property:
  const hasArgs = event.hasOwnProperty('argumentText')

  // [CASE] No Arguments provided --> Create fake one:
    if (!hasArgs) {
      result = `${firstName} rolled a ${getRandomInt(1, 7)}`
    }
  // [CASE] Argument provided:
    else {
      // Remove whitespace from arguments:
      let args = event.message.argumentText.trim()
    
      // Split at every character to look for 'd'
      // [CASE] Contains 'd':
      if (args.split('').includes('d')) {
      let numOf = 0, numSides = 0, sum = 0, rollsList = Array()
      let splitAtD = args.split('d')
      numOf = parseInt(splitAtD[0])
      numSides = parseInt(splitAtD[1])
    
      // Roll all those dice!
      for (let i = 0; i < numOf; i++) {
        let rollNum = getRandomInt(1, numSides+1)
        sum += rollNum
        rollsList.push(rollNum)
      }
    
      result = `\`\`\`${firstName} rolled: [${rollsList.toString()}]\n` +
                  `Total: ${sum}\`\`\``
      }
      // [CASE] No 'd' --> Argument text not formatted correctly:
      else {
        result = `Sorry, I don't recognize that. Try '/roll 3d10' to roll three 10-sided dice.`
      }
    }

  return result
}
