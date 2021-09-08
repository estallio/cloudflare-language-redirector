## Redirecting Languages

Redirects all paths to `de` and `en` languages expect:

```
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
```

This is necessary as all incoming request have to go through the worker because there are no look ahead patterns like "execute this worker when there is no '/de' in the path". Also common plugins like the [next-i18next](https://github.com/isaachinman/next-i18next) do it like this which can be seen in their [code on Github](https://github.com/isaachinman/next-i18next/blob/abdf06545410f340b0529e3448f8b102ab840249/src/config/default-config.ts#L27). The second `/` in de and en paths is necessary as the code is transformed into a Regex in JS where slashes and backslashes have to be escaped.

#### Language recognition order:

1. check if path is not a static or excluded one
2. check if language was specified in the language cookie
3. check if a supported language is given in the browser languages
4. check if request comes from a german speaking country
5. fallback to english as english is understood all over the globe
