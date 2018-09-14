	$(document).ready(function(){
		let activities = [
		{
			  date:     '2011-08-23',
			  activity: 'Jogging',
			  comment:  'Early morning run',
			  name:     'Harry Potter'
		},{
			  date:     '2011-09-04',
			  activity: 'Gym',
			  comment:  'Chest workout',
			  name:     'Batman'
		}			,{
			  date:     '2018-09-04',
			  activity: 'watching news',
			  comment:  'things',
			  name:     'Bart Harlowe'
			}
			]

			let activities2 = [
			{
			  date:     '2013-08-23',
			  activity: 'dinner',
			  comment:  'doing things for fun',
			  name:     'Henry Alberto'
			}

			]

			$('.activities').render(activities2)

			$('.clicker').click( function() {
				//alert("yo");
			   $(".activities").render(activities);
			});
		});