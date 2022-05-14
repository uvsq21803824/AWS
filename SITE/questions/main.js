document.addEventListener("DOMContentLoaded", () => { 

	let level = 0;
	let correct = 0;
	let selected = false;

	//liste des reponses avec la positions de la bonne reponses
    let answers = [
		{ entries:["Marseille","Lille","Paris","Tours"], correct: 2 },
		{ entries:["Copenhague","NY","Stockholm"], correct: 0 },
		{ entries:["4 224 103km2","2 166 086hm2"," 1 684 200km2","800 562km2"], correct: 1 },
		{ entries:["La mort de Napoleon","La prise de la bastille","Conquete de la lune"], correct: 1 },
		{ entries:["1492","1789","1589","1395"], correct: 0 },
		{ entries:["18/06/1815","17/06/1815","13/06/1815","14/06/1815"], correct: 0 },
		{ entries:["48","49","50","51"], correct: 1 },
		{ entries:["8","9","10","7"], correct: 0 },
		{ entries:["20","21","22"], correct: 1 },
		{ entries:["HP et la coupe de Feu","HP a l'ecole des sorciers","HP et la chambre des secrets"], correct: 1 },//10
		{ entries:["Un nouvel espoir","La Menace Fantome","Le reveil de la Force"], correct: 0 },
		{ entries:["2000","2001","1999","1998"], correct: 2 },
		{ entries:["La Poncee","La Penchee","La Plongee","La Pangee"], correct: 3 },
		{ entries:["Telophase","Prophase","Metaphase","Anaphase"], correct: 0 },
		{ entries:["Stimuler les recepteurs sensoriels","Engendrer une hyperthermie","Dilater les vaisseaux sanguins","Augmenter la permeabilite de la paroi des vaisseaux sainguins"], correct: 3 },
	];

	let buttonTemplate = $("<div></div>").addClass("btn btn-light w-50 rounded-0 m-1 border p-2");


	let finalMessage = $(".final-message");
	let options = $(".options");
	let progress = $("#current");
	let screenshot = $(".snippet");
	let proceedButton = $("#proceed");
	let quizbox = $(".quizbox");;
	let guessed = $("#guessed");


	addButtons(false,true);
	setScreenshot(true);
	
	gtag('event', 'Show', {
		'event_category': 'QUIZZ',
		'event_label': 'Quiz Started',
	});

	//permet dafficher limage des questions a chaque fois
    function setScreenshot(initial)
	{
		if (initial) {
			screenshot.attr("src","ok.png");
		}
		else
		{
			screenshot.fadeOut(300,function(){
				$(this).attr("src","ok.png");
				$(this).fadeIn(300);
			});
		}
	}


	//creer les boutons
	function addButtons(clear,initial)
	{
		if (clear) {
			$(options).empty();
		}

		for (let [i,b] of answers[level]['entries'].entries()) {
			let tempButton = buttonTemplate.clone();
			tempButton.attr("value",i);
			tempButton.html(b);
			tempButton.click(optionSelect);
			tempButton.appendTo(options);
		}
        if (initial) {
			
			proceedButton.css("display","none");
			proceedButton.click(proceed);
		}

	}

	//verifie si la reponse est vraie ou fausse 
	function markOption(index,correct)
	{
		options.children().eq(index).addClass(correct?"correct":"wrong");
	}

	function optionSelect()
	{
		if (selected || level == 15) {
			return;
		}

		selected = true;

		let indexSelected = parseInt($(this).attr("value"));
		
		if (indexSelected == answers[level]['correct'])
		{
			markOption(indexSelected,true);
			correct++;
		}
		else {
			markOption(indexSelected,false);
			markOption(answers[level]['correct'],true);
		}

		showButton();
	}

	function showButton()
	{
		proceedButton.show();
	}

	function hideButton()
	{
		proceedButton.hide();
	}

	//fait tourner les question apres chaque reponses
	function proceed()
	{
		if (!selected) {
			return;
		}

		selected = false;
		level++;

		if (level==15) {
			finish();
			return;
		}

		setScreenshot();
		addButtons(true);
		updateProgress();
		hideButton();
	}


	function updateProgress()
	{
		progress.html(level+1);
	}

	function finish()
	{
		gtag('event', 'Show', {
			'event_category': 'QUIZZ',
			'event_label': 'Quiz Finished',
		});

		quizbox.fadeOut(600,function() {
			this.remove();
			guessed.html(correct);
			finalMessage.fadeIn(600);
		});
	}


	// Google analystics events.
	function trackEvent() {
		var arr = ['_trackEvent'];
		arr.push.apply(arr, arguments);

		_gaq && _gaq.push(arr);
	}

});