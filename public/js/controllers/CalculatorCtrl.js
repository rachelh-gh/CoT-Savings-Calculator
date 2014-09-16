// public/js/controllers/NerdCtrl.js
angular.module('CalculatorCtrl', []).controller('CalculatorController', ['$scope', 'Result', '$state',   function($scope, Result, $state, ngCsv) {

	var currentResult = {};


	$scope.formInvalid = false;
// GET =====================================================================
		// Get all results from the API
		Result.get()
			.success(function(data) {
				$scope.resultsapi = data;
				$scope.getCSV = data;
			});

// CREATE ==================================================================
		// Create a new results after clicking the begin button on the welcome page
		$scope.createResult = function() {
			
			if (currentResult._id == "" || !currentResult._id){
				// call the create function from our service (returns a promise object)
				Result.create({
					date: new Date()
				})

					// if successful creation, call our get function to get all the new Projects
					.success(function(data) {
						console.log(data);
						//save current result
						currentResult = data;
					});
			}		
		};
// Update ==================================================================
		// Add data to current result as it's inputted
		$scope.updateResult = function() {
				// call the create function from our service (returns a promise object)
				Result.update(currentResult._id, $scope.resultsData)

					// if successful creation, call our get function to get all the new Projects
					.success(function(data) {
						//$scope.postToMarketo(data);
					});
		};

		// DELETE ==================================================================
		// delete a result 
		$scope.deleteResult = function(id) {
			Result.delete(id)
				// if successful creation, call our get function to get all the new Projects
				.success(function(data) {
					$scope.resultsapi = data;
				});
		};
		console.log($scope.resultsapi);
	//Download Data as CSV
	$scope.getCSV = [{name:"me", age:"7"}];	

//add lead to marketo
$scope.postToMarketo = function(data){
	mktoMunchkinFunction('associateLead',
                       { Email: $scope.resultsData.emailAddress, LeadSource:"CoT Calculator"},
                       data);
};
		
	$scope.resultsData = {
		calc:[],
		emailAddress:""
	};				
	
	$scope.formData = {
		BuyerSchemesQantasAmex:false,
		BuyerSchemesVirgin:false
			/*domesticFlightsPerMonth:0,
			domesticFlightsAccomodationPercent:0,
			domesticFlightsAccomodationAvNights:0,
			domesticFlightsCarHirePercent:0,
			domesticFlightsCarHireAvDays:0,
			InternationalFlightsShortHaul:0,
			InternationalFlightsLongHaul:0,
			InternationalFlightsAccomodation:0,
			InternationalFlightsPremiumEconomy:0,
			InternationalFlightsBusinessClass:0*/
	};
	//question formula outcomes
	$scope.workings = {
		w1:0,
		w2:0,
		w3:0,
		w4:0,
		w5:0,
		w6:0,
		w7:0,
		w8:0,
		w9:0,
		w10:0,
		totalIntFlights:0

	};
	//totals object
	$scope.totals = {
		ttl:0
	};
	//savings object
	$scope.savings = {};

	//Domestic Flights per month
	$scope.w1= function(){
		$scope.workings.w1 = $scope.formData.domesticFlightsPerMonth*400*12;

		getT1();
	};
	//Percent of trips that require accomodation
	$scope.w2= function(){
		$scope.workings.w2 = ($scope.formData.domesticFlightsAccomodationPercent/100);
	};
	//Number of nights per trip domestic
	$scope.w3= function(){
		$scope.workings.w3 = $scope.formData.domesticFlightsAccomodationAvNights * 200 * 12 * $scope.workings.w2 * $scope.formData.domesticFlightsPerMonth;
		getT2();
	};
	//Percent of trips that require car hire
	$scope.w4= function(){
		$scope.workings.w4 = ($scope.formData.domesticFlightsCarHirePercent/100) * 33 * 12 * $scope.formData.domesticFlightsPerMonth;
		getT2();
	};
	//Car hire average days
	$scope.w5= function(){
		$scope.workings.w5 = $scope.formData.domesticFlightsCarHireAvDays;
		$scope.workings.w4 = $scope.workings.w4 * $scope.formData.domesticFlightsCarHireAvDays;
	};
	//Short Haul International trips
	$scope.w6= function(){
		$scope.workings.w6 = $scope.formData.InternationalFlightsShortHaul * 1200 * 12;
		$scope.workings.totalIntFlights = $scope.workings.w7 + $scope.workings.w6;
			};
	//Long Haul International trips
	$scope.w7= function(){
		$scope.workings.w7 = $scope.formData.InternationalFlightsLongHaul * 2500 * 12;
		$scope.workings.totalIntFlights = $scope.workings.w7 + $scope.workings.w6;
	};
	//Number of nights per trip International
	$scope.w8= function(){
		$scope.workings.w8 = $scope.formData.InternationalFlightsAccomodation * 200 * 12* ($scope.formData.InternationalFlightsLongHaul+$scope.formData.InternationalFlightsShortHaul);
		getT2();
	};
	//Percent of international flights that are Premium Economy 
	$scope.w9= function(){
		$scope.workings.w9 = ($scope.formData.InternationalFlightsPremiumEconomy/100) * 1.5 * $scope.workings.totalIntFlights;
		getT1();
	};
	//Percent of international flights that are Business CLass 
	$scope.w10= function(){
		$scope.workings.w10 = ($scope.formData.InternationalFlightsBusinessClass/100) * 3 * $scope.workings.totalIntFlights;
		getT1();
	};
	
	$scope.submitForm1 = function(form){
		if(form){
			$scope.w1();
			$scope.w2();
			$scope.w3();
			$scope.w4();
			$scope.w5();
			$scope.formInvalid = false;
			$state.go('calculator.pagetwo');

		} else {
			$('input.ng-invalid').css('border-color', 'red');
			$scope.formInvalid = true;
		}
	}
	$scope.submitForm2 = function(form){
		if(form){
			$scope.calculateResults();
			$scope.formInvalid = false;
			$state.go('calculator.results');

		} else {
			$('input.ng-invalid').css('border-color', 'red');
			$scope.formInvalid = true;
		}
	}
	$scope.calculateResults = function(){
		$scope.w6();
		$scope.w7();
		$scope.w8();
		$scope.w9();
		$scope.w10();
		$scope.savings.s1 = $scope.airfareRebate();
		$scope.savings.s2 = $scope.getS2();
		$scope.savings.s3 = $scope.getS3();
		$scope.resultsData.calc.push($scope.formData);
		$scope.formData = {
		BuyerSchemesQantasAmex:false,
		BuyerSchemesVirgin:false
	};
		$scope.percent = 0;
		$scope.updateResult();

		
	};
	//calculate total air travel whenever a relevant field changes
	var getT1 = function(){
		if(!$scope.workings.totalIntFlights){
			$scope.workings.totalIntFlights = 0;
		}
		
		$scope.totals.t1 = $scope.workings.totalIntFlights + $scope.workings.w9 + $scope.workings.w10 + $scope.workings.w1;
		//calculate total travel
		$scope.totals.ttl = $scope.totals.t2 + $scope.totals.t1;

		return $scope.totals.t1;
	};
	//calculate total land travel whenever a relevant field changes
	var getT2 = function(){
		$scope.totals.t2 = $scope.workings.w3 + $scope.workings.w4 + $scope.workings.w8;
		//calculate total travel
		$scope.totals.ttl = $scope.totals.t2 + $scope.totals.t1;
	};
	$scope.airfareRebate = function(){
		var ttl = $scope.totals.ttl;
		var s1 = 0;
		//If user has neither Buyer Scheme
		if ($scope.formData.BuyerSchemesQantasAmex == false && $scope.formData.BuyerSchemesVirgin == false){
			s1 = getRebateQA(ttl);
		}
		//If user has Virgin but not Qantas
		if ($scope.formData.BuyerSchemesQantasAmex == false && $scope.formData.BuyerSchemesVirgin == true){
			s1 = getRebateQA(ttl);
		}
		//If user has Qantas but not Virgin
		if ($scope.formData.BuyerSchemesVirgin == false && $scope.formData.BuyerSchemesQantasAmex == true){
			s1 = getRebateVA(ttl);
		}
		//If user has both 
		if ($scope.formData.BuyerSchemesVirgin == true && $scope.formData.BuyerSchemesQantasAmex == true){
			s1 = 0;
		}
		return s1;
		
	};
	//savings from reduction in car excess
	$scope.getS2 = function(){
		var s2 = ($scope.formData.domesticFlightsCarHirePercent/100) * $scope.formData.domesticFlightsCarHireAvDays * 12 * $scope.formData.domesticFlightsPerMonth * 16.5;
		
		return s2;
	};
	//Smart stay program
	$scope.getS3 = function(){
		
		var s3 =  0.12 * ($scope.workings.w3 + $scope.workings.w8);
		return s3;
	};
	//formula for Qantas Amex Buyer Scheme rebate
	var getRebateQA = function(ttl){
		var qa = 0;
		if (ttl <= 9999){
			var qa = 0;
		} else if (ttl >= 10000 && ttl <= 250000){
			qa = 0.02;
		} else if (ttl >= 250001 && ttl <= 500000){
			qa = 0.03;
		} else if (ttl >= 500001 && ttl <= 750000){
			qa = 0.04;
		} else if (ttl >= 750001){
			qa = 0.05;
		}
		return qa * ttl;
	};
	//formula for Virgin Accelerate Buyer Scheme rebate
	var getRebateVA = function(ttl){
		var va = 0;
		if (ttl <= 19999){
			var qa = 0;
		} else if (ttl >= 20000 && ttl <= 49999){
			va = 0.02;
		} else if (ttl >= 50000 && ttl <= 99999){
			va = 0.03;
		} else if (ttl >= 100000 && ttl <= 149999){
			va = 0.035;
		}  else if (ttl >= 150000 && ttl <= 199999){
			va = 0.04;
		} else if (ttl >= 200000 && ttl <= 249999){
			va = 0.045;
		} else if (ttl >= 250000){
			va = 0.05;
		}
		return va * ttl;
	};
	
	$scope.percent = 0;
	$scope.increasePercent = function(page){
		if (page==1){
		$scope.percent = 0;
	} else if(page==2){
		$scope.percent = 45;
		}
		$('input.ng-valid').each(function () {
	
    $scope.percent +=9;
    if($scope.percent>100){
    	$scope.percent = 100;
    }
});
			
	};
	
	
}]);
