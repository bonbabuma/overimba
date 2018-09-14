
window.onload = function() {
	
	
  let playerListDirectives = {
	'avatar': {
		src: function() { return "/assets/images/" + this.heroName + ".png";},
		'data-href': function() { return this.clickRow; }},
	'btag':{
		text: function () { return this.heroName ;},
		'data-href': function() { return this.clickRow; }},
	'ed':{
		text: function () { return this.ed ;},
		'data-href': function() { return this.clickRow; }},
	'time':{
		text: function () { return Math.floor(this.time / 1000 / 60 / 60) + "h";},
		'data-href': function() { return this.clickRow; }}
	
};
		
	
  
  
		
	/*
	const btagform = document.getElementById('btagform');
	btagform.onsubmit = function () {
		
		let btag = document.getElementById('btagsearch').value;
		btag = btag.replace('#',"-");
		
		//location.href = "api/pc/" +  btag;
		return false;
	}
	*/
	
	function getAllPlayers() {
		let req = "/api/v2/search/pc/" + nick
		console.log(req);
		$.get(req, (data) => {
			
			console.log(data);
			if ( data.length == 1) {
				if (data[0].visibility.isPublic) {
					$.get("/api/v2/all/pc/" + data[0].urlName, (data) => {
						window.location = "/player/pc/" + data[0].urlName;
					});
					console.log(data[0]);
				}
			}
			
			
			let playerList = [];
			
			data.forEach( (player) => {
				if ( player.visibility.isPublic ) {
					let curPlayer = {};
					curPlayer.clickRow = "/player/pc/" + player.urlName + "?mode=quickplayStats";
					curPlayer.avatar = player.portrait;
					curPlayer.PlayerName = player.urlName;
					
					
					playerList.push(curPlayer);
				}
			});
			
			if (playerList.length == 0) {
				let curPlayer = {};
				curPlayer.clickRow = "";
				curPlayer.PlayerName = "No Results Found";
				
				playerList.push(curPlayer);
			}
			
			console.list
			
			$(".heroList").render(playerList, playerListDirectives);
			
		});
	}

	function getDBPlayers() {
	

			$(".heroList").render(heroList, heroListDirectives);
			
			//omfg, this is hacky, close your eyes or you'll go blind.
			$(".heroName").click(function() {
				window.location = $(this).data("href");
			});
			$("img.avatar").click(function() {
				window.location = $(this).data("href");
			});
			$("td.ed").click(function() {
				window.location = $(this).data("href");
			});
			$("td.time").click(function() {
				window.location = $(this).data("href");
			});
			
		
		
	}
	
	
	
	
	
	$(".modeSelectorBox span").click(function() {
		mode = (mode == "quickplayStats") ? "competitiveStats" : "quickplayStats"
		getData();
	});
	
	getAllPlayers();
}