 angular.module('ReportCtrl', []).controller('ReportController', ['$scope', 'Result', '$state', '$stateParams', function($scope, Result, $state, $stateParams) {
$('#viewAllBtn').hide();
$scope.reportId = $stateParams.resultId;
console.log($stateParams.resultId);
}]);