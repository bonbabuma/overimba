

const mongo = require('mongodb').MongoClient;
const MONGOURI = 'mongodb://127.0.0.1:27017';


function Mongodatabase( database ) {
		let mongoClient;  
		let mongoDB;
		
		this.query = (collection, query, limit) => {
			return mongoDB.collection(collection).find( query ).limit( limit ).toArray();
		}
		
		this.replaceDocument = (collection, query, document) => {
			mongoDB.collection(collection).replaceOne(query, document,{upsert: true});
		}
		
		this.setDB = ( db ) => {
			if ( mongoClient != null) {
				mongoDB = mongoClient(db);
			} else {
				throw Error ('Connection has not been established.')
			}
		}

		this.close = () => {
			return mongoClient.close();
		}
		
		mongo.connect(MONGOURI, { useNewUrlParser: true } )
		.then( (client) => {
			mongoClient = client;
			mongoDB = mongoClient.db(database);
		})
		.catch( (error) => {
			console.log('ERROR:', error);
		});
}


module.exports = Mongodatabase;