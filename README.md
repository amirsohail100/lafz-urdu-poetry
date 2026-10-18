# Lafz — Urdu Poetry Showcase

A Gen Z-style Urdu poetry site. Poems appear as banner cards and open into a full-screen, scroll-snap reader.
Pure HTML, CSS and JS — no build step.

## Run
Open `index.html` in a browser (internet needed for Google Fonts), or host the folder on GitHub Pages / Netlify.

## Add a poem
Everything lives in `data.js`. Add a block to `POEMS`:

```js
{
  id: "my-poem",            // used in the link: /#my-poem
  title: "عنوان",
  type: "غزل",
  mood: "🌙",
  about: "ایک سطر کا تعارف",
  colors: ["#FF9EC4", "#7B5CFF"],
  lines: ["شعر کی پہلی سطر", "شعر کی دوسری سطر", "", "اگلا شعر ..."],
}
```
An empty `""` line starts a new screen in the reader.

## Protection
Toggles are in `SITE.protection` (`data.js`): right-click, copy, capture shortcuts,
Windows key (Win+Shift+S), blur-on-focus-loss, print block and a visitor watermark.
Browsers cannot fully block screenshots or phone cameras — these are deterrents; the watermark helps trace leaks.
