
window.onload = function() {
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
	
	
	
	
	directives = {
	'damage_blocked_per_10': {
        text : function() { 
			return Math.floor(this.damage_blocked_avg_per_10_min*10)/10;
		}
     },
    'damage_blocked_per_10_width': {
		style: function() { 
			return "width: " + this.damage_blocked_avg_per_10_min_percentile + "%";
		}
	},
	'damage_blocked_per_10_text': {
		text: function() { 
			return this.damage_blocked_avg_per_10_min_percentile + "%";
			
		}
     },
    'healing_done_per_10': {
        text : function() { 
			return Math.floor(this.healing_done_avg_per_10_min*10)/10;
		}
     },
    'healing_done_per_10_width': {
		style: function() { 
			return "width: " + this.healing_done_avg_per_10_min_percentile + "%";
		}
	},
	'healing_done_per_10_text': {
		text: function() { 
			return this.healing_done_avg_per_10_min_percentile + "%";
			
		}
     },
	 'damage_done_per_10': {
        text : function() { 
			return Math.floor(this.all_damage_done_avg_per_10_min*10)/10;
		}
     },
    'damage_done_per_10_width': {
		style: function() { 
			return "width: " + this.all_damage_done_avg_per_10_min_percentile + "%";
		}
	},
	'damage_done_per_10_text': {
		text: function() { 
			return this.all_damage_done_avg_per_10_min_percentile + "%";
		}
     },
	 
  };
	
	function calculatePercentiles(averagesObj, rankObj) {
		Object.keys( averagesObj ).forEach( (key) => {
			let percentile = 0;
			let percentKey = key + "_percentile";
			if (rankObj[key] != null) {
				percentile = getPercentile(averagesObj[key], rankObj[key].average, rankObj[key].variance);
			}
			
			averagesObj[percentKey] = percentile;
		});
	}
	
	/*
	$.get("http://127.0.0.1:3000/api/pc/qstnmrk-1366", (data) => {
		$(".phc").render(data.profile);
		let averagesObj = data.competitiveStats.global.average;
		calculatePercentiles(averagesObj, data.globalStats.rank.global);
		
		$(".statrow").render(averagesObj, directives);
		
	});
	*/
	
	
	const btagform = document.getElementById('btagform');
	btagform.onsubmit = function () {
		
		let btag = document.getElementById('btagsearch').value;
		btag = btag.replace('#',"-");
		
		//location.href = "api/pc/" +  btag;
		return false;
	}
}