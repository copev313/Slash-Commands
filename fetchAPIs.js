/** ============================================================================ *
    == == == == == == == == == == MY API FUNCTIONS == == == == == == == == == ==
 ** ============================================================================ */


/** = == = == = == = == = == = == PROPERTY STORAGE == = == = == = == = == = == = */

// A Safe Place to Store Our Sensitive Information:
const PROPS = PropertiesService.getScriptProperties()

const setProp = () => {
  PROPS.setProperty('', "")
  Logger.log(PROPS.getKeys())
}

// Retreive our stored props here:
const NASA_API_KEY = PROPS.getProperty('NASA')
const CUTTLY_API_KEY = PROPS.getProperty('CUTTLY')


/** = == = == = == = == = == = == = == FETCH == = == = == = == = == = == = == = == */

/**
 * Executes our requests to APIs.
 * @param {string} url The URL endpoint to forward the request to.
 * @return {object} A JSON response.
 */
const fetch = (url, reqHeader={'method': 'get', 'contentType': 'application/json'}) => {
  const resContent = UrlFetchApp.fetch(url, reqHeader).getContentText()
  return JSON.parse(resContent)
}


/** = == = == = == = == = == = == VARIOUS GET REQUESTS == = == = == = == = == = == = */

/**
 * Returns API response for the XKCD Comic of the day.
 * @return {string} The API response.
 * @link https://xkcd.com/json.html
 */
const getXkcdComic = () => fetch('https://xkcd.com/info.0.json')


/**
 * Returns the response from the Dog API.
 * @return {string} The API response.
 * @link https://dog.ceo/dog-api/
 */
const getDog = () => fetch("https://dog.ceo/api/breeds/image/random")


/**
 * Generates a joke from a Joke API.
 * @return {object} The JSON response.
 */
const getJoke = () => {
  const blackFlags = "?blacklistFlags=nsfw,religious,political,racist,sexist,explicit"
  return fetch(`https://v2.jokeapi.dev/joke/Any${blackFlags}&safe-mode`)
}


/**
 * Returns API response for NASA's Astronomy Picture of the Day.
 * @return {string} The API response.
 * @link https://api.nasa.gov/
 */
const getAPOD = () => fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&thumbs=True`)


/**
 * Returns the response for the Cuttly (URL shortener) API.
 * @param {object} event The Handouts Chat event.
 * @return {string} The shortened URL or an error message.
 * @link https://cutt.ly/
 */
const getCuttly = (event) => {

  // [CASE] NO Arguments:
  if (event.message.argumentText == undefined) {
    return "Sorry, you're missing arguments. Try the format: '/shorty https://abcdefghijklmnop.com'"
  }
  // [CASE] GOT Arguments:
  else {
    let msg = ''
    const url = event.message.argumentText.trim()
    const res = fetch(`http://cutt.ly/api/api.php?key=${CUTTLY_API_KEY}&short=${encodeURI(url)}`)
    const status = parseInt(res.url.status)

    // Check status code --> Output appropriate reply:
    switch (status) {
      case 1:
        msg = "It looks like this like has already been shortened."
        break
      case 2:
        msg = "Your link is an imposter!"
        break
      case 3:
        msg = "This link name has already been taken."
        break
      case 4:
        msg = "Invalid API Key!"
        break
      case 5:
        msg = "The link has not passed the validation. It includes invalid characters."
        break
      case 6:
        msg = "Sorry, the link provided is from a blocked domain."
        break
      case 7:
        msg = `Shortened ==> ${res.url.shortLink}`
        break
      default:
        msg = "ERROR! Something went wrong."
    } 

    return msg
  }
}
