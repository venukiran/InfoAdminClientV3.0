(function() {
    var app = angular.module('infoBus');
    var loginCtrl = function($scope, $rootScope, request, $http) {
        $scope.err = {};
        $scope.err1 = {};
        $scope.showDiv = 'login';
        if (window.location.hash = "#/login") {
            if (request.getItem('appUserId')) {
                window.location.hash = "#/Home"
            }
            document.getElementById('page-content').style.minHeight = screen.height + 'px';
        }

        $scope.login = {};
        $scope.forgotObj = {};
        var error = false;

        $scope.resetPassword = function(email) {
            validation1(function() {
                var params = {};
                params.email = email;
                request.service('forgotPassword', 'post', params, {}, function(response) {
                    console.log(response)
                    if (response.statusCode == '300') {
                        $scope.notification(response.statusMessage);
                        $scope.showDiv = 'login';
                        $scope.forgotObj.email = '';
                    } else {
                        $scope.notification(response.statusMessage, 'danger');
                    }
                });
            })
        }


        var adminLogin = function(loginObj) {
            $scope.loader(true);
            request.service('login', 'post', loginObj, {}, function(response) {
                $scope.loader(false);   
                console.log(response)
                if(response.statusCode=='200'){
                    $scope.login = loginObj
                    request.setItem('loginStatus', "true");
                    request.setItem('displayName', $scope.login.userName);
                    window.location.hash = "#/"
                    $scope.loginToggle();
                }else {
                    $scope.login.userName="";
                    $scope.login.password="";                    
                    $scope.notification(response.statusMessage, 'danger');
                }
            });
            
        }

        $scope.adminLogin = adminLogin;
    }
    app.controller('loginCtrl', ['$scope', '$rootScope', 'request', '$http', loginCtrl]);
}());
