const rp = require('request-promise');
const cheerio = require('cheerio');
var original
//
// var url = 'https://www.amazon.com/Natural-Wood-Craft-Sticks-Pack/dp/B06W9F3GD9/ref=sr_1_1_sspa?ie=UTF8&qid=1540436637&sr=8-1-spons&keywords=popsicle+sticks&psc=1'
// var selector = '#price_inside_buybox'
// const options = {
//   uri: url,
//   transform: function (body) {
//     return cheerio.load(body);
//   }
// };
//
// rp(options)
//   .then(($) => {
//     console.log($(selector).text());
//     original = $(selector).text()
//   })
//   .catch((err) => {
//     console.log(err);
//   });
//
// function getData(){
//   const options = {
//     uri: url,
//     transform: function (body) {
//       return cheerio.load(body);
//     }
//   };
//
//   rp(options)
//     .then(($) => {
//       if(original != $(selector).text()){
//         console.log($(selector).text());
//         $(selector  ).text()
//       }else{
//         console.log('Not Changed')
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
//
// setInterval(getData, 500);

function getData(link){
  var selector
  const options = {
    uri: link.url,
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  if(link.url.split("amazon.com").length>1){
    selector="#price_inside_buybox"
    console.log(selector)
  }
  rp(options)

    .then(($) => {
      //console.log("return stuff"
      return $(selector).text()
    })
    .catch((err) => {
      return "Price not found"
    });
};


var newPrice=getData(
  {"url":"https://www.amazon.com/Natural-Wood-Craft-Sticks-Pack/dp/B06W9F3GD9/ref=sr_1_1_sspa?ie=UTF8&qid=1540436637&sr=8-1-spons&keywords=popsicle+sticks&psc=1",
  "lastPrice":0})
var executions=0
while(newPrice && executions<1){
  console.log(newPrice)
  executions++
}
