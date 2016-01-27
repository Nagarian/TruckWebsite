$(document).ready(function(){
	API_PATH = "http://cgptruck.azurewebsites.net/";
	formMissionClick = false;
	//Au clic sur le bouton "Submit"
	$("#postMission").click(function(){
		if (formMissionClick) return;
		formMissionClick = true;

		var form_name = $("#form_name").val();
		var form_description = $("#form_description").val();
		var form_date = $("#form_date").val();
		var form_vehicule = $("#form_vehicule option:selected").val();;
		var form_driver = $("#form_driver option:selected").val();;
		var form_enlevement = $("#form_enlevement option:selected").val();;
		var form_livraison = $("#form_livraison option:selected").val();;

		if (form_name == "" || form_date == "" || form_vehicule == "" || form_driver == "" || form_enlevement == "" || form_livraison == "" ){
			alert("Veuillez renseigner l'ensemble des champs avant de poursuivre.");
			formMissionClick = false;
			return;
		} 
		//Gestion de la date
		var dateMission = new Date();
		var dateArray = form_date.split("/");
		dateMission.setDate(dateArray[0]);
		dateMission.setMonth(dateArray[1] - 1);

		var dataPostMission = {
			"Name": form_name,
			"Description": form_description,
			"Date": dateMission,
			"Vehicule_Id": form_vehicule,
			"Driver_Id": form_driver,
			"Pickup_Place_Id": form_enlevement,
			"Delivery_Place_Id": form_livraison,
		};
		$.ajax({
			url : API_PATH + 'api/Missions',
			headers: {
				'Authorization': "Bearer " + $("#spanToken").text(),
				'Content-Type': 'text/json'
			},
			type : 'POST',
			dataType: 'json',
			data: JSON.stringify(dataPostMission),
			success : function(resultat, statut){
				alert("Mission créée avec succès.");
				document.location.href="/Missions";
			},
			error : function(resultat, statut, erreur){
				alert("Une erreur est survenue. Veuillez réessayer plus tard");
				formMissionClick = false;
			}
		});
	});
});