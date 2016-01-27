$(window).load(function(){
	API_PATH = "http://cgptruck.azurewebsites.net/";
	markers = []; //Pour l'intégralité des données
	firstLoad = true; //Pour ne modifier le zoom de la map qu'une unique fois

	//Définition du tableau de propriété
	tabProp = {
		'propCamionMission' : true,
		'propCamionMissionPanne' : true,
		'propCamionGarage': false,
		'propReparateurs': true,
		'propReparateursMission': true,
		'propLieuGarage': false,
		'propLieuEntrepot': false,
		'propLieuCentreRepar': false,
		'propLieuResto': false,
		'propLieuStation': false,
		'propLieuClient': false
	};
	iconesPath = 'images/mapicons_';

	//MAJ du tableau de propriétés au clic sur une des checkboxes
	$(".checkPropMap").change(function(){
		tabProp[$(this).prop("id")] = $(this).prop("checked");
		changeVisibilityOfElementsOfType($(this).prop("id"));
	});

	//Appel de la récupération des lieux
	//Une fois finie, on récupère les éléments bougeants
	recupInfosLieux();

	
	//Appel de la méthode de récupération des infos de la map / 10 secondes
    setInterval(getInfosMapFromJSON, 10000);
    getInfosMapFromJSON();

});

//Récupère les infos des éléments statiques
//Une fois fini, on récupère les éléments bougeants
function recupInfosLieux(){
	mytoken = "Bearer " + $("#spanToken").text();
	$.ajax({
	    url : API_PATH + 'api/Places',
	    headers: {
	        'Authorization': mytoken
	    },
	    type : 'GET',
	    dataType: 'json',
	    success : function(resultat, statut){
	    	var places = resultat;
	    	for (i = 0 ; i < places.length; i++){
	    		markerTmp = places[i];
				markerType = getTypeLabelWithTypeId(markerTmp['Place_Type']);
				marker = new googlMap.Marker({
			      position: new googlMap.LatLng(
			      	markerTmp['Position']['Latitude'], markerTmp['Position']['Longitude']),
			      map: null,
			      icon: iconesPath + markerType  + ".jpg"
			    });
			    markers.push({
			    	'nom': markerTmp['Name'],
			    	'type': markerType,
			    	'marker': marker,
			    	'persist':true
				});
			}

			//Appel de la méthode de récupération des infos de la map / 10 secondes
		    //setInterval(getInfosMapFromJSON, 10000);
		    //getInfosMapFromJSON();
	    },

	    error : function(resultat, statut, erreur){
	    	alert("/!\\ Erreur lors de la récupération des pannes");
	    }
	});
}


function getInfosMapFromJSON(){
	$.ajax({
	    url : '/infosVehiculesLieux',
	    type : 'GET',
	    dataType : 'html',
	    success : function(resultat, statut){
	       	//FAKE : traitement du résultat => Transformation en tableau de locations
	       	var vehicmap = resolveReferences(JSON.parse(resultat));
	       	console.log("/!\\ Récupération des infos de la MAP");
	   		cleanMap();
	   		turnLocationsIntoMarkers(vehicmap, firstLoad);
	    },

	    error : function(resultat, statut, erreur){
	    }
	});
}

//Transforme les positions en markers + affiche si voulu dans le tableau de props
//Change la taille de la map en fonction des points
function turnLocationsIntoMarkers(vehicmap, withBounds) {
	for (i = 0; i < vehicmap.length; i++) {
		markerTmp = vehicmap[i];
		markerType = getTypeLabelForVehicule(markerTmp['Vehicule_Type']);
		marker = new googlMap.Marker({
	      position: new googlMap.LatLng(
	      	markerTmp['Position']['Latitude'], markerTmp['Position']['Longitude']),
	      map: tabProp[markerType]? map : null,
	      icon: iconesPath + markerType + ".jpg"
	    });
	    if (withBounds && tabProp[markerType]) bounds.extend(marker.position);
	    markers.push({
	    	'nom': markerTmp['Name'],
	    	'type': markerType,
	    	'marker': marker,
	    	'persist':false
		});
	}
	if (withBounds) map.fitBounds(bounds);
	firstLoad = false;
}

//Affiche/masque les éléments du type passé en paramètre, selon le tableau de prop
function changeVisibilityOfElementsOfType(type) {
  	for (var i = 0; i < markers.length; i++) {
  		if (markers[i]['type'] == type){
  			markers[i]['marker'].setMap(tabProp[markers[i]['type']]? map : null);
  			if (tabProp[markers[i]['type']]){
  				bounds.extend(markers[i].marker.position);
  			}
  		}
  	}
  	map.fitBounds(bounds);
}




//Supprime toutes les infos non-persistées de la MAP
function cleanMap(){
  	//On masque puis supprime tous les markers non-persistés
  	for(var i = markers.length - 1; i >= 0; i--) {
	    if(markers[i]['persist'] == false) {
	    	markers[i]['marker'].setMap(null);
	        markers.splice(i, 1);
	    }
	}
}

//Récupère le label "type d'un lieu" en fonction de son TYpeId
function getTypeLabelWithTypeId(typeId){
	var label = "";

	if (typeId == 0){
		label = "propLieuGarage";
	} else if (typeId == 1){
		label = "propLieuEntrepot";
	} else if (typeId == 2){
		label = "propLieuCentreRepar";
	} else if (typeId == 3){
		label = "propLieuResto";
	} else if (typeId == 4){
		label = "propLieuStation";
	} else { //if (typeId == 5){
		label = "propLieuClient";
	} 

	return label;
}

function getTypeLabelVehicule(typeId){
	var label = "";

	if (typeId == 0){
		label = "propReparateurs"; //propReparateursMission
	} else { //if (typeId == 1){
		label = "propCamionMission";
	} 
	/*
	'propCamionMission' : true,
		'propCamionMissionPanne' : true,
		'propCamionGarage': false,
		'propReparateurs': true,
		'propReparateursMission': true,
	*/

	return label;
}



/*
//Remplir la map selon le tableau de propriété
function fillMap(){

    var bounds = new google.maps.LatLngBounds();

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
        });

        bounds.extend(marker.position);

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }

    map.fitBounds(bounds);

    var listener = google.maps.event.addListener(map, "idle", function () {
        google.maps.event.removeListener(listener);
    });
}
*/