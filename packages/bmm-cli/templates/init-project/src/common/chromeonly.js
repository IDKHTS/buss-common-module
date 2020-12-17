export function chromeonly () {
  const browserUpgradePage = '/browserupgrade.html'

  if (!isSupportedChrome()) {
    console.log('xxxx')
    window.location.href =
      browserUpgradePage +
      '?return_url=' +
      encodeURIComponent(window.location.href)
  }

  function isSupportedChrome () {
    var result = detectChrome()
    return !!(result && +result.version >= 45)
  }

  /**
   * 检查是否 Chrome (chrome 内核)
   * @param ua - userAgent
   */
  function detectChrome (ua) {
    if (!ua) {
      ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : ''
    }
    return detect(ua)
  }

  function detect (ua) {
    function getChromeVersion () {
      return getFirstMatch(ua, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
    }

    const chromeos = /CrOS/.test(ua)
    let result = null

    if (/opera/i.test(ua)) {
    } else if (/opr\/|opios/i.test(ua)) {
    } else if (/SamsungBrowser/i.test(ua)) {
    } else if (chromeos) {
      result = {
        version: getChromeVersion(),
      }
    } else if (/edg([ea]|ios)/i.test(ua)) {
    } else if (/chrome|crios|crmo/i.test(ua)) {
      result = {
        version: getChromeVersion(),
      }
    }

    return result
  }

  function getFirstMatch (str, regex) {
    var match = str.match(regex)
    return (match && match.length > 1 && match[1]) || ''
  }
}

(function (window) {
})(window)
