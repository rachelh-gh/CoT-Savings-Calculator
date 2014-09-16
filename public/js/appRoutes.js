// public/js/appRoutes.js
	angular.module('appRoutes', ['ngAnimate', 'ui.router'])

	.config(function($stateProvider, $urlRouterProvider) {
	
	$stateProvider
	
		// route to show our basic form (/calculator)
		.state('calculator', {
			url: '/calculator',
			templateUrl: 'views/home.html',
			controller: 'CalculatorController'
		})
		
		// nested states 
		// each of these sections will have their own view
		// url will be nested (/calculator/welcome)
		.state('calculator.welcome', {
			url: '/welcome',
			templateUrl: 'views/welcome.html',
			
			
		})
		
		// url will be /calculator/pageone
		.state('calculator.pageone', {
			url: '/pageone:id',
			templateUrl: 'views/pageone.html'
		})
		
		// url will be /calculator/pagetwo
		.state('calculator.pagetwo', {
			url: '/pagetwo',
			templateUrl: 'views/pagetwo.html'
		})
		// url will be /calculator/results
		.state('calculator.results', {
			url: '/results',
			templateUrl: 'views/results.html'
		})
		.state('calculator.viewall', {
			url: '/viewall',
			templateUrl: 'views/viewall.html'
		})
		.state('calculator.report', {
        url: "/report/:resultId",
        templateUrl: 'views/report.html',
        controller: 'ReportController'
       
    });
		
	// catch all route
	// send users to the form page 
	$urlRouterProvider.otherwise('/calculator/welcome');
});



