import useSuperagent from '../tools/superagent';
import cheerio from 'cheerio'
import eventproxy from 'eventproxy'
import url from 'url'

/* 
  eventProxy 是发起异步请求   可以用递归控制请求数量 

*/
const baseUrl = 'https://cnodejs.org/';
const ep = new eventproxy();
let start = 0;
const maxProxy = 10;

function NodeProxy (req, res) {
  start = 0;
  useSuperagent(baseUrl, function (html) {
    // cheerio 就是node jquery
    const $ = cheerio.load(html);
    const items = [];
    $('#topic_list .topic_title').each(function (idx, element) {
      const $element = $(element);
      items.push(url.resolve(baseUrl, $element.attr('href')));
    });
    console.log(items.length, 'items');
    takeComment(items, res, start);
    // res.send(items);
  })
}

function takeComment (urls, res, _start = 0) {
  ep.after('output', maxProxy, function (html) {
    console.log('start:', start, 'urls:', urls.length);
    if (start < urls.length) {
      takeComment(urls, res, start);
      saveHtml(html, false)
    } else {
      saveHtml(null, true, res)
    }
  });
  for (let i = _start; i < urls.length; i++) {
    if (i > _start + maxProxy) break;
    // console.log('插入队列下表', i);
    useSuperagent(urls[i], function (html) {
      ep.emit('output', [urls[i], html]);
    });
    start++;
  }
}

let htmls = [];
function saveHtml (html, done, res) {
  if (done) return res.send(htmls);
  htmls = htmls.concat(html.map(topicPair => {
    var topicUrl = topicPair[0];
    var topicHtml = topicPair[1];
    var $ = cheerio.load(topicHtml);
    return ({
      title: $('.topic_full_title').text().trim(),
      href: topicUrl,
      comment1: $('.reply_content').eq(0).text().trim(),
    });
  }));
}

export default NodeProxy