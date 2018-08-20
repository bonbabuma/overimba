window.onload = function() {
	const btagform = document.getElementById('btagform');
	
	btagform.onsubmit = function () {
		//alert('yo dawg');
		
		let btag = document.getElementById('btagsearch').value;
		btag = btag.replace('#',"-");
		alert(btag);
		
		
		location.href = "api/pc/" +  btag;   //qstnmrk-1366";
		return false;
	}
	
	
	//location.href = url;
	
	
}