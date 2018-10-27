var express = require('express');
var router = express.Router();
var User = require('../models/user');

const rp = require('request-promise');
const cheerio = require('cheerio');

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}





function fix(strPrice){
  strPrice=strPrice.replace(" ","")
  strPrice=strPrice.replace("$","")
  console.log(strPrice)
  console.log(parseFloat(strPrice))
  return parseFloat(strPrice)
};





// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
});


//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
      links: []
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/dashboard');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/dashboard');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/dashboard', function (req, res, next) {
  User.findById(req.session.userId)

    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          console.log(user)
          console.log(user.links)
          start_of_page='<!DOCTYPE html><html lang="en" ><head> <meta charset="UTF-8"> <title>Sw1per Dashboard</title> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <link href="https://fonts.googleapis.com/css?family=Arimo:400,400i,700,700i|IBM+Plex+Sans:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i|Lato:100,100i,300,300i,400,400i,700,700i,900,900i|Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i|Ramabhadra" rel="stylesheet"> <!--<link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">--> <link rel="stylesheet" href="https://anandchowdhary.github.io/ionicons-3-cdn/icons.css" integrity="sha384-+iqgM+tGle5wS+uPwXzIjZS5v6VkqCUV7YQ/e/clzRHAxYbzpUJ+nldylmtBWCP0" crossorigin="anonymous"> <link rel="stylesheet" href="css/dash.css"></head><body> <div class="mobile-wrapper"> <!--======= Header =======--> <header class="header"> <center><h1><a href="index.html" id="main"> Sw1per</a></h1></center> <div class="container"> <span>Welcome Back '+ user.username +'</span> <h1>'+user.email+'</h1> </header> <!--======= Today =======--> <section class="today-box" id="today-box"> <span class="breadcrumb">Today</span> <h3 class="date-title">October 19, 2018</h3> <div class="plus-icon"> <i class="ion ion-ios-add"></i> </div> </section> <!--======= Upcoming Events =======--> <section class="upcoming-events"> <div class="container"> <h3> Websites </h3> <div class="events-wrapper">'
          middle=""
          //console.log("links")

          for(i=0;i<user.links.length;i++){
            var newlink= user.links[i]
            //console.log(newlink)
            middle=middle+'<div class="event"> <div class="event"> <i class="ion ion-ios-flame done"></i> <h4 class="event__point">'+newlink.url+'</h4> <span class="event__duration">last updated 1secago</span> <p class="event__description"> Current Price: '+newlink.lastPrice+' </p> </div> </div>'
          }
          end_of_page='</div> <button class="add-event-button"> <span class="add-event-button__title"><a href="http://localhost:3000/newlink"/>Add Website</a></span> <span class="add-event-button__icon"> <i class="ion ion-ios-star-outline"></i> </span> </button> </div> </section></div><br><br> <script src="js/dash.js"></script></body></html>'
          return res.send(start_of_page+middle+end_of_page)
        }
      }
    });
});




router.get('/newlink', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {

          var page="<!DOCTYPE html><html lang=en><head><meta charset=UTF-8><title>Sw1per Login/Register</title><script type=application/x-javascript>addEventListener('load',function(){setTimeout(hideURLbar,0)},false);function hideURLbar(){window.scrollTo(0,1)};</script></head><body><div class=form-structor><center><h1><a href=index.html id=main> Sw1per</a></h1></center><div class=newlink><h2 class=form-title id=newlink><span>or</span>Sign up</h2><div class=form-holder><form action=/newlink method=post><input type=text name=url placeholder=url required class=input><input type=text name=currentPrice placeholder=10.00 required class=input><input type=submit value=newlink class=submit-btn></form></div></div></div></body></html>"

          return res.send(page);
        }
      }
    });

  //console.log(User.read)
})




router.post('/newlink', function (req, res, next) {
  //console.log("we're trying")
  console.log(req)
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          console.log(user)

          var selector
          const options = {
            uri: req.body.url,
            transform: function (body) {
              return cheerio.load(body);
            }
          };
          if(req.body.url.split("amazon.com").length>1){
            selector="#price_inside_buybox"
            console.log(selector)
          }
          rp(options)

            .then(($) => {
               var price=$(selector).text()
               console.log(price)
               var numval=fix(price)
               console.log(numval)
               newlink={"url":req.body.url,
               "lastPrice":numval}
               user.links=user.links.push(newlink)
               console.log(user)
               //user.links=[]
                 //console.log(user.links)
                 User.findOneAndUpdate({"_id": user._id}, {$set: {links: user.links}},  function(err,doc) {
                  if (err) { return err; }
                  else { return res.redirect('/dashboard') }
                });


            })
            .catch((err) => {
              return "Price not found"
            });



        }
      }
    });

  //console.log(User.read)
})


// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
