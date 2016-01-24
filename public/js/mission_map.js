$(window).load(function(){
	//Récupération des infos de la MAP
	locations = [
		{'nom': 'Ingésup', 'type':'propCamionMission', 'position': [44.8548213, -0.5669609999999999] },
		{'nom': 'Gillian', 'type':'propCamionGarage', 'position': [44.8613528, -0.5643929999999955] },
		{'nom': 'Maincare Solutions', 'type':'propReparateurs', 'position': [44.7826402, -0.6353303999999298] },
		{'nom': 'Perard Castle', 'type':'propLieuGarage', 'position': [44.204335, 0.5963481999999658] }
	];
	
	markers = [];
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

	
	//Appel de la méthode de récupération des infos de la map / 10 secondes
    setInterval(getInfosMapFromJSON, 10000);
    getInfosMapFromJSON();

});


function getInfosMapFromJSON(){
	$.ajax({
	    url : '/infosVehiculesLieux',
	    type : 'GET',
	    dataType : 'html',
	    success : function(code_html, statut){
	       	//FAKE : traitement du résultat => Transformation en tableau de locations

	    },

	    error : function(resultat, statut, erreur){
	    },

	    complete : function(resultat, statut){
	   		console.log("/!\\ Récupération des infos de la MAP");
	   		cleanMap();
	   		turnLocationsIntoMarkers(firstLoad);
	    }
	});
}

//Transforme les positions en markers + affiche si voulu dans le tableau de props
//Change la taille de la map en fonction des points
function turnLocationsIntoMarkers(withBounds) {
	
	for (i = 0; i < locations.length; i++) {
		markerTmp = locations[i];
		marker = new googlMap.Marker({
	      position: new googlMap.LatLng(markerTmp['position'][0], markerTmp['position'][1]),
	      map: tabProp[markerTmp['type']]? map : null,
	      icon: iconesPath + markerTmp['type'] + ".jpg"
	    });
	    if (withBounds && tabProp[markerTmp['type']]) bounds.extend(marker.position);
	    markers.push({
	    	'nom': markerTmp['nom'],
	    	'type': markerTmp['type'],
	    	'marker': marker
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

//Supprime toutes les infos de la MAP
function cleanMap(){
	for (var i = 0; i < markers.length; i++) {
  		markers[i]['marker'].setMap(null);
  	}
  	//markers = [];
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