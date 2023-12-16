const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const fs = require('fs');
var Iconv = require('iconv').Iconv;
var iconv = new Iconv('cp1251', 'utf-8');
const encoded = fs.readFileSync(`./messages0.html`);
const decoded = iconv.convert(encoded).toString();

// var Iconv = require('iconv').Iconv;
// function decode(content) {
//   var iconv = new Iconv('CP1255', 'UTF-8//TRANSLIT//IGNORE');
//   var buffer = iconv.convert(content);
//   return buffer.toString('utf8');
// };
// const decoded = decode(fs.readFileSync(`./messages0.html`));

// assuming htmlContent has been loaded from a file or is the HTML string
const dom = new JSDOM(decoded);

// get jQuery-like object
const $ = require("jquery")(dom.window);

let result = [];
$(".item").each(function() {
  let $msg = $(".message__header", this);
  let $text = $("div", this);
  let hasAttachment = $text.has('.attachment').length;

  // match message__header format and extract name, id, date and (optionally) edited date
  let match = $msg.text().match(/^(.*?), at (.*?) ((?:on (.*?))?(?:\((?:edited)?(.*?)\))?)/);
  let message = {
    id: $(this).find('.message').attr('data-id'),
    name: match[1],
    date: match[2],
    date_on: match[4],
    edited_date: match[5],
    text: $text.contents().filter(function() {
      return this.nodeType === 3; // Node.TEXT_NODE
    }).text().trim(),
    hasAttachment: hasAttachment ? true : false
  }
  if (message.hasAttachment) {
    message.attachment = {
      description: $('.attachment__description', this).text().trim(),
      link: $('.attachment__link', this).attr('href')
    }
  }

  result.push(message);
});

console.log(JSON.stringify(result, null, 2));