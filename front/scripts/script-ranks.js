
window.onload = function() {
	
	let relevantPercentileStats = {
			all: [
				"all_damage_done_avg_per_10_min",
				"healing_done_avg_per_10_min",
				"eliminations_avg_per_10_min",
				"eliminations_per_life"
				],
			inverse:[
				"deaths_avg_per_10_min"
				]
			}
	
	function showOverallCircle(div,percentile, overall) {
	
			function drawCircle(div,progress,size,thickness) {
				
				
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
			
			$(div + " div").addClass("invisible");
			if (overall) { 
				drawCircle(div, (percentile/100)*0.755,150,20);
			} else {
				drawCircle(div, (percentile/100)*0.755,75,15);
			}
			$(div + " div").removeClass("invisible");
	}
	
	
	let directives = {
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
	 'weapon_acc': {
        text : function() { 
			return Math.floor(this.weapon_accuracy*10)/10;
		}
     },
    'weapon_acc_width': {
		style: function() { 
			return "width: " + this.weapon_accuracy_percentile + "%";
		}
	},
	'weapon_acc_text': {
		text: function() { 
			return this.weapon_accuracy_percentile + "%";
		}
     },
	 'eliminations_per_10': {
        text : function() { 
			return Math.floor(this.eliminations_avg_per_10_min*10)/10;
		}
     },
    'eliminations_per_10_width': {
		style: function() { 
			return "width: " + this.eliminations_avg_per_10_min_percentile + "%";
		}
	},
	'eliminations_per_10_text': {
		text: function() { 
			return this.eliminations_avg_per_10_min_percentile + "%";
		}
     },
	 'deaths_per_10': {
        text : function() { 
			return Math.floor(this.deaths_avg_per_10_min*10)/10;
		}
     },
    'deaths_per_10_width': {
		style: function() { 
			return "width: " + (Math.abs(this.deaths_avg_per_10_min_percentile - 100)) + "%";
		}
	},
	'deaths_per_10_text': {
		text: function() { 
			return (Math.abs(this.deaths_avg_per_10_min_percentile - 100)) + "%";
		}
     },
	 'ed_ratio': {
        text : function() { 
			return Math.floor(this.eliminations_per_life*10)/10;
		}
     },
    'ed_ratio_width': {
		style: function() { 
			return "width: " + this.eliminations_per_life_percentile + "%";
		}
	},
	'ed_ratio_text': {
		text: function() { 
			return this.eliminations_per_life_percentile + "%";
		}
     },
	 
  };
  
  
  let heroListDirectives = {
	'avatar': {
		src: function() { return "/assets/images/" + this.heroName + ".png";},
		'data-href': function() { return this.clickRow; }},
	'heroName':{
		text: function () { return this.heroName ;},
		'data-href': function() { return this.clickRow; }},
	'ed':{
		text: function () { return this.ed ;},
		'data-href': function() { return this.clickRow; }},
	'time':{
		text: function () { return Math.floor(this.time / 1000 / 60 / 60) + "h";},
		'data-href': function() { return this.clickRow; }}
	
};
		
	
  
  
	
	
	function calculatePercentiles(averagesObj, rankObj) {
		let count = 0;		
		let totalPercentile = 0;
		
		function percentileIterate( arr ) {
			let arrPercentile = 0;
			count += arr.length;
			arr.forEach( (key) => {
				let percentile = 0;
				let percentKey = key + "_percentile";
				if (rankObj[key] != null) {
					percentile = getPercentile(averagesObj[key], rankObj[key].average, rankObj[key].variance);
				}

				arrPercentile += percentile;
				averagesObj[percentKey] = percentile;
			});
			return arrPercentile;
		}

		totalPercentile += percentileIterate( relevantPercentileStats.all );
		totalPercentile -= (percentileIterate( relevantPercentileStats.inverse ) - 100);

		return Math.round(totalPercentile/count);		
	}
		
	
	const btagform = document.getElementById('btagform');
	btagform.onsubmit = function () {
		
		let btag = document.getElementById('btagsearch').value;
		btag = btag.replace('#',"-");
		
		//location.href = "api/pc/" +  btag;
		return false;
	}
	

	
	let req = '/api/v2/ranks/pc'
	console.log(req);
	$.get(req, (data) => {
		$("tbody.heroList").render(data)
		
/*		
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
	*/	
	});
	
	
	
	
	
}