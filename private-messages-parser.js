const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { DateTime } = require("luxon");
const fs = require('fs');
var Iconv = require('iconv').Iconv;
const $ = require("jquery")(dom.window);


var iconv = new Iconv('cp1251', 'utf-8');
const encoded = fs.readFileSync(`./messages0.html`);
const decoded = iconv.convert(encoded).toString();

const dom = new JSDOM(decoded);

let result = [];
$(".item").each(function() {
  let $msg = $(".message__header", this);
  let $text = $($("div", this)[3]);
  let hasAttachment = $text.has('.attachment').length;

  let match = $msg.text().match(/^([^,]+), (at \d+:\d+:\d+ [pa]m on \d+ \w+ \d+)\s*(\(edited\))?/);
  let date = DateTime.fromFormat(match[2], "'at' h:mm:ss a 'on' d MMM yyyy");

  console.log(date);

  let message = {
    id: $(this).find('.message').attr('data-id'),
    author: match[1],
    date,
    isEdited: !!match[3],
    hasAttachment: hasAttachment ? true : false
  }
  if (message.hasAttachment) {
    message.attachment = {
      description: $('.attachment__description', this).text().trim(),
      link: $('.attachment__link', this).attr('href')
    }
  }

  $('.kludges', this).remove();
  message.text = $text.html().replace(/<br\s*[\/]?>/gi, "\n").trim();

  result.push(message);
});

console.log(JSON.stringify(result, null, 2));
console.log(JSON.stringify(result.map(x=>x.text), null, 2));