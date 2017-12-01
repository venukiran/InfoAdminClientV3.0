	(function() {
	    var app = angular.module('infoBus');
	    var mainCtrl = function($scope, $rootScope, request, ctrlComm, $modal, $http, $filter, $timeout, $log) {
	        $scope.appUsersList = [];
	        $scope.admin = {};
	        $scope.appMasterList = false;

	        $scope.tabActive = function(tab, parentTab) {
	            $scope.activeTab = {};
	            $scope.activeTab[tab] = true;
	            $scope.activeTab.tab = parentTab;
	            if (!$scope.loginStatus) window.location.hash = "/login"
	        }

	        $scope.notification = function(text, type, title, delay) {
	            if (!type) type = 'info';
	            if (!title) title = 'Notification';
	            if (!delay) delay = 3000;
	            $.bootstrapGrowl('<h4> ' + title + ' </h4> <p> ' + text + ' </p>', {
	                type: type,
	                delay: delay,
	                allow_dismiss: true,
	                width: 'auto'
	            });
	        }

	        $scope.loader = function(status) {
	            if (status) {
	                $scope.NProgress = true;
	                NProgress.start();
	            } else {
	                $scope.NProgress = false;
	                NProgress.done();
	                //document.getElementById('loader').style.display = none;
	            }
	        }





	        function checkAppSelection() {
	            if (!$scope.admin.appId) {
	                $scope.selApp = $scope.appMasterList[0];
	                $scope.admin.appId = $scope.selApp.app_id;
	                $scope.admin.appName = $scope.selApp.app_name;
	                request.setObj('selectedApp', $scope.selApp);
	            }
	        }

	        $scope.loadDashboard = function() {

	        }



	        $scope.initServices = function() {
	            $scope.getBusStationList();
	            $scope.getSponsorList();
	            $scope.getVideoList();
	        }




	        $scope.logout = function(status) {
	            if (status) {
	                var input = { text: 'Are you sure you want to', name: 'logout' };
	                $scope.confirmation(input, function() {
	                    request.removeItem('loginStatus');
	                    request.removeItem('displayName');
	                    location.reload();
	                });
	            } else {
	                request.removeItem('loginStatus');
	                request.removeItem('displayName');
	                location.reload();
	            }
	        }

	        var confirmation = function(input, cb) {
	            //if (cb) cb(status);
	            var modalInstance = $modal.open({
	                animation: true,
	                templateUrl: 'templates/confirmBox.html',
	                controller: 'confirmBoxCtrl',
	                size: 'md',
	                resolve: {
	                    input: function() {
	                        return { text: input.text, name: input.name };
	                    }
	                }
	            });
	            modalInstance.result.then(function(status) {
	                if (cb) cb(status);
	            }, function() {
	                $log.info('Modal dismissed at: ' + new Date());
	            });
	        }


	        $scope.citiesList = [{
	                "id": 1,
	                "name": "Vijayawada"
	            }, {
	                "id": 2,
	                "name": "Guntur"
	            }, {
	                "id": 3,
	                "name": "Tadepalli Gudem"
	            }, {
	                "id": 4,
	                "name": "Anantapur"
	            }, {
	                "id": 5,
	                "name": "Amalapuram"
	            },

	        ]

	        /*        $scope.busStationList = [
	                [
	        		  {
	        		    "locationId": 1,
	        		    "name": "VIJAYAWADA",
	        		    "address1": "Bandar Road",
	        		    "address2": "Vijayawada Central BusStand",
	        		    "cityName": "Vijayawada",
	        		    "district": "Vijayawada",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": "123456",
	        		    "contactPerson": "Venkat",
	        		    "phone": "1234",
	        		    "email": "xyz@safe.com"
	        		  },
	        		  {
	        		    "locationId": 2,
	        		    "name": "ANANTAPUR",
	        		    "address1": "Anantapur",
	        		    "address2": "Anantapur Bus Stand",
	        		    "cityName": "Anantapur",
	        		    "district": "Anantapur",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": "bahubali",
	        		    "phone": "23456",
	        		    "email": "xyz@safe.com"
	        		  },
	        		  {
	        		    "locationId": 3,
	        		    "name": "BHIMAVARAM",
	        		    "address1": "Bhimavaram",
	        		    "address2": "Bhimavaram Bus Stand",
	        		    "cityName": "Bhimavaram Town",
	        		    "district": "West Godavari",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 6,
	        		    "name": "NANDYAL",
	        		    "address1": "Nandyal",
	        		    "address2": "Nandyal Bus Stand",
	        		    "cityName": "Nandyal",
	        		    "district": "Kurnool",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 11,
	        		    "name": "ELURU",
	        		    "address1": "Eluru",
	        		    "address2": "Eluru Bus Stand",
	        		    "cityName": "Eluru",
	        		    "district": "West Godavari",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 18,
	        		    "name": "RAJAMUNDRY",
	        		    "address1": "Rajamundry",
	        		    "address2": "Rajamundry Bus Stand",
	        		    "cityName": "Rajamundry",
	        		    "district": "East Godavari",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 19,
	        		    "name": "DWARAKA NAGAR",
	        		    "address1": "Dwaraka Nagar ",
	        		    "address2": "Dwaraka Nagar Bus Stand",
	        		    "cityName": "Visakhapatnam",
	        		    "district": "Visakhapatnam",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 21,
	        		    "name": "KURNOOL",
	        		    "address1": "Kurnool",
	        		    "address2": "Kurnool Bus Stand",
	        		    "cityName": "Kurnool",
	        		    "district": "Kurnool",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 31,
	        		    "name": "CHITTOOR",
	        		    "address1": "Chitoor",
	        		    "address2": "Chitoor Bus Stand",
	        		    "cityName": "Chitoor",
	        		    "district": "Chitoor",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 33,
	        		    "name": "JANGA REDDY GUDEM",
	        		    "address1": "Janga Reddy Gudem",
	        		    "address2": "Janga Reddy Gudem Bus Stand",
	        		    "cityName": "Janga Reddy Gudem",
	        		    "district": "West Godavari",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": "Venkat",
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 41,
	        		    "name": "NELLORE",
	        		    "address1": "Nellore1",
	        		    "address2": "Nellore 1 Bus Stand",
	        		    "cityName": "Nellore",
	        		    "district": "Nellore",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 48,
	        		    "name": "HINDUPUR",
	        		    "address1": "Hindupur",
	        		    "address2": "Hindupur Bus Stand",
	        		    "cityName": "Hindupur",
	        		    "district": "Anantapur",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 53,
	        		    "name": "TADEPALLI GUDEM",
	        		    "address1": "Tadepalli Gudem",
	        		    "address2": "Tadepalli Gudem Bus Stand",
	        		    "cityName": "Tadepalli Gudem",
	        		    "district": "West Godavari",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 56,
	        		    "name": "KAKINADA",
	        		    "address1": "Kakinada",
	        		    "address2": "Kakinada Bus Stand",
	        		    "cityName": "Kakinada",
	        		    "district": "East Godavari",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 57,
	        		    "name": "RAVULAPALEM",
	        		    "email": null
	        		  },
	        		  {
	        		    "address1": "Ravulapalem",
	        		    "address2": "Ravulapalem Bus Stand",
	        		    "cityName": "Ravulapalem",
	        		    "district": "East Godavari",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "locationId": 58,
	        		    "name": "GUNTUR",
	        		    "address1": "Guntur",
	        		    "address2": "Guntur Bus Stand",
	        		    "cityName": "Guntur",
	        		    "district": "Guntur",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 59,
	        		    "name": "KADAPA",
	        		    "address1": "Kadapa",
	        		    "address2": "Kadapa Bus Stand",
	        		    "cityName": "Kadapa",
	        		    "district": "Kadapa",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 72,
	        		    "name": "AMALAPURAM",
	        		    "address1": "Amalapuram",
	        		    "address2": "Amalapuram Bus Stand",
	        		    "cityName": "Amalapuram",
	        		    "district": "East Godavari",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 74,
	        		    "name": "TUNI",
	        		    "address1": "Tuni",
	        		    "address2": "Tuni Bus Stand",
	        		    "cityName": "Tuni",
	        		    "district": "East Godavari",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 81,
	        		    "name": "NARASIPATNAM",
	        		    "address1": "Narasipatnam",
	        		    "address2": "Narasipatnam Bus Stand",
	        		    "cityName": "Narasipatnam",
	        		    "district": "Visakhapatnam",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 83,
	        		    "name": "PARVATHIPURAM",
	        		    "address1": "Parvathipuram",
	        		    "address2": "Parvathipuram Bus Stand",
	        		    "cityName": "Parvathipuram",
	        		    "district": "Vizianagaram",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 87,
	        		    "name": "TIRUMALA",
	        		    "address1": "Tirumala Road",
	        		    "address2": "Tirumala Central Bus Stand",
	        		    "cityName": "Tirupati",
	        		    "district": "Tirupati",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": "123456",
	        		    "contactPerson": "Venu",
	        		    "phone": "123",
	        		    "email": "abc@safe.com"
	        		  },
	        		  {
	        		    "locationId": 88,
	        		    "name": "ONGOLE",
	        		    "address1": "Ongole",
	        		    "address2": "Ongole Bus Stand",
	        		    "cityName": "Ongole",
	        		    "district": "Prakasam",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 93,
	        		    "name": "NIDADAVOLU",
	        		    "address1": "Nidadavolu",
	        		    "address2": "Nidadavolu Bus Stand",
	        		    "cityName": "Nidadavolu",
	        		    "district": "West Godavari",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 97,
	        		    "name": "TANUKU",
	        		    "address1": "Tanuku",
	        		    "address2": "Tanuku Bus Stand",
	        		    "cityName": "Tanuku",
	        		    "district": "West Godavari",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 100,
	        		    "name": "VIZIANAGARAM",
	        		    "address1": "Vizianagaram",
	        		    "address2": "Vizianagarm Bus Stand",
	        		    "cityName": "Vizianagaram",
	        		    "district": "Vizianagaram",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": "123456",
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 103,
	        		    "name": "MADDILAPALEM",
	        		    "address1": "Maddilapalem",
	        		    "address2": "Maddilapalem Bus Stand",
	        		    "cityName": "Visakhapatnam",
	        		    "district": "Visakhapatnam",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 104,
	        		    "name": "ANAKAPALLE",
	        		    "address1": "Anakapalle",
	        		    "address2": "Anakapalle Bus Stand",
	        		    "cityName": "Anakapalle",
	        		    "district": "Visakhapatnam",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 105,
	        		    "name": "ANNAVARAM",
	        		    "address1": "Annavaram",
	        		    "address2": "Annavaram Bus Stand",
	        		    "cityName": "Annavaram",
	        		    "district": "East Godavari",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 106,
	        		    "name": "SIMHACHALAM",
	        		    "address1": "Simhachalam",
	        		    "address2": "Simhachalam Bus Stand",
	        		    "cityName": "Visakhapatnam",
	        		    "district": "Visakhapatnam",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 111,
	        		    "name": "BOBBILI",
	        		    "address1": "Bobbili",
	        		    "address2": "Bobbili Bus Stand",
	        		    "cityName": "Vizianagaram",
	        		    "district": "Vizianagaram",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 119,
	        		    "name": "SRISAILAM",
	        		    "address1": "Srisailam",
	        		    "address2": "Srisailam Bus Stand",
	        		    "cityName": "Srisailam",
	        		    "district": "Kurnool",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 120,
	        		    "name": "NELLORE",
	        		    "address1": "Nellore2",
	        		    "address2": "Nellore Bus Stand",
	        		    "cityName": "Nellore",
	        		    "district": "Nellore",
	        		    "state": "Andhra Pradesh",
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 123,
	        		    "name": "Rayagada",
	        		    "address1": "Bandar Road",
	        		    "address2": "Rayagada Central BusStand",
	        		    "cityName": "Vijayawada",
	        		    "district": "Vijayawada",
	        		    "state": "Orissa",
	        		    "pincode": "123456",
	        		    "contactPerson": "Venkat",
	        		    "phone": "1234",
	        		    "email": "xyz@safe.com"
	        		  },
	        		  {
	        		    "locationId": 126,
	        		    "name": null,
	        		    "address1": null,
	        		    "address2": null,
	        		    "cityName": null,
	        		    "district": null,
	        		    "state": null,
	        		    "pincode": null,
	        		    "contactPerson": null,
	        		    "phone": null,
	        		    "email": null
	        		  },
	        		  {
	        		    "locationId": 127,
	        		    "name": "sdsds",
	        		    "address1": "sdsd",
	        		    "address2": "sds",
	        		    "cityName": "ssd",
	        		    "district": "sdsd",
	        		    "state": "sdasd",
	        		    "pincode": "sds",
	        		    "contactPerson": "sds",
	        		    "phone": "sds",
	        		    "email": "sds"
	        		  }
	        		]
	                ]*/

	        $scope.getBusStationList = function(cb) {
	            request.service('locations', 'get', {}, {}, function(response) {
	                $scope.busStationList = response;
	                if (cb) {
	                    cb();
	                }
	            })
	        }


	        $scope.getSponsorList = function(cb) {
	            request.service('sponsers', 'get', {}, {}, function(response) {
	                $scope.sponsorList = response;
	                if (cb) {
	                    cb();
	                }
	            })
	        }

	        $scope.getVideoList = function(cb) {
	            request.service('videos', 'get', {}, {}, function(response) {
	                $scope.videoList = response;
	                angular.forEach($scope.videoList, function(obj) {
	                    obj.sponserName = $filter('filter')($scope.sponsorList, { sponserId: obj.sponserId })[0].name
	                })
	                if (cb) {
	                    cb();
	                }
	            })
	        }


	        /*$scope.sponsorList = [{
	            "SPNSR_ID": "1",
	            "NAME": "NAME1",
	            "ADDRESS1": "Bandar Road",
	            "ADDRESS2": "Vijayawada Central BusStand",
	            "CITY_NAME": "Vijayawada",
	            "DISTRICT": "Vijayawada",
	            "STATE": "Andhra Pradesh",
	            "PINCODE": "123456",
	            "CONTACT_PERSON": "Venkat",
	            "PHONE": "1234",
	            "EMAIL": "xyz@safe.com"
	        }, {
	            "SPNSR_ID": "2",
	            "NAME": "NAME2",
	            "ADDRESS1": "Anantapur",
	            "ADDRESS2": "Anantapur Bus Stand",
	            "CITY_NAME": "Anantapur",
	            "DISTRICT": "Anantapur",
	            "STATE": "Andhra Pradesh",
	            "PINCODE": "212323",
	            "CONTACT_PERSON": "Rakesh",
	            "PHONE": "9839479447",
	            "EMAIL": "abc@gmail.com"
	        }]
   */
	        $scope.platformList = [{
	            "PLATFORM_ID": "1",
	            "NAME": "Platform-1",
	            "NUMBER": "1",
	            "CITY": "Vijayawada",
	            "LOCATION": "Bandar",
	            "CITY_ID": "1",
	            "LOC_ID": "1"
	        }, {
	            "PLATFORM_ID": "2",
	            "NAME": "Platform-2",
	            "NUMBER": "2",
	            "CITY": "Anantapur",
	            "LOCATION": "Anantapur",
	            "CITY_ID": "4",
	            "LOC_ID": "2"
	        }]

	        $scope.slotTrackerList = [{
	            "trackerId": 1,
	            "slotBookId": 1,
	            "slotDate": "2017-05-01",
	            "slotTime": "09:00:00",
	            "availableSlots": 180,
	            "bookedSlots": 30,
	            "balanceSlots": 150,
	            "totPlayTimePerHr": "15:00:00",
	            "repeatsPerHr": 5,
	            "locationId": 1,
	            "videoId": 1
	        }, {
	            "trackerId": 2,
	            "slotBookId": 1,
	            "slotDate": "2017-06-01",
	            "slotTime": "09:00:00",
	            "availableSlots": 180,
	            "bookedSlots": 30,
	            "balanceSlots": 150,
	            "totPlayTimePerHr": "15:00:00",
	            "repeatsPerHr": 5,
	            "locationId": 1,
	            "videoId": 1
	        }]

	        $scope.screenList = [{
	            "SCREEN_ID": "1",
	            "NAME": "TPT-SRIHARI-1",
	            "ORIENTATION": "Horizontal",
	            "width": "1920",
	            "height": "1080",
	            "BROWSER_TYPE": "Chrome",
	            "VERSION": "42.6"
	        }, {
	            "SCREEN_ID": "2",
	            "NAME": "TPT-SRIHARI-2",
	            "ORIENTATION": "Horizontal",
	            "width": "1920",
	            "height": "1080",
	            "BROWSER_TYPE": "Chrome",
	            "VERSION": "42.6"
	        }, {
	            "SCREEN_ID": "3",
	            "NAME": "TPT-SRIHARI-3",
	            "ORIENTATION": "Vertical",
	            "width": "1920",
	            "height": "1080",
	            "BROWSER_TYPE": "Firefox",
	            "VERSION": "35.0"
	        }]


	        $scope.loginToggle = function() {
	            if (request.getItem('loginStatus')) {
	                $scope.loginStatus = true;
	                $scope.admin.displayName = request.getItem('displayName');
	                $scope.initServices();
	            } else {
	                $scope.loginStatus = false;
	                window.location.hash = "/login"
	            }
	        }
	        $scope.loginToggle();

	        $scope.confirmation = confirmation;

	        $scope.gotoHome = function() { window.location.hash = "/Home" }
	        $scope.goToBusStationMaster = function() { window.location.hash = "/Bus-Station-List" }
	        $scope.goToPlatformMaster = function() { window.location.hash = "/Platform-List" }
	        $scope.goToScreenMaster = function() { window.location.hash = "/Screen-List" }
	        $scope.goToScreenPosition = function() { window.location.hash = "/Screen-Position-List" }
	        $scope.goToSponsorMaster = function() { window.location.hash = "/Sponsor-List" }
	        $scope.goToVideoMaster = function() { window.location.hash = "/Video-List" }
	        $scope.goToScrollText = function() { window.location.hash = "/Scroll-Text-List" }
	        $scope.goToServerMaster = function() { window.location.hash = "/Server-List" }
	        $scope.goToSlotTrackerMaster = function() { window.location.hash = "/SlotTracker-List" }
	        $scope.goToSlotBookingMaster = function() { window.location.hash = "/SlotBooking-List" }
	        $scope.goToUserMaster = function() { window.location.hash = "/UserMaster-List" }
	        $scope.goToReports = function() { window.location.hash = "/Reports"}

	    }
	    app.controller('mainCtrl', ['$scope', '$rootScope', 'request', 'ctrlComm', '$modal', '$http', '$filter', '$timeout', '$log', mainCtrl]);
	}());
