
window.onload = function() {
	
	let relevantPercentileStats = {
			all: [
				"eliminations_avg_per_10_min",
				"eliminations_per_life"
			],
			inverse:[
				"deaths_avg_per_10_min"
			],
			ana:  [
				"healing_done_avg_per_10_min",
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			bastion:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],

			brigitte:  [
				"damage_blocked_avg_per_10_min",
				"healing_done_avg_per_10_min",
				"all_damage_done_avg_per_10_min"
				],
			
			doomfist:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
			
			"d.va":  [
				"damage_blocked_avg_per_10_min",
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			genji:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			hanzo:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
			
			junkrat:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			lúcio:  [
				"healing_done_avg_per_10_min",
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			mccree:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
			
			mei:  [
				"all_damage_done_avg_per_10_min",
				"damage_blocked_avg_per_10_min",
				"weapon_accuracy"
				],
			
			mercy:  [
				"healing_done_avg_per_10_min"
				],
				
			moira:  [
				"healing_done_avg_per_10_min",
				"all_damage_done_avg_per_10_min"
				],

			orisa:  [
				"damage_blocked_avg_per_10_min",
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			pharah:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
			
			reaper:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			reinhardt:  [
				"damage_blocked_avg_per_10_min",
				"all_damage_done_avg_per_10_min"
				],
				
			roadhog:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			"soldier:_76":  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			sombra:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			symmetra:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			"torbjörn":  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
			
			tracer:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			widowmaker:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			winston:  [
				"damage_blocked_avg_per_10_min",
				"all_damage_done_avg_per_10_min"
				],

			wrecking_ball:  [
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
				
			zarya:  [
				"damage_blocked_avg_per_10_min",
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
				],
			
			zenyatta:  [
				"healing_done_avg_per_10_min",
				"all_damage_done_avg_per_10_min",
				"weapon_accuracy"
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

		totalPercentile += percentileIterate( relevantPercentileStats[hero] );
		totalPercentile += percentileIterate( relevantPercentileStats.all );
		totalPercentile -= (percentileIterate( relevantPercentileStats.inverse ) - 100);

		return Math.round(totalPercentile/count);		
	}
		
	
	const btagform = document.getElementById('btagform');
	btagform.onsubmit = function () {
		
		let btag = document.getElementById('btagsearch').value;
		btag = btag.replace('#',"-");
		
		//location.href = "/search/" +  btag;
		return false;
	}
	

	function getData() {
		if ( hero == "soldier76") hero = "soldier:_76";
		let req = "/api/v2/hero/" + platform + "/" + nick + "/" + mode + "/" + hero;
		$.get(req, (data) => {
			$(".phc").render(data.profile)
			
			let averagesObj = data.hero.average;
			let statsObj;
			if (mode == "quickplayStats") {
				statsObj = data.globalStats.quickplay
			} else {
				statsObj = data.globalStats.rank
			}
			
			let overallScore = calculatePercentiles(averagesObj, statsObj);
		
			$(".Specific > .statrow").render(averagesObj, directives);	
			showOverallCircle(".overall", overallScore, true);
			
			data.sessions.forEach( (sesObj, index) => {
				console.log(index);
				let divCard = "#card" + index
				let divScore = "#overall" + index; 
				averagesObj = sesObj.average;
				
				let sessionScore = calculatePercentiles(averagesObj, statsObj);
				
				$(divCard + " > .sessionSpecific > .statrow" ).render(averagesObj, directives);
				console.log(divScore);
				showOverallCircle(divScore,sessionScore,false);
				
			});
			

			
			

		});
	}
	
	$(".modeSelectorBox span").click(function() {
		mode = (mode == "quickplayStats") ? "competitiveStats" : "quickplayStats"
		getData();
	});
	
	getData();
	
	
	
}