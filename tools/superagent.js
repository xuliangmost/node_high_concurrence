const superagen = require('superagent');

function useSuperagent (url, callBack) {
  superagen.get(url).end(function (err, res) {
    if (err) {
      callBack(err);
      return false
    }
    callBack(res.text)
  })
}

export default useSuperagent