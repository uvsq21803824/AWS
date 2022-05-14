const express = require("express");
const connectDB = require("./db");
const app = express();
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./middleware/auth.js");

const PORT = 5000;

//////////////////////////////ANTI FAILLES DE SECURITE/////////////////////////////////////////////////////////////////////////////////////
var  casque  =  require ( 'casque' ) ;
var  xss  =  require ( 'x-xss-protection' ) ;
var  xFrameOptions  =  require ( 'x-frame-options' ) ;
var  redirectToHTTPS  =  require ( 'express-http-to-https' ) . redirigerVersHTTPS ;

//sécurité de contenu
application . utiliser ( casque . contentSecurityPolicy ( {
  directive : {
    frameAncestors : [ "'self'" ] ,
  }
} ) ) ;

// empêcher le vol de session
const  session  =  require ( 'cookie-session' )
var  dateexpiration  =  nouvelle  date ( Date . maintenant ( )  +  60  *  60  *  1000 )  // 1 heure
application . utiliser ( session ( {
    nom : 'toto' ,
    clés : [ 'clé1' ,  'clé2' ] ,
    biscuit : {
        sécurisé : vrai ,
        httpOnly : vrai ,
        chemin : 'foo/bar' ,
        expire : dateexpiration
    }
} ) ) ;

// forcer le navigateur à communiquer en https de manière privilégiée avec le serveur
var  soixanteJoursEnSecondes = 5184000  ; 
application . use ( casque . hsts ( {  maxAge : sixtyDaysInSeconds  } ) ) ;
//partie envoyant l'utilisateur dans la zone sécurisée
var  express_enforces_ssl  =  require ( 'express-enforces-ssl' ) ;
application . utiliser ( express_enforces_ssl ( ) ) ;

//masquer l'en-tête Referer
application . use ( casque . referrerPolicy ( {  policy : 'same-origin'  } ) ) ; //
//empêche les navigateurs d'essayer de deviner ("sniff") le type MIME
application . utilisation ( casque . noSniff ( ) ) ;
//supprimer l'en-tête X-Powered-By
application . utiliser ( casque . hidePoweredBy ( ) ) ;
//anticickjajing
application . use ( casque . frameguard ( {  action : 'sameorigin'  } ) )

/*deny: on interdit tout simplement au navigateur d'inclure cette page dans une iframe;
  sameorigin : on autorise seulement pour une page venant du même endroit que la page de l'iframe ;
  allow - from : on spécifique qui peut l'afficher.Pratique notamment si vous avez une application agrégeant plusieurs autres applications.*/


//failles xss
application . utiliser ( casque . xssFilter ( ) )
application . use ( xss ( {  setOnOldIE : true  } ) ) ;

//injection sql
var  app  =  express ( ) ;
var  sqlinjection  =  require ( 'sql-injection' ) ;
application . use ( sqlinjection ) ;
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
