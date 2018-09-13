
window.onload = function() {
	
	
	
	
	const btagform = document.getElementById('btagform');
	
	btagform.onsubmit = function () {
		
		let btag = document.getElementById('btagsearch').value;
		btag = btag.replace('#',"-");
		
		location.href = "api/pc/" +  btag;
		return false;
	}

	function showOverallCircle(div,progress,size,thickness) {
		
		console.log(div);
		console.log(progress);
		
		$(div).circleProgress({
			value: progress,
			startAngle: 0.775 * Math.PI,
			size: size,
			thickness: thickness,
			fill: {
			  gradient: ["red", "red", "orange","orange","orange", "orange","green", "green"]
			}
		});	
		
		
		$(div).circleProgress({
			value: progress
		}).on('circle-animation-progress', function(event, progress, stepValue) {
			$(this).find('strong').text( Math.floor(stepValue.toFixed(2).substr(1) * (1.33334)*100) );
		});
		
	}
	
	let q = ".overall";
	
	$(q + " div").addClass("invisible");
	showOverallCircle(q, (88/100)*0.755,150,20);
	$(q + " div").removeClass("invisible");
	
	
	q = "#169";
	$(q + " div").addClass("invisible");
	showOverallCircle(q, (90/100)*0.755,75,15);
	$(q + " div").removeClass("invisible");

	q = "#168";
	$(q + " div").addClass("invisible");
	showOverallCircle(q, (80/100)*0.75,75,15);
	$(q + " div").removeClass("invisible");
	
}