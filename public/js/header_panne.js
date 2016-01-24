$(window).load(function(){
	//Récupération de la liste des pannes
	//FAKE : pannes
	//pannes = [];
	pannes = [
		{'id': '1', 'date':'12/01/2016', 'nomMission' : 'Livraison de lait', 'description': 'description bidon d\'une mission trop cool.' },
		{'id': '2', 'date':'15/01/2016', 'nomMission' : 'Livraison de PQ', 'description': 'description bidon d\'une mission trop cool.' },
		{'id': '3', 'date':'16/01/2016', 'nomMission' : 'Livraison de jus d\'orange', 'description': 'description bidon d\'une mission trop cool.' }
	];

    setInterval(getPannesFromJSON, 10000);
    //Call the function
    getPannesFromJSON();
});

function getPannesFromJSON(){
	$.ajax({
	    url : '/listePannes',
	    type : 'GET',
	    dataType : 'html',
	    success : function(code_html, statut){
	       	supprimerBillets();
	       	//FAKE : traitement du résultat => Transformation en tableau de pannes
			gestionBillets();
	    },

	    error : function(resultat, statut, erreur){
	    },

	    complete : function(resultat, statut){
	   		console.log("Récupération des pannes");
	   		supprimerBillets();
	       	//FAKE : traitement du résultat => Transformation en tableau de pannes
			gestionBillets();
	    }
	});
}

//Génération des billets en fonction du nombre de pannes
function gestionBillets(){
	//Il y a des pannes à traiter
	//On indique leur nombre sur le badge-cloche
	$("#badgeNombrePanne").html(pannes.length);
	if (pannes.length > 0){
		$("#badgeNombrePanne").addClass('bg-red'); //Badge en rouge
		
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
    +             "<button type='button' style='width:100%;padding:3px;'' class='btn btn-danger btn-xs' data-toggle='modal' data-target='#pannesPopupConsultPanne'>" 
    +                "<i class='fa fa-car'>  </i> Envoyer un réparateur"
    +            "</button>"
    +        "</span>"
    +    "</a>"
    +"</li>";
	$("#menuPannes").append(content);
}

//Suppression de tous les billets
function supprimerBillets(){
	//pannes = [];
	$("#menuPannes li").remove();
}



