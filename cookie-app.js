var express  = require("express"),
session      = require("cookie-session"),
app = express();

app
.use(session({
  maxage :10000,
  signed:false
}));


app.get("/",function (req, res, next) {
  var n = req.session.views || 0;
  req.session.views = ++n;
  res.end(n + " vues");
});

app.listen(3000);