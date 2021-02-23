/******************************************************************************
 *  Slash Commands Project!
 * 
 *  A Google Chat bot script used bring back the power of slash commands.
 * 
 *
 *  Created by: E.Cope                                  (Last edit: 2/23/21)
 *******************************************************************************/


// Handle a GET request:
const doGet = () => HtmlService.createHtmlOutputFromFile('index')


/**
 * Retreives just the first name of the user sending a chat's message.
 * @param {object} event The event object from Hangouts Chat.
 * @return {string} The first name from the user's chat display name.
 */
const _getFirstName = (event) => {
  // Grab the display name:
  const displayName = event.user.displayName
  // Split the name at the space and store as an array:
  const splitNames = displayName.split(" ", 2)
  // Return just the first name:
  return splitNames[0]
}


/**
 * Returns a random element from an array.
 * @param {array} choices An array holding the possible choices to return.
 * @return {any} An array element from choices.
 */
const choose = (choices) => {
  const index = Math.floor(Math.random() * choices.length)
  return choices[index]
}


/**
 * Generates a random integer between min and max.
 * @param {integer} min The minimum included in the range.
 * @param {integer} max The maximum excluded from the range.
 * @return {integer} The number on a roll, or series of rolls.
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  // The maximum is exclusive and the minimum is inclusive:
  return Math.floor(Math.random() * (max - min) + min) 
}


/**
 * An advanced version of the fetch function that allows for the request header
 * to be specified.
 * @param {string} url The URL endpoint to forward the request to.
 * @param {object} request_header The option to include a custom request header.
 * @return {object} A JSON response.
 */
const fetchAdvanced = (url, request_header) => {
  const res = UrlFetchApp.fetch(url, request_header)
  return JSON.parse(res.getContentText())
}


/**
 * An attempt to streamline the fetch method a little. 
 * @param {string} url The URL endpoint to forward the request to.
 * @param {string='get'} request The request method.
 * @param {string='application/json'} content_type The content type of the data
 *     being posted or retreived.
 * @return {object} A JSON response.
 */
const fetch = (url, request='get', content_type='application/json') => {
  // Default Request Options:
  const opts = { 'method': request,
                 'contentType': content_type }

  return fetchAdvanced(url, opts)
}


/**
 * Creates a Chat's message card for the header.
 * @param {string=} imgUrl An image link for the image to display.
 * @param {string} link The URL link that gets launched when the image is clicked.
 * @return {object} A chat bot card response message.
 */
