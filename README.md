<img src="public/img/icons/dial.png" width="56" alt="The quando logo, a sundial that looks like a Q">

# quando

A small project for counting time (and learning PWAs).

It may just be me, but the number of times in my life I’ve wondered how many seconds old I am is at least 4. So I built this.

### [Keep track of when ⏳](https://quando.netlify.app/)

## About

### Time Entry

This revisits a challenge I encountered working on developing promotional sites with specific launch times across the world. The [time entry form](https://quando.netlify.app/times/new) lets people specify a moment in time with typical knowledge, rather than requiring any specific [calendrical literacy](https://yourcalendricalfallacyis.com/).

Times are input and stored with specific timezones and countdowns are presented in local time. Timezones are selected by their [IANA name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) and any summer time offsets are then determined by the full selected date. Rather than asking “what is the timezone for that place?” or ”is that place currently in summer time?”, the computer does the work.

Beyond that, [date-fns](https://github.com/date-fns/date-fns/tree/v2.0.0) handles the calculations and most formatting. I couldn’t find [a complete sentence](src/views/ItemSingle.vue#L135), or commas for thousands, but otherwise I’m told it’s [faster than moment](https://raygun.com/blog/moment-js-vs-date-fns/), so I use it now.

### Local Storage

All times are stored in local storage thanks to [vuex-persist](https://github.com/championswimmer/vuex-persist). This requires consent and easy removal, so a banner explains and requests this, and a menu helps remove everything.

The main drawback is no sync across installations and no backup. For the limited scope of the project, I’ve added a copy/paste approach which is [mainly convenient across iCloud](https://support.apple.com/en-us/HT209460), but doesn’t exclude anybody who can share text across devices by other means.

### Page Transitions

Yes, the page transitions are modelled on the iOS page slides from screen recordings by graphing pixel measurements per frame to derive a cubic-bezier value for the easing.

No, I can’t prevent the transition from happening when swiping from the screen edge. [I know](https://github.com/vuejs/vue-router/issues/14).


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
