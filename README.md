## Redirecting unlocalized URLs

Static hosting has some limitation like no server side language redirection for e.g. search engines. Cloudflare Workers run on the edge and are very fast when switching from cold state to hot (allegedly 5ms wake up time). This is ideally for redirections based on HTTP headers, browser settings or geolocation.

This Cloudflare Worker script redirects all unlocalized paths to `de` and `en` languages expect:

```
'de(\\/.*)?',
'en(\\/.*)?',
'sw.js',
'sitemap.xml',
'robots.txt',
'icon.png',
'favicon.ico',
'_nuxt\\/.*',
'static\\/.*',
'404.html'
```

These exceptions are necessary as all incoming request have to go through the worker in Cloudflare. The reason for this is, that there are no look ahead patterns like _execute this worker when there is no `/de` in the path_. Also common plugins like the [next-i18next](https://github.com/isaachinman/next-i18next) do it like mentioned above which can be seen in their [code here on Github](https://github.com/isaachinman/next-i18next/blob/abdf06545410f340b0529e3448f8b102ab840249/src/config/default-config.ts#L27).

The second backslash (`/`) in the definition paths is necessary because the code is transformed into a Regex in JS where slashes and backslashes have to be escaped.

#### Language recognition order:

1. check if path is not a static or excluded one
2. check if language was specified in the language cookie
3. check if a supported language is given in the browser languages
4. check if request comes from a german speaking country
5. fallback to english as english is understood all over the globe

## Deployment

You have 3 possibilities to deploy this script to Cloudflare Workers:

1. Copy the code from `index.js` and past it into the Cloudflare Workers Web Editor.
2. Install Cloudflare's CLI tool wrangler globally, login and deploy your script like [here](https://developers.cloudflare.com/workers/get-started/guide).
3. Inject this project into a CI/CD pipeline, inject the wrangler ENV variables `CF_ACCOUNT_ID`, `CF_ZONE_ID` and `CF_API_TOKEN` respectively and run the `yarn publish` command.

It is also possible to configure the associated domain via wrangler or the `wrangler.toml` file like it's documented [here](https://developers.cloudflare.com/workers/get-started/guide#optional-configure-for-deploying-to-a-registered-domain). The domain can route all traffic coming from a NuxtJS app through this Worker. This means a URL trigger like `https://domain.com/*` is suggestedd in the Cloudflare Workers tab on the domain settings page.

## License

[MIT](https://github.com/estallio/cloudflare-language-redirector/blob/main/LICENSE)

## Contact
:octocat: [@estallio](https://github.com/estallio)\
:email: [leonhard.esterbauer@gmal.com](mailto:leonhard.esterbauer@gmail.com)
