var owjs = require('overwatch-js');
//let jsonDetails;

const fs = require('fs');


owjs
    .getAll('pc', 'us', 'SuperFine-11919')
	//.then((data) => console.dir(data, {depth : 7, colors : true}) );
	.then((data) => {
			
			fs.writeFile("./tst.json", JSON.stringify(data), 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}

			console.log("The file was saved!");
			});
	});
	

	
owjs
    .getAll('pc', 'us', 'BERNAR-31452')
	//.then((data) => console.dir(data, {depth : 7, colors : true}) );
	.then((data) => {
			
			fs.writeFile("./tst2.json", JSON.stringify(data), 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}

			console.log("The file was saved!");
			});
	});

owjs
    .getAll('pc', 'us', 'Tae-2464')
	//.then((data) => console.dir(data, {depth : 7, colors : true}) );
	.then((data) => {
			
			fs.writeFile("./tst3.json", JSON.stringify(data), 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}

			console.log("The file was saved!");
			});
	});
