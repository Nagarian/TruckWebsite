$(document).ready(function(){
	API_PATH = "http://cgptruck.azurewebsites.net/";
    mytoken = "Bearer YU5L0EZQfR_SJkeSbWduoQzLL3QBjmlOxqYmtFqLrYZOHMhpb-KJG5rWjLsJfLyN-OQFNZWXjtFnwJLmZ-ZevXHm-MB8MKgb2elHsWmhNf8W8JpJs8CFx5OegkJBtTY0cL1GJvY9Pqz6QiSAclIK0tyR-8B81mW-pxWBxTliRZ3EnWJjLkGw3vVwsqd2xm4OuPpBWBQSTHc-S5BLZjJa8Qjc_YNZ1-roEVdZ5j5SucFYpp-dOBLBTGD6NS7X4vBc_EEtRo6l7TpHIsA42dcSYa5obm0zWsILzrp-Wq0qSHIb8Jada4zNFd4xPlANpdOGlJx9oZ5coX0tYbIB8kkkmBpK2hpyT3_pcKyjGkGhsQE";
	$.ajax({
	    url : API_PATH + 'api/Missions',
	    headers: {
	        'Authorization': mytoken
	    },
	    type : 'GET',
	    success : function(result, statut){
	    	result = resolveReferences(result);
	    	//Parcourt des missions + création des lignes
	    	for (i=0; i < result.length; i++){
	    		var dateMission = new Date(result[i].Date);
	    		var element = "<tr class='even pointer'>"
		        +        "<td class=''>"+result[i].Id+"</td>"
		        +        "<td class=''>"+dateMission.getDate()+"/"+(dateMission.getMonth()+1)+"/"+dateMission.getFullYear()+"</td>"
		        +        "<td class=''>"+result[i].Name+"</td>"
		        +        "<td class=''>John Blank L</td>"
		        +        "<td class=''>"+result[i].DeliveryPlace.Name+"</td>"
		        +        "<td class=''>"+result[i].Steps[result[i].Steps.length-1].Date+"</td>"
		        +        "<td class='last'><a href='/voirMission#"+result[i].Id+"'>Consulter</a>"
		        +        "</td>"
		        +    "</tr>";
		        
		        $("table#example tbody").append(element);
	    	}
	       	
		    
	    

	    },

	    error : function(resultat, statut, erreur){
	    	alert("Une erreur est survenue ! Veuillez réessayer en rechargeant la page.");
	    },

	    //complete : function(resultat, statut){
	    //}
	});
});