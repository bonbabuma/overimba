window.onload = function() {
	
	const btagform = document.getElementById('btagform');
	
	btagform.onsubmit = function () {
		
		let btag = document.getElementById('btagsearch').value;
		btag = btag.replace('#',"-");
		
		location.href = "api/pc/" +  btag;
		return false;
	}	
}