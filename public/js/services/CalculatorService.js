angular.module('CalculatorService', []).factory('Result', ['$http',  function($http) {

	return {
		// call to get all results
		get : function() {
			return $http.get('/api/results');
		},

		// call to POST and create a new results
		create : function(resultsData) {
			return $http.post('/api/results', resultsData);
		},

		// call to PUT and update the current result
		update : function(id, resultsData) {
			//console.log(id);
			return $http.put('/api/results/' + id, resultsData);
		},

		// call to DELETE a result
		delete : function(id) {
			return $http.delete('/api/results/' + id);
		}
	}

	

}]);


