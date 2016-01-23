$(document).ready(function(){
});

$("#map").mouseover(function(){
	google.maps.event.trigger(map, 'resize');
});