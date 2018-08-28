const mongoClient = require('mongodb').MongoClient;
const MONGOURI = 'mongodb://admin:MonsterEnergy3197@127.0.0.1:27017';




let database = function () {

	
	mongoClient.connect(url, function (err, client) {
		let collection = client.db('players').collection('stats');
		
		//find the shiznits
		collection.find({}).toArray((error, documents) => {
			console.log(documents);
			client.close();
			
			//res.send(documents);
			let docu = {};
			docu.Stats = documents;
			
			res.render('index', docu);
		});
		
	});
}
