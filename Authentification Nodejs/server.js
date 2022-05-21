const express = require("express");
const connectDB = require("./db");
const app = express();
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./middleware/auth.js");

const PORT = 5000;

//////////////////////////////ANTI FAILLES DE SECURITE/////////////////////////////////////////////////////////////////////////////////////
var helmet = require("helmet");
var xss = require("x-xss-protection");
var xFrameOptions = require("x-frame-options");
var redirectToHTTPS = require("express-http-to-https").redirectToHTTPS;

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
var sixtyDaysInSeconds = 5184000;
app.use(helmet.hsts({ maxAge: sixtyDaysInSeconds }));
//partie envoyant l’utilisateur dans la zone sécurisée
var express_enforces_ssl = require("express-enforces-ssl");
app.use(express_enforces_ssl());

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
app.use(helmet.xssFilter());
app.use(xss({ setOnOldIE: true }));

//injection sql
//var app = express();
var sqlinjection = require("sql-injection");
app.use(sqlinjection);
//########################################################################################################################################//
//############################################### ################################################# ######################################//

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./Auth/route"));

app.get("/", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});
app.get("/admin", adminAuth, (req, res) => res.render("admin"));
app.get("/basic", userAuth, (req, res) => res.render("user"));

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
