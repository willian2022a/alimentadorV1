const express = require('express');
const server = express();
const router = express.Router();
const cors = require('cors');
const fs = require('fs');


var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});


server.use(express.json({ extended: true }))

server.use((request, response, next) => {
	response.header("Access-Control-Allow-Origin","*");
	response.header("Access-Control-Methods","GET,PUT,POST,DELETE");
	response.header("Access-Control-Headers","*");
	server.use(cors());
	next();
})

server.use(router)

router.get('/transactions', (request,response) => {
	console.log('GET transactions');
	admin.firestore()
		.collection('transactions')
		.get()
		.then(snapshot =>  {
			const transactions = snapshot.docs.map(doc => ({
				...doc.data(),
				uid: doc.id
			}))
			response.json(transactions)
		})
})


server.listen(3000, () => {
	console.log('Rodando Servidor')
})