$(window).load(function(){
	//Récupération de la liste des pannes
	API_PATH = "http://cgptruck.azurewebsites.net/";
	pannes = [];
	recupReparateursDone = false; //Permet de ne faire qu'une seule récupération des repairers
	clicPostReparateur = false; //Bloque le double-post du formulaire d'envoi de repairer

	//Appel de la méthode de récupération des pannes / 10 secondes
    setInterval(getPannesFromJSON, 10000);
    getPannesFromJSON();

    //Gestion d'ouverture de la pop-up
    $(".boutonsOpenPannes").click(function(){
    	//On cache l'id de la panne en cours de traitement;
		$("#hidFailureId").val($(this).attr('id').split("__")[1]);
    });

    //Clic pour la pop-up
    $("#envoiReparateurBTN").click(function(){
		postEnvoiReparateur();
    });

});

function getPannesFromJSON(){
    mytoken = "Bearer " + $("#spanToken").text();
	$.ajax({
	    url : API_PATH + 'api/Failures/declared',
	    headers: {
	        'Authorization': mytoken
	    },
	    type : 'GET',
	    dataType : 'html',
	    success : function(resultat, statut){
	    	console.log("/!\\ Récupération des pannes");
	       	supprimerBillets();
	       	pushDonneesPanneTableau(resolveReferences(JSON.parse(resultat)));
			gestionBillets();
	    },

	    error : function(resultat, statut, erreur){
	    	console.log("/!\\ Erreur lors de la récupération des pannes");
	    }
	});
}

function pushDonneesPanneTableau(fails){
	for (i=0; i<fails.length; i++){
		var dateFail = new Date(fails[i].Date);
		pannes.push({
			"id" : fails[i].Id,
			"date" : dateFail.getDate() +"/"+(dateFail.getMonth()+1)+"/"+dateFail.getFullYear()+" "+dateFail.getHours()+":"+dateFail.getMinutes(),
			"nomMission" : fails[i].Mission.Name,
			"description" : fails[i].Mission.Description
		});
	}
}

//Génération des billets en fonction du nombre de pannes
function gestionBillets(){
	//Il y a des pannes à traiter
	//On indique leur nombre sur le badge-cloche
	$("#badgeNombrePanne").html(pannes.length);
	if (pannes.length > 0){
		$("#badgeNombrePanne").addClass('bg-red'); //Badge en rouge
		
		//Si il y a une panne et qu'on a pas encore récupéré les réparateurs, on le fait.
		if (!recupReparateursDone){
			recupReparateurDone = true;
			recupListeReparateurs();
		}

		//On supprime les billets
		supprimerBillets();
		//On crée les billets pour chacune d'entre-elles
		for (i = 0; i < pannes.length; i++){
			creerBillet(pannes[i]);
		}

	} else {
		$("#badgeNombrePanne").removeClass('bg-red'); //Suppression du badge
	}
}


//Création d'un billet <li> dans le menu des pannes
function creerBillet(panne){
	var content = "<li id='billetPanne_" + panne['id'] + "1'>"
    +	"<a>"
    +       "<span>"
    +            "<span>" + panne['nomMission'] + "</span>"
    +            "<span class='time'>"+panne['date']+"</span>"
    +        "</span>"
    +        "<span class='message' style='margin-top: 10px;margin-bottom: 10px;''>" 
    +            panne['description']
    +        "</span>"
    +        "<span>"
    +             "<button id='BTNopenModalPanne__'"+panne['id']+"' type='button' style='width:100%;padding:3px;'' class='boutonsOpenPannes btn btn-danger btn-xs' data-toggle='modal' data-target='#pannesPopupConsultPanne'>" 
    +                "<i class='fa fa-car'>  </i> Envoyer un réparateur"
    +            "</button>"
    +        "</span>"
    +    "</a>"
    +"</li>";
	$("#menuPannes").append(content);
}

//Suppression de tous les billets
function supprimerBillets(){
	pannes = [];
	$("#menuPannes li").remove();
}



/********* GESTION PANNES - POP-UP DE CONSULTATION D'UNE PANNE ********/
//Récupération de la liste des réparateurs + remplissage du select
function recupListeReparateurs(){
	mytoken = "Bearer " + $("#spanToken").text();
	$.ajax({
	    url : API_PATH + 'api/Users/repairers',
	    headers: {
	        'Authorization': mytoken
	    },
	    type : 'GET',
	    success : function(resultat, statut){
	    	repairers = resolveReferences(JSON.parse(resultat));
	    	for (i=0; i<repairers.length; i++){
				$("#reparateurIdFormSelect").append("<option value='"+repairers[i].Id+"'>"+ repairers[i].FirstName +" "+ repairers[i].LastName +"</option>");
			}
	    },
	    error : function(resultat, statut, erreur){
	    	//ERREUR
	    }
	});
	
}


//POST du formulaire d'envoi d'un réparateur sur place
function postEnvoiReparateur(){
	if (clicPostReparateur){
		clicPostReparateur = false;

		repairerId = $("#reparateurIdFormSelect option:selected").val();
		failureId = $("#hidFailureId").val();
		if (repairerId == "" || failureId == ""){
			alert("Veuillez indiquer le réparateur à envoyer sur place avant de poursuivre");
			clicPostReparateur = true;
			return;
		} 
		var dataFailure = { "RepairerId": repairerId };
		$.ajax({
			url : API_PATH + 'api/Failures/'+failureId+'/assign',
			headers: {
				'Authorization': "Bearer " + $("#spanToken").text(),
				'Content-Type': 'text/json'
			},
			type : 'POST',
			dataType: 'json',
			data: JSON.stringify(dataFailure),
			success : function(resultat, statut){
				alert("Le technicien renseigné a été prévenu.");
			},
			error : function(resultat, statut, erreur){
				alert("Une erreur est survenue. Veuillez réessayer plus tard");
			},
			complete : function(resultat, statut){
				//Fermeture de la pop-up => click sur "Annuler"
				clicPostReparateur = true;
				$("#hidFailureId").val("");
				$("#BTNcloseModalEnvoiRepar").click();
				getPannesFromJSON(); //On recommence la procédure de récup' des pannes
			}
		});

	}
}