const createHeaderCard = (headerTitle='Boop Bop Bot',
                          headerSubtitle='beep booboo bop',
                          headerImgUrl="https://media2.giphy.com/media/hrd5ikSf6NBpsSjEj4/source.gif") => {
        
  const card = {"cards": [
                      { 
                        "header": {
                          "title": headerTitle,
                          "subtitle": headerSubtitle,
                          "imageUrl": headerImgUrl
                        } 
                      }
                    ]
                  }
  return card
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
                       headerImgUrl="https://media2.giphy.com/media/hrd5ikSf6NBpsSjEj4/source.gif") => {

  const card = {"cards": [
                      { 
                        "header": {
                          "title": `<u><b>${headerTitle}</b></u>`,
                          "subtitle": headerSubtitle,
                          "imageUrl": headerImgUrl
                        },
                        "sections": [
                          {
                            "widgets": [
                              {
                                "image": {
                                  "imageUrl": imgUrl,
                                  "onClick": {
                                    "openLink": {
                                      "url": link
                                    }
                                  }
                                }
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
  return card
}


/** ============================================================================ *
    == == == == == == == == == == PROPERTY STORAGE == == == == == == == == == ==
 ** ============================================================================ */

// A Safe Place to Store Our API Keys:
const PROPS = PropertiesService.getUserProperties()

const setProps = () => {
  PROPS.setProperty('NASA', "15l7EGMIrAE9NSOQPo0ZVHiVvTa9fWC1Z3IXBp31") // DONE
}

// TODO: Use Props here...
const NASA_API_KEY = PROPS.getProperty('NASA')


/** ============================================================================ *
    == == == == == == == == == == MY API FUNCTIONS == == == == == == == == == ==
 ** ============================================================================ */

/**
 * Returns API response for the XKCD Comic of the day.
 * @return {string} The API response.
 * @link https://xkcd.com/json.html
 */
const getXkcdComic = () => fetch('https://xkcd.com/info.0.json')


/**
 * Returns API response for NASA's Astronomy Picture of the Day.
 * @return {string} The API response.
 * @link https://api.nasa.gov/
 */
const getAPOD = () => fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&thumbs=True`)


/**
 * Returns the response from the Dog API.
 * @return {string} The API response.
 * @link https://dog.ceo/dog-api/
 */
const getDog = () => fetch("https://dog.ceo/api/breeds/image/random")


/**
 * Generates a random number to simulate a dice roll. The 'roll' slash command also accepts
 * additional arguments: number of dice and type of die. (i.e. /roll 2d3)
 * @param {object} event The Google Chat event object.
 * @return {string} A response with the total of the roll, and if multiple rows a list of
 *     each result.
 */
const rollDice = (event) => {

  const firstName = _getFirstName(event)
  let roll = 0
  let result = null

  // Grab any arguments and remove whitespace:
  let args = event.message.argumentText.trim()
  // Look for 'd':
  const argsList = args.split('')

  // [CASE] Argument provided:
  if (args) {
    // [CASE] Contains 'd':
    if (argsList.includes('d')) {
      const sp = args.split('d')
      const [numOf, numSides]= [parseInt(sp[0]), parseInt(sp[1])]

      let total = 0
      let rollList = []

      for (i = 0; i < numOf; i++) {
        roll = getRandomInt(1, numSides+1)
        total += roll
        rollList.push(roll)
      }

      result = `${firstName} rolled: [${rollList.toString()}]\n` +
                `Total: ${total}`
    }
    // [CASE] No 'd':
    else {
      result = `Sorry, I don't recognize that. Try something like: '/roll 3d10' to roll three 10-sided dice.`
    }
  }
  // [CASE] No Arguments --> Default to 6 sided:
  else {
    roll = getRandomInt(1, 7)
    result = `${firstName} rolled a ${roll}`
  }

  return result
}


/**
// TESTS:

const test = () => {
  const fakeEvent = {
      "message": {
        'text': 'nothing',
        'argumentText': ' 56'
      }
  }
  const roll = rollDice(fakeEvent)
  Logger.log(roll)
}
*/


/** ============================================================================ *
    == == == == == == == == GOOGLE CHAT BOT EVENT LISTENERS == == == == == == ==
 ** ============================================================================ */

/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 * @param {Object} event the event object from Hangouts Chat.
 */
const onAddToSpace = (event) => {
  return { 'text': "Slash Commands Have Been Activated!" }
}


/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 * @param {Object} e The event object from Hangouts Chat.
 */
const onRemoveFromSpace = (event) => {
  const name = (event.space.name ? event.space.name : "the chat.")
  console.info("Slash Commands removed from ", name)
}


/**
 * Responds to a MESSAGE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
const onMessage = (event) => {

  const slashy = event.message.slashCommand
  let response = Object()

  // [CASE] Is A Slash Command:
  if (slashy) {
    switch (slashy.commandId) {

      // Astronomy Picture of the Day (/APOD [id:3])
      case 3:
        apod = getAPOD()
        title = "Astronomy Picture of the Day"
        subtitle = apod.title
        hdImage = apod.hdurl
        thumbnail = apod.thumbnail_url
        icon = "https://cdn.alzashop.com/ImgW.ashx?fd=f3&cd=GMERCHb905g"
        link = apod.url

        // [CASE] Media Type is a Video:
        if (apod.media_type === 'video') {
          response = createImgCard(thumbnail, link, title, subtitle, icon)    
        }
        // [CASE] Media Type is Image:
        else {
          response = createImgCard(hdImage, link, title, subtitle, icon)
        }
        break


      // XKCD COMICS API: (/xkcd [id:5])
      case 5:
        xkcd = getXkcdComic()
        link = "https://xkcd.com/"
        title = "XKCD Comic of the Day"
        subtitle = xkcd.safe_title
        icon = "http://www.userlogos.org/files/logos/signify/xkcd.png"
        image = xkcd.img

        // Form response card:
        response = createImgCard(image, link, title, subtitle, icon)
        break
      

      // ROLL DA DICE: (/roll [id:6])
      case 6:
        // CURRENTLY BROKEN!!!
        response['text'] = rollDice(event)
        break


      // DOG API (/doggo [id:7])
      case 7:
        dog = getDog()
        img = dog.message
        title = "🌭 The Dog Generator! 🐶"
        icon = "https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/3fb6a75c11d342c9c124a73d6c6e1a58"
        // Grab the breed name from the response URL.
        urlList = img.split('/')
        getBreed = urlList[4]
        subtitle = `Featuring the breed:  ${getBreed}`

        // Form response card:
        response = createImgCard(img, img, title, subtitle, icon)
        break


      // URL SHORTENER (/shorty [id:8])
      case 8:
        response['text'] = "⚙️ Coming Soon! 🚧"
        break


      // WORDS API (/wordy [id:10])
      case 10:
        response['text'] = "⚙️ Coming Soon! 🚧"
        break


      // JOKE API (/jokester [id:11])
      case 11:
        response['text'] = "⚙️ Coming Soon! 🚧"
        break


      // DATAMOCKR API (/mock-it-up [id:17])
      case 17:
        response['text'] = "⚙️ Coming Soon! 🚧"
        break


      // GENIUS API (/genius-lyrics [id:21])
      case 21:
        response['text'] = "⚙️ Coming Soon! 🚧"
        break

      
      // IF ALL ELSE FAILS!
      default:
        response['text'] = "Sorry, that's not a supported slash command."
        break
    }
  }

  // [CASE] Not a Slash Command --> Generate Random Reply:
  else {
    const sayings = ["Chill bro, chill 🧊",
                     "Look at you, doin' things 👀",
                     "DON'T TOUCH! NOT READY YET! 🛑",
                     "6 FEET! 6 FEET! 🦠",
                     "🌌",
                     "💤"
                    ]
    response['text'] = choose(sayings)
  }

  // Return the response object to the chat.
  return response
}


