const regex_email =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const regex_email2 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

var is_login = false;

var log_btn = document.getElementById("log-btn");

/**
 *
 */
function get_login_data() {
  var email_address = document.getElementById("input-email").value;
  var password = document.getElementById("input-password").value;
  is_login = true;
  if (!email_address.match(regex_email2)) {
    alert("format mail incorrect");
    //console.log("erreur")
  } else {
    alert(`mail : ${email_address}, mot de passe : ${password}`);
  }
  // TODO : action avec la bd

  // TODO : redirection vers le site principale
}

setInterval(() => {
  const time = document.querySelector("#time");
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  let day_night = "AM";
  if (hours > 12) day_night = "PM";

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  time.textContent = hours + ":" + minutes + ":" + seconds + " " + day_night;
});
