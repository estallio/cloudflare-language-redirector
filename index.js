import { parse as cookieParser } from 'cookie'
import acceptLanguageParser from 'accept-language-parser'

/*
Language recognition order:
1. check if path is not a static or excluded one
2. check if language was specified in the language cookie
3. check if a supported language is given in the browser languages
4. check if request comes from a german speaking country
5. fallback to english as english is understood all over the globe
*/

// According to https://worldpopulationreview.com/country-rankings/german-speaking-countries
// german speaking countries are
const germanSpeakingCountries = [
  'DE',
  'AT',
  'CH',
  'BE',
  'LU',
  'LI'
]

const langCookieName = 'i18n_redirected'

const supportedLanguages = [
  'de',
  'en'
]

const defaultLanguage = 'en'

const staticPaths = [
  'sw.js',
  'sitemap.xml',
  'robots.txt',
  'icon.png',
  'favicon.ico',
  '_nuxt\\/.*',
  'static\\/.*',
  'de(\\/.*)?',
  'en(\\/.*)?',
  '404.html'
]

const staticPathsRegex = new RegExp(`^/(${staticPaths.join('|')})$`, 'i')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  ////////
  // case 1: check if path is not a static or excluded one
  ////////

  if (url.pathname.match(staticPathsRegex)) {
    return fetch(request)
  }

  ////////
  // case 2: cookie is set
  ////////

  // extract cookies of cookie http header
  const cookies = cookieParser(request.headers.get('Cookie') || '')

  // check if cookie (key in the cookies object) exists
  if (cookies[langCookieName] !== null) {
    // check if language is supported
    if(supportedLanguages.includes(cookies[langCookieName])) {
      // respond with the cookie value
      return Response.redirect((url.origin + '/' + cookies[langCookieName] + url.pathname).replace(/\/+$/, ''), 302)
    }
  }

  ////////
  // case 3: check if a supported language is given in the browser languages
  ////////

  // get the favorite supported language from header - could return null
  const lang = acceptLanguageParser.pick(
    supportedLanguages,
    request.headers.get('Accept-Language') || '',
    { loose: true }
    )

  if (lang !== null) {
    // respond with the accept-language value
    return Response.redirect((url.origin + '/' + lang + url.pathname).replace(/\/+$/, ''), 302)
  }

  ////////
  // case 4: check if request comes from a german speaking country
  ////////
  if (germanSpeakingCountries.includes(request.cf.country.toUpperCase())) {
    return Response.redirect((url.origin + '/de' + url.pathname).replace(/\/+$/, ''), 302)
  }

  ////////
  // case 5: fallback to english as english is understood all over the globe
  ////////
  return Response.redirect((url.origin + '/en' + url.pathname).replace(/\/+$/, ''), 302)
}


