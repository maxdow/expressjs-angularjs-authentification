var express = require("express"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  session = require("express-session"),
  cookieParser = require("cookie-parser"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
  app = express();

// notre dossier publique, là ou se trouve l'application Web
app.use(express.static(__dirname + "/public"));
// Obligatoire si on veut utiliser le système des sessions, ce module
// permet à express de décoder les données contenues dans les cookies
app.use(cookieParser());

// lecture du contenu des requetes
app.use(bodyParser());

//permet l'utilisation de requetes du type DELETE et PUT
app.use(methodOverride());

// nécessaire pour l'utilisation des sessions. secret sert à signer le cookie
app.use(session({ secret: "private" }));

// Initialisation de PassportJs ansi que du système de session
app.use(passport.initialize());
app.use(passport.session());

var users = [
    { id: 1, username: "bob", password: "bob", email: "bob@example.com" },
    { id: 2, username: "joe", password: "joe", email: "joe@example.com" }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error("User " + id + " does not exist"));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.use(new LocalStrategy(
  function(username, password, done) {

    process.nextTick(function () {

      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: "Utilisateur inconnu : " + username }); }
        if (user.password !== password) { return done(null, false, { message: "Mot de passe invalide" }); }
        return done(null, user);
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});



var auth = function(req, res, next) {
    if (!req.isAuthenticated()) {
      res.send(401);
    } else {
      next();
    }
};

app.get("/", function(req, res, next) {
  res.send("index.html");
});

app.get("/secure", auth, function(req, res, next) {
    res.send({data:"je suis une donnée protégée"});
});

app.get("/logged", function(req, res) {
    res.send(req.isAuthenticated() ? req.user : "0");
});


app.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      return  res.send(401) ;
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.end(user);
    });
  })(req, res, next);
});



app.post("/logout", function(req, res) {
    req.logOut();
    res.send(200);
});


app.listen(3000);
console.log("Serveur en écoute port 3000");