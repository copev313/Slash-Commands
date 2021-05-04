/******************************************************************************
 *  Slash Commands Project!
 * 
 *  A Google Chat bot script used bring back the power of slash commands.
 * 
 *
 *  Created by: E.Cope                                  (Last edit: 5/4/21)
 *******************************************************************************/


// Handle any GET requests with a redirect to the landing page:
const doGet = () => {
  const html = `<div style="text-align: center; margin-top: 25%;">
                  <h2>If the redirect didn't work, see this project's landing page 
                    <a href="https://slash-commands-landing-page.netlify.app/">
                      here</a>.
                  </h2>
                  <script>
                    location.href="https://slash-commands-landing-page.netlify.app/"
                  </script>
                </div>`
  return HtmlService.createHtmlOutput(html)
}


// TESTS:
const test = () => {
  const fakeEvent = {
    "message": {
        "sender": {
          "name": 'Sender',
          "displayName": 'Sender Display Name'
        },
        "text": '/short https://script.google.com/home/projects/1DkqkGtWF_4Szm2v2bPh19wvQlCd_flUH5QwcLPY5gYgGQVwyluHqiYUd/edit',
        "argumentText": ' https://script.google.com/home/projects/1DkqkGtWF_4Szm2v2bPh19wvQlCd_flUH5QwcLPY5gYgGQVwyluHqiYUd/edit'
    },
    "user": {
      "name": 'bleep bloops',
      "displayName": 'bloopity',
    }
  }
  Logger.log()
}


/** ============================================================================ *
    == == == == == == == == GOOGLE CHAT BOT EVENT LISTENERS == == == == == == ==
 ** ============================================================================ */

/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 * @param {Object} event the event object from Hangouts Chat.
 */
const onAddToSpace = (event) => {
  return {'text': `Slash Commands Have Been Activated! This bot is currently in development.
See our site here: https://cutt.ly/qbjBAt7`}
}


/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 * @param {Object} e The event object from Hangouts Chat.
 */
const onRemoveFromSpace = (event) => {
  const name = (event.space.name ? event.space.name : "the chat.")
  console.info(`Slash Commands removed from ${name}`)
}


/**
 * Responds to a MESSAGE event in Hangouts Chat.
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


      // XKCD COMICS API: (/xkcd [id:5]) ✔️
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
      

      // ROLL DA DICE: (/roll [id:6]) ✔️
      case 6:
        response['text'] = rollDice(event)
        break


      // DOG API (/doggo [id:7]) ✔️
      case 7:
        dog = getDog()
        img = dog.message
        title = "🌭 The Dog Generator! 🐶"
        icon = "https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/3fb6a75c11d342c9c124a73d6c6e1a58"
        // Grab the breed name from the response URL.
        urlList = img.split('/')
        getBreed = urlList[4]
        breedName = 'hotdog'

        // Format breed name:
        // [CASE] Breed has two parts:
        if (getBreed.includes('-')) {
          arr = getBreed.split('-')
          breedName = `${arr[1]} ${arr[0]}`
        }
        // [CASE] Breed has only one part:
        else {
          breedName = getBreed
        }
        subtitle = `Featured breed:  ${toTitleCase(breedName)}`
        // Form response card:
        response = createImgCard(img, img, title, subtitle, icon)
        break


      // URL SHORTENER (/shorty [id:8]) ✔️
      case 8:
        response['text'] = getCuttly(event)
        break


      // WORDS API (/wordy [id:10])
      case 10:
        response['text'] = "⚙️ Coming Soon! 🚧"
        break


      // JOKE API (/jokester [id:11])
      case 11:
        justJokin = getJoke()

        // [CASE] One-part joke:
        if (justJokin.type == 'single') {
          response['text'] = justJokin.joke
        }
        // [CASE] Two-part joke:
        else {
          response['text'] = `*${justJokin.setup}*\n\n_${justJokin.delivery}_`
        }
        break


      // GENIUS API (/genius-lyrics [id:21])
      case 21:
        response['text'] = "⚙️ Coming Soon! 🚧"
        break
      

      // CHATTERBOX (/chatterbox [id:30])
      case 30:
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
                     "nope, no slashy enought",
                     "hmmm, I don't think so",
                     "Well, you tried"
                    ]

    response['text'] = choose(sayings)
  }
  
  // Return the response object to the chat.
  return response
}
