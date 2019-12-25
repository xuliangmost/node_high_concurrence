import async from 'async'

const maxCount = 10; // 最大并发数量
let count = 0;
function axios (url, callback) {
  const delay = parseInt((Math.random() * 10000000) % 2000, 10);
  count++;
  console.log('现在的并发数是', count, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
  setTimeout(function () {
    // 调用成功之后  并发数量 -1
    count--;
    //抓取成功，调用回调函数
    callback(null, url + ' html content');
  }, delay);
};

const AsyncStart = function (req,res) {
  let urls = []
  for (let i = 0; i < 50; i++) {
    urls.push(i)
  }
  async.mapLimit(urls, maxCount, function (url, callBack) {
    axios(url, callBack)
  }, function (err, result) {
    console.log('final', err);
    console.log(result);
    res.send(result)
  })
}

export default AsyncStart