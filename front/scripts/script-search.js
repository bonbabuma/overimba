
window.onload = function() {
	
	
  let playerListDirectives = {
	'avatar': {
		src: function() { return this.avatar;},
		'data-href': function() { return this.clickRow; }},
	'btag':{
		text: function () { return this.playerName ;},
		'data-href': function() { return this.clickRow; }}
};
		
	
  
  
		
	
	const btagform = document.getElementById('btagform');
	btagform.onsubmit = function () {
		
		let btag = document.getElementById('btagsearch').value;
		btag = btag.replace('#',"-");
		
		location.href = "/playersearch/pc/" +  btag;
		return false;
	}
	
	
	function getAllPlayers() {
		let req = "/api/v2/search/pc/" + nick
		console.log(req);
		$.get(req, (data) => {
			
			console.log(data);
			if ( data.length == 1) {
				if (data[0].visibility.isPublic) {
					console.log(data[0]);
					$.get("/api/v2/all/pc/" + data[0].urlName, (newData) => {
						console.log("here");
						window.location = "/player/pc/" + data[0].urlName;
					});
				}
			}
			
			
			let playerList = [];
			
			data.forEach( (player) => {
				if ( player.visibility.isPublic ) {
					let curPlayer = {};
					curPlayer.clickRow = "/playersearch/pc/" + player.urlName
					curPlayer.avatar = player.portrait;
					console.log(player.urlName);
					curPlayer.playerName = player.urlName;
					
					
					playerList.push(curPlayer);
				}
			});
			
			if (playerList.length == 0) {
				let curPlayer = {};
				curPlayer.clickRow = "";
				curPlayer.PlayerName = "No Results Found";
				
				playerList.push(curPlayer);
			}
			
			
			//console.log(playerList);
			$(".HeroTable .heroList").render(playerList, playerListDirectives);
			
			$(".btag").click(function() {
				window.location = $(this).data("href");
			});
			$("img.avatar").click(function() {
				window.location = $(this).data("href");
			});
			
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