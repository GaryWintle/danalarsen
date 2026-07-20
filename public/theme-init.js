// Runs synchronously, before first paint, so a saved dark/light override
// applies immediately — no flash of the wrong theme. Must stay a plain
// external script (not inline): the site's CSP is script-src 'self', so
// this file, not an inline block, is what makes that possible.
//
// If nothing is saved, the data-theme attribute is left alone on purpose
// — the CSS in variables.css already follows the OS's prefers-color-scheme
// with no JS required, so "no saved choice" correctly means "match the
// system." The theme-color meta tag has no CSS equivalent, though, so
// it's set here either way to match whatever will actually render.
;(function () {
  var DARK_COLOR = '#101a21'
  var LIGHT_COLOR = '#0087a5'

  var saved = null
  try {
    saved = localStorage.getItem('theme')
  } catch (e) {
    // Storage blocked (private mode, disabled, etc.) — fall through to
    // the system theme below.
  }

  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved)
  }

  var isDark =
    saved === 'dark' ||
    (saved !== 'light' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  var meta = document.getElementById('theme-color-meta')
  if (meta) meta.setAttribute('content', isDark ? DARK_COLOR : LIGHT_COLOR)
})()
