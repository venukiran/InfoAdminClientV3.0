(function(){
	var app = angular.module('infoBus');
	var homeCtrl = function($scope, $rootScope, request){
		$scope.tabActive('dashboard');

		// $scope.dashboard = {
		// 	totalUsers:12323,
		// 	todayNewUsers:2837,
		// 	activeUsers:12102,
		// 	mwServiceStatus:'Active',
		// 	eliteCoreStatus:'Active',
		// 	msgQueue: 10,
		// 	lastActivities:[
		// 		{
		// 			time:'Just Now',
		// 			name:'Jordan Carter',
		// 			desc:'The trip was an amazing and a life changing experience!'
		// 		},
		// 		{
		// 			time: '5 min ago',
		// 			name:'Administrator',
		// 			desc:'Free courses for all our customers at A1 Conference Room - 9:00 am tomorrow!'
		// 		},
		// 		{
		// 			time:'15 min ago',
		// 			name:'Jordan Carter',
		// 			desc:'The trip was an amazing and a life changing experience!'
		// 		},
		// 		{
		// 			time: '25 min ago',
		// 			name:'Administrator',
		// 			desc:'Free courses for all our customers at A1 Conference Room - 9:00 am tomorrow!'
		// 		}
		// 	]
		// }

		var getDashboardData = function(){
			$scope.loader(true);
				$scope.loader(false);
			/*request.service('getUserInfo','post',$scope.admin, $scope.CONFIG,function(data){
				$scope.dashboard = data.userInfo;
			});*/

		}

		$scope.filterBooking = function(status){
			request.setItem('booking_filter', status);
		}


		$scope.clearFilterBooking = function(){
			if(request.getItem('booking_filter') != undefined){
				request.removeItem('booking_filter');
			}
		}

		if(window.location.hash == '#/Home'){
			getDashboardData();
		}
	}
	app.controller('homeCtrl',['$scope','$rootScope','request',homeCtrl]);
}());
