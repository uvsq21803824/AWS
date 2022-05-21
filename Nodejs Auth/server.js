const express = require("express");
const connectDB = require("./db");
const app = express();
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./middleware/auth.js");

const PORT = 5000;
var mysql = require("mysql");
var ejs = require("ejs");
//////////////////////////////ANTI FAILLES DE SECURITE/////////////////////////////////////////////////////////////////////////////////////
/*var helmet = require("helmet");
var xss = require("x-xss-protection");
var xFrameOptions = require("x-frame-options");
//var redirectToHTTPS = require("express-http-to-https").redirectToHTTPS;
var mysql = require("mysql");
var ejs = require("ejs");

//sécurit de contenu
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      frameAncestors: ["'self'"],
    },
  })
);

//empêcher le vol de session
const session = require("cookie-session");
var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(
  session({
    name: "toto",
    keys: ["key1", "key2"],
    cookie: {
      secure: true,
      httpOnly: true,
      path: "foo/bar",
      expires: expiryDate,
    },
  })
);

// forcer le navigateur à communiquer en https de manière privilégié avec le serveur
//var sixtyDaysInSeconds = 5184000;
//app.use(helmet.hsts({ maxAge: sixtyDaysInSeconds }));
//partie envoyant l’utilisateur dans la zone sécurisée
//var express_enforces_ssl = require("express-enforces-ssl");
//app.use(express_enforces_ssl());

//masquer l'en-tête Referer
app.use(helmet.referrerPolicy({ policy: "same-origin" })); //
//empêche les navigateurs d'essayer de deviner ("sniff") le type MIME
app.use(helmet.noSniff());
//supprimer l'en-tête X-Powered-By
app.use(helmet.hidePoweredBy());
//anticickjajing
app.use(helmet.frameguard({ action: "sameorigin" }));

/*deny: on interdit tout simplement au navigateur d’inclure cette page dans une iframe;
  sameorigin: on autorise seulement pour une page venant du même endroit que la page de l’iframe;
  allow - from : on spécifie qui peut l’afficher.Pratique notamment si vous avez une application agrégeant plusieurs autres applications.*/

//failles xss
/*
app.use(helmet.xssFilter());
app.use(xss({ setOnOldIE: true }));

//injection sql
//var app = express();
var sqlinjection = require("sql-injection");
app.use(sqlinjection);*/
//########################################################################################################################################//
//############################################### ################################################# ######################################//
// retreiving questions//////////////////////////////////////////////
var genre = [];
var difficulty = [];
let question = [];
let answers = [];
let q = [];

var con = mysql.createConnection({
  host: "bq5rywc2xtbyepjftd9f-mysql.services.clever-cloud.com",
  user: "ukyvpr3wzxsjmwov",
  password: "mCEQz4NfchflIPQNfiQI",
  port: 3306,
  database: "bq5rywc2xtbyepjftd9f",
});
app.use(express.json());
app.use(cookieParser());
// views
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/"));

sequentialQueries();
// Routes
app.use("/api/auth", require("./Auth/route"));

app.get("/", (req, res) => res.render("menu"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/solo", (req, res) => {
  res.render("index", {
    questions: JSON.stringify(q),
    answers: JSON.stringify(answers),
  });
});

app.get("/Sablier", (req, res) => {
  res.render("indexsablier", {
    questions: JSON.stringify(q),
    answers: JSON.stringify(answers),
  });
});
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});
app.get("/admin", (req, res) => res.render("salon"));
app.get("/basic", (req, res) => res.render("salon"));

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
async function sequentialQueries() {
  try {
    con.connect();

    queryPromise1 = () => {
      return new Promise((resolve, reject) => {
        con.query("SELECT * FROM genre", (error, results) => {
          if (error) {
            return reject(error);
          }
          setValue(1, results);
          return resolve(results);
        });
      });
    };

    queryPromise2 = () => {
      return new Promise((resolve, reject) => {
        con.query("SELECT * FROM difficulty", (error, results) => {
          if (error) {
            return reject(error);
          }
          setValue(2, results);
          return resolve(results);
        });
      });
    };

    queryPromise3 = () => {
      return new Promise((resolve, reject) => {
        con.query("SELECT * FROM question", (error, results) => {
          if (error) {
            return reject(error);
          }
          setValue(3, results);
          return resolve(results);
        });
      });
    };

    const result1 = await queryPromise1();
    const result2 = await queryPromise2();
    const result3 = await queryPromise3();

    // here you can do something with the three results
  } catch (error) {
    console.log(error);
  } finally {
    con.end();
  }
}

function setValue(n, value) {
  if (n === 1) {
    genre = value;
  }
  if (n === 2) {
    difficulty = value;
  }
  if (n === 3) {
    question = value;
    create();
  }
}

function create() {
  var r = Array(4);
  var tmp = Array(4);
  var s = Array(4);
  var v;
  var c;
  var j;

  answers[0] = { entries: ["Pret"], correct: 0 };

  for (var i = 0; i < question.length; i++) {
    tmp[0] = question[i].reponse0;
    tmp[1] = question[i].reponse1;
    tmp[2] = question[i].reponse2;
    tmp[3] = question[i].reponse3;

    s = [5, 5, 5, 5];

    j = 0;

    while (j !== 4) {
      v = Math.floor(Math.random() * 4);

      if (!contains(s, v)) {
        if (v === 0) c = j;
        s[j] = v;
        r[j] = tmp[v];
        j++;
      }
    }

    q[i] = question[i].question;
    answers[i + 1] = { entries: [r[0], r[1], r[2], r[3]], correct: c };
  }

  console.log("Données chargés avec succes!");
}

function contains(s, v) {
  for (var i = 0; i < s.length; i++) {
    if (s[i] === v) return true;
  }
  return false;
}
