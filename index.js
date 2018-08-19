//const mongoClient = require('mongodb').MongoClient;
const app = require('express')();
const url = 'mongodb://localhost:27017';
const owjs = require('overwatch-js');

//const db = client.db
app.set('view engine', 'pug');



app.get('/', (req, res) => {
	/*
	mongoClient.connect(url, function (err, client) {
		let collection = client.db('comics').collection('superheroes');
		
		
		collection.find({}).toArray((error, documents) => {
			console.log(documents);
			client.close();
			
			//res.send(documents);
			let docu = {};
			docu.heroArray = documents;
			
			res.render('index', docu);
		});
		
	});
	
	*/
	owjs
		.getOverall('pc', 'us', 'SuperFine-11919')
		//.then((data) => console.dir(data, {depth : 7, colors : true}) );
		.then((data) => {
				//console.log(data['quickplay']['heroes']['soldier:_76']);
				//console.log(data.quickplay.heroes['soldier:_76']);
				//console.log(data);
				//console.log(Date.now() - start);
				res.send(data);
		});
	
	
	
});


app.get('/bernar', (req, res) => {

	owjs
		.getOverall('pc', 'us', 'BERNAR-31452')
		//.then((data) => console.dir(data, {depth : 7, colors : true}) );
		.then((data) => {
				//console.log(data['quickplay']['heroes']['soldier:_76']);
				//console.log(data.quickplay.heroes['soldier:_76']);
				//console.log(data);
				//console.log(Date.now() - start);
				res.send(data);
		});
	
	
	
});


app.get('/tae', (req, res) => {

	owjs
		.getOverall('pc', 'us', 'Tae-2464')
		//.then((data) => console.dir(data, {depth : 7, colors : true}) );
		.then((data) => {
				//console.log(data['quickplay']['heroes']['soldier:_76']);
				//console.log(data.quickplay.heroes['soldier:_76']);
				//console.log(data);
				//console.log(Date.now() - start);
				res.send(data);
		});
	
	
	
});

app.get('/smurf', (req, res) => {

	owjs
		.getOverall('pc', 'us', 'smurf-31604')
		//.then((data) => console.dir(data, {depth : 7, colors : true}) );
		.then((data) => {
				//console.log(data['quickplay']['heroes']['soldier:_76']);
				//console.log(data.quickplay.heroes['soldier:_76']);
				//console.log(data);
				//console.log(Date.now() - start);
				res.send(data);
		});
	
	
	
});


app.get('/dawn', (req, res) => {

	owjs
		.getOverall('pc', 'us', 'Dauwniedd-2221')
		//.then((data) => console.dir(data, {depth : 7, colors : true}) );
		.then((data) => {
				//console.log(data['quickplay']['heroes']['soldier:_76']);
				//console.log(data.quickplay.heroes['soldier:_76']);
				//console.log(data);
				//console.log(Date.now() - start);
				res.send(data);
		});
	
	
	
});

app.get('/summit', (req, res) => {

	owjs
		.getOverall('pc', 'us', 'Summit-11688')
		//.then((data) => console.dir(data, {depth : 7, colors : true}) );
		.then((data) => {
				//console.log(data['quickplay']['heroes']['soldier:_76']);
				//console.log(data.quickplay.heroes['soldier:_76']);
				//console.log(data);
				//console.log(Date.now() - start);
				res.send(data);
		});
	
	
	
});






app.listen(3000, (err) => {
	if (err) {
		console.log('yo dawg, its been an error');
		return;
	}
	console.log('Example app listening on port 3000!');
});