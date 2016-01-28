$(window).load(function(){
	//Récupération des infos de la MAP
	locations = [];
    positions = [];
	buildArrayWithEtapes();
    turnLocationsIntoMarkers();
});

//Construit un tableau d'étapes à partir du tableau des étapes (view)
function buildArrayWithEtapes(){
	$("#tableEtapes tbody tr").each(function(){
		var position = $(this).find("td:nth-child(5)").text().split(":");
        gestionDecalagePointsMap(position);
		locations.push({
	    	"name" : $(this).find("td:nth-child(3)").text(),
	    	"num" : $(this).find("td:nth-child(1)").text(),
	    	"lat" : position[0], 
	    	"long" : position[1]
		});
	});
}

//Transforme les positions en markers
function turnLocationsIntoMarkers() {
	for (i = 0; i < locations.length; i++) {
        marker = new googlMap.Marker({
            position: new googlMap.LatLng(locations[i]["lat"], locations[i]["long"]),
            label: locations[i]["num"],
            map: map,
        });

        bounds.extend(marker.position);

        googlMap.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i]["name"]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }

    map.fitBounds(bounds);

    var listener = googlMap.event.addListener(map, "idle", function () {
        googlMap.event.removeListener(listener);
    });
}

function gestionDecalagePointsMap(position){
    if (locations.length > 0){
        for (i = 0; i < locations.length; i++){
            if ( locations[i]["lat"] == position[0] && locations[i]["long"] == position[1] ){
                position[0] = parseFloat(position[0]) + 0.00002;
                position[1] = parseFloat(position[1]) + 0.00002;
            }
        }
    }
}