var Result = require('./models/results');
var webshot = require('webshot');
var sha1 = require('sha1');

module.exports = function(app) {

		// server routes ===========================================================
		// handle things like api calls
		// authentication routes

		// sample api route
		app.get('/api/results', function(req, res) {

		// use mongoose to get all results in the database
		Result.find(function(err, results) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(results); // return all results in JSON format
		});
	});
	app.get('/api/results/:result_id', function(req, res) {

		// get a single result
		Result.findById(req.params.result_id, function(err, result) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(result); // return result in json format
		});
	});
	app.put('/api/results/:result_id', function(req, res) {

		// use our bear model to find the bear we want
		Result.findById(req.params.result_id, function(err, result) {
			if (err)
				res.send(err);

			result.emailAddress = req.body.emailAddress;
			result.calculatorData = req.body.calc;
			
			if (result.emailAddress){
				 // Create report
			  //webshot('<html><body>Hello '+ result.emailAddress + '</body></html>', 'hello_you.png', {siteType:'html'}, function(err) {
  				
				//});

				//webshot('http://localhost:8080/#/calculator/report/' + result._id, 'report.pdf', function(err) {
				  // screenshot now saved to google.png
				//});

				res.send(sha1("9RnZdX18Fh5p9KBr9zT76VIZRgi0fWrD" + result.emailAddress));
				//result.hash = sha1("9RnZdX18Fh5p9KBr9zT76VIZRgi0fWrD" + result.emailAddress);
			}

			
	

			// save the results
			result.save(function(err) {


				if (err)
					console.log('error');

			});

		});
	});

	


	
		// route to handle creating (app.post)
		app.post('/api/results', function(req, res) {

		// create a project, information comes from AJAX request from Angular
		Result.create({
			date: req.body.date,
			calculatorData:[],
			emailAddress: ""
		}, function(err, result) {
			
			if (err)
				res.send(err);

				res.json(result);
			// get and return all the results after you create another
			/*Result.find(function(err, results) {
				if (err)
					res.send(err)
				res.json(results);
			});*/
		});

	});
		// delete a result
	app.delete('/api/results/:result_id', function(req, res) {
		Result.remove({
			_id : req.params.result_id
		}, function(err, result) {
			if (err)
				res.send(err);

			// get and return all the projects after you create another
			Result.find(function(err, results) {
				if (err)
					res.send(err)
				res.json(results);
			});
		});
	});

	

		// frontend routes =========================================================
		// route to handle all angular requests
		app.get('*', function(req, res) {
			res.sendfile('./public/views/index.html'); // load our public/index.html file
		});

	};