var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');


//passport
var wsfedsaml2 = require('passport-azure-ad').WsfedStrategy;
var passport = require('passport');


var routes = require('./routes/index');
var users = require('./routes/users');
var iframetest = require('./routes/iframetest');

var app = express();

//passport
app.use(cookieParser('R66u7tFAPuiMVFyplqqdqf_36vh_2be8K37PGMoUV2KSmaEJckqq_d3TW'));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//passport
var config = {
    realm: 'https://testmps.onmicrosoft.com/playerloader',
    identityProviderUrl: 'https://login.windows.net/5f388bf9-fc7f-4854-906c-d0819c9f951e/wsfed',
    identityMetadata: 'https://login.windows.net/5f388bf9-fc7f-4854-906c-d0819c9f951e/federationmetadata/2007-06/federationmetadata.xml',
    logoutUrl:'http://localhost:3001/'
};


app.use('/', routes);
app.use('/users', users);
app.use('/iframetest', iframetest);


    /*
app.get('/', ensureAuthenticated, function(req, res){
    res.render('index', { user:req.user });
});
*/
app.get('/login', passport.authenticate('wsfed-saml2', { failureRedirect: '/', failureFlash: true }), function(req, res) {
    res.redirect('/');
});

// what to do when Azure Active Directory sends us back a token
app.post('/login/callback',
    passport.authenticate('wsfed-saml2', { failureRedirect: '/', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res){
    // clear the passport session cookies
    req.logout();

    // We need to redirect the user to the WSFED logout endpoint so the
    // auth token will be revoked
    wsfedStrategy.logout({}, function(err, url) {
        if(err) {
            res.redirect('/');
        } else {
            res.redirect(url);
        }
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.

passport.serializeUser(function(user, done) {
    done(null, user.email);
});

passport.deserializeUser(function(id, done) {
    findByEmail(id, function (err, user) { // we will use FindByEmail later in the code
        done(err, user);
    });

});

var wsfedStrategy = new wsfedsaml2(config,
    function(profile, done) {
        if (!profile.email) {
            return done(new Error("No email found"), null);
        }
        // asynchronous verification, for effect...
        process.nextTick(function () {
            findByEmail(profile.email, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    // "Auto-registration"
                    users.push(profile);
                    return done(null, profile);
                }
                return done(null, user);
            });
        });
    });


passport.use(wsfedStrategy);

var users = [];

function findByEmail(email, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.email === email) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

module.exports = app;


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});