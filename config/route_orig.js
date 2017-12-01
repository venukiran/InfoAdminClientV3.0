(function() {
    var app = angular.module('infoBus', ["ui.router", "ui.bootstrap", "ngMap", "angularjs-dropdown-multiselect"]);
    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/Home');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            })
            .state('Home', {
                url: '/Home',
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl'
            })
            .state('Bus-Station-List', {
                url: '/Bus-Station-List',
                templateUrl: 'templates/busStationList.html',
                controller: 'busStationMasterCtrl'
            })
            .state('Add-Bus-Station', {
                url: '/Add-Bus-Station',
                templateUrl: 'templates/busStationForm.html',
                controller: 'busStationMasterCtrl'
            })
            .state('Update-Bus-Station', {
                url: '/Update-Bus-Station',
                templateUrl: 'templates/busStationForm.html',
                controller: 'busStationMasterCtrl'
            })
             .state('Platform-List', {
                url: '/Platform-List',
                templateUrl: 'templates/platformList.html',
                controller: 'platformMasterCtrl'
            })
            .state('Add-Platform', {
                url: '/Add-Platform',
                templateUrl: 'templates/platformForm.html',
                controller: 'platformMasterCtrl'
            })
            .state('Update-Platform', {
                url: '/Update-Platform',
                templateUrl: 'templates/platformForm.html',
                controller: 'platformMasterCtrl'
            })
            .state('Screen-List', {
                url: '/Screen-List',
                templateUrl: 'templates/screenList.html',
                controller: 'screenMasterCtrl'
            })
            .state('Add-Screen', {
                url: '/Add-Screen',
                templateUrl: 'templates/screenForm.html',
                controller: 'screenMasterCtrl'
            })
            .state('Update-Screen', {
                url: '/Update-Screen',
                templateUrl: 'templates/screenForm.html',
                controller: 'screenMasterCtrl'
            })
            .state('Screen-Position-List', {
                url: '/Screen-Position-List',
                templateUrl: 'templates/screenPositionList.html',
                controller: 'screenPositionCtrl'
            })
            .state('Add-Screen-Position', {
                url: '/Add-Screen-Position',
                templateUrl: 'templates/screenPositionForm.html',
                controller: 'screenPositionCtrl'
            })
            .state('Update-Screen-Position', {
                url: '/Update-Screen-Position',
                templateUrl: 'templates/screenPositionForm.html',
                controller: 'screenPositionCtrl'
            })
            .state('Sponsor-List', {
                url: '/Sponsor-List',
                templateUrl: 'templates/sponsorList.html',
                controller: 'sponsorMasterCtrl'
            })
            .state('Add-Sponsor', {
                url: '/Add-Sponsor',
                templateUrl: 'templates/sponsorForm.html',
                controller: 'sponsorMasterCtrl'
            })
            .state('Update-Sponsor', {
                url: '/Update-Sponsor',
                templateUrl: 'templates/sponsorForm.html',
                controller: 'sponsorMasterCtrl'
            })
            .state('Video-List', {
                url: '/Video-List',
                templateUrl: 'templates/videoList.html',
                controller: 'videoMasterCtrl'
            })
            .state('Add-Video', {
                url: '/Add-Video',
                templateUrl: 'templates/videoForm.html',
                controller: 'videoMasterCtrl'
            })
            .state('Update-Video', {
                url: '/Update-Video',
                templateUrl: 'templates/videoForm.html',
                controller: 'videoMasterCtrl'
            })
            .state('Scroll-Text-List', {
                url: '/Scroll-Text-List',
                templateUrl: 'templates/scrollTextList.html',
                controller: 'scrollTextCtrl'
            })
            .state('Add-Scroll-Text', {
                url: '/Add-Scroll-Text',
                templateUrl: 'templates/scrollTextForm.html',
                controller: 'scrollTextCtrl'
            })
            .state('Update-Scroll-Text', {
                url: '/Update-Scroll-Text',
                templateUrl: 'templates/scrollTextForm.html',
                controller: 'scrollTextCtrl'
            })
            .state('Server-List', {
                url: '/Server-List',
                templateUrl: 'templates/serverList.html',
                controller: 'serverCtrl'
            })
            .state('Add-Server', {
                url: '/Add-Server',
                templateUrl: 'templates/serverForm.html',
                controller: 'serverCtrl'
            })
            .state('Update-Server', {
                url: '/Update-Server',
                templateUrl: 'templates/serverForm.html',
                controller: 'serverCtrl'
            })
            .state('SlotTracker-List', {
                url: '/SlotTracker-List',
                templateUrl: 'templates/slotTrackerList.html',
                controller: 'slotTrackerMasterCtrl'
            })
             .state('SlotBooking-List', {
                url: '/SlotBooking-List',
                templateUrl: 'templates/slotBookingList.html',
                controller: 'slotBookingMasterCtrl'
            })
            .state('Add-Slot', {
                url: '/Add-Slot',
                templateUrl: 'templates/slotBookingForm.html',
                controller: 'slotBookingMasterCtrl'
            })
            .state('Update-Slot', {
                url: '/Update-Slot',
                templateUrl: 'templates/slotBookingForm.html',
                controller: 'slotBookingMasterCtrl'
            })

    });


    app.config(function($provide) {
        $provide.decorator('$uiViewScroll', function($delegate) {
            return function(uiViewElement) {
                // var top = uiViewElement.getBoundingClientRect().top;
                // window.scrollTo(0, (top - 30));
                // Or some other custom behaviour...
            };
        });
    });
}());
