const mysql = require('mysql');

var con = mysql.createConnection({
	host: "bq5rywc2xtbyepjftd9f-mysql.services.clever-cloud.com",
	user: "ukyvpr3wzxsjmwov",
	password: "mCEQz4NfchflIPQNfiQI",
	port : 3306,
	database : 'bq5rywc2xtbyepjftd9f',
});

var genre = [];
var difficulty = [];
var question = [];
let answers = [];
let q = [];

con.connect();

con.query("SELECT * FROM genre", function (err, tab, fields) {
if (err) throw err;
setValue(1,tab);
});

con.query("SELECT * FROM difficulty", function (err, tab, fields) {
if (err) throw err;
setValue(2,tab);
});

con.query("SELECT * FROM question", function (err, tab, fields) {
if (err) throw err;
setValue(3,tab);
});

function setValue(n,value)
{
	if(n === 1)
	{
		genre = value;	
	} 
	if(n === 2)
	{
		difficulty = value;	
	} 
	if(n === 3)
	{
		question = value;	
		create();
	} 
}

function create()
{	
	var r = Array(4);
	var tmp = Array(4);
	var s = Array(4);
	var v;
	var c;
	var j;
	
	answers[0] = { entries:["Pret"], correct : 0 };
	
	for( var i = 0; i < 20; i++)
	{	
		tmp[0] = question[i].reponse0;
		tmp[1] = question[i].reponse1;
		tmp[2] = question[i].reponse2;
		tmp[3] = question[i].reponse3;
		
		s = [5,5,5,5];
		
		j = 0;
		
		while( j !== 4)
		{
			v = Math.floor(Math.random() * 4);
			
			if(!contains(s,v))
			{	
				if(v === 0) c = j;
				s[j] = v;
				r[j] = tmp[v];
				j++;
			}
		}

		q[i] = question[i].question;
		answers[i+1] = {entries:[r[0],r[1],r[2],r[3]], correct: c}
	}
	
	console.log(q);
	console.log(answers);
}

function contains(s,v)
{
	for(var i = 0; i < s.length; i++)
	{
		if(s[i] === v) return true;
	}
	return false;
}

con.end();


