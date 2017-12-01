(function() {
    var app = angular.module('infoBus');
    var serverCtrl = function($scope, request, ctrlComm, $location, $filter) {
        console.log("-------------- serverCtrl -------------------");
        $scope.tabActive('serverMaster');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
        $scope.server = {};
        $scope.totalItems = 0;
        $scope.tableRows = [5, 10, 15, 20, 30, 40];
        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };
        $scope.pageChanged = function() {
            // console.log('Page changed to: ' + $scope.currentPage);
        };
        $scope.setItemsPerPage = function(num) {
            $scope.itemsPerPage = num;
            $scope.currentPage = 1;
        }
        $scope.page = {};
        $scope.err = {};

        if (window.location.hash == "#/Server-List") {
            /* $scope.serverList = [{
                 "CITY": "Vijayawada",
                 "LOCATION": "Bandar",
                 "CITY_ID": "1",
                 "LOC_ID": "1",
                 "IP_ADDRESS": "192.168.0.108",
                 "HOST_NAME": "http",
                 "DREAMSTEP_URL": "http://192.168.0.108/infobus"
             }, {
                 "CITY": "Anantapur",
                 "LOCATION": "Anantapur",
                 "CITY_ID": "4",
                 "LOC_ID": "2",
                 "IP_ADDRESS": "192.168.0.129",
                 "HOST_NAME": "http",
                 "DREAMSTEP_URL": "http://192.168.0.129/infobus"
             }]*/
            $scope.loader(true);
            request.service('servers', 'get', {}, {}, function(response) {
                $scope.loader(false);
                $scope.serverList = response;
                angular.forEach($scope.serverList, function(obj) {
                    obj.locationName = $filter('filter')($scope.busStationList, { locationId: obj.locId })[0].name
                })

                $scope.totalItems = $scope.serverList.length;
                if ($scope.totalItems != 0 && $scope.tableRows.indexOf($scope.totalItems) == -1)
                    $scope.tableRows.push($scope.totalItems);

                if ($scope.totalItems != 0) {
                    $scope.tableRows = $scope.tableRows.sort(request.sort);
                    $scope.tableRows.splice($scope.tableRows.indexOf($scope.totalItems) + 1);
                    if ($scope.tableRows[1]) {
                        $scope.viewby = $scope.tableRows[1];
                    } else {
                        $scope.viewby = $scope.tableRows[0];
                    }
                    $scope.setItemsPerPage($scope.viewby);
                }
            })
        } else if (window.location.hash == "#/Add-Server") {
            $scope.page.title = 'Add Server';
            $scope.page.type = 'post';
        } else if (window.location.hash == "#/Update-Server") {
            $scope.page.title = 'Update Server';
            $scope.page.type = 'put'
            prePoppulateValues(ctrlComm.get('serverObj'));
        }


        var addServer = function() {
            window.location.hash = "#/Add-Server";
        }

        function prePoppulateValues(serverObj) {
            if (serverObj) {
                $scope.server = serverObj;
            } else {
                window.location.hash = "#/Server-List";
            }
        }


        function validateServerForm(cb) {
            if (!$scope.server.locId) {
                $scope.err.locId = true;
            } else {
                delete $scope.err.locId;
            }

            if (!$scope.server.ipAddress) {
                $scope.err.ipAddress = true;
            } else {
                delete $scope.err.ipAddress;
            }

            if (!$scope.server.hostName) {
                $scope.err.hostName = true;
            } else {
                delete $scope.err.hostName;
            }

            if (!$scope.server.dreamstepUrl) {
                $scope.err.dreamstepUrl = true;
            } else {
                delete $scope.err.dreamstepUrl;
            }

            if (!$scope.server.osType) {
                $scope.err.osType = true;
            } else {
                delete $scope.err.osType;
            }

            if (!$scope.server.osVersion) {
                $scope.err.osVersion = true;
            } else {
                delete $scope.err.osVersion;
            }


            if (Object.keys($scope.err).length == 0) {
                if (cb) cb();
            } else {
                console.log("ERROR OBJECT ", $scope.err);
            }
        }


        var saveServer = function(serverObj) {
            validateServerForm(function(){
            request.service('servers', 'post', serverObj, {}, function(response) {
                console.log(response);
                $scope.loader(false);
                if (response.statusCode == 200) {
                    $scope.notification("Saved Successfully..");
                    window.location.hash = '#/Server-List'
                } else {
                    $scope.notification("Not able to save, please contact Administrator..");
                }
            })
            })
        }

        var updateServer = function(serverObj) {
            validateServerForm(function(){
            request.service('servers', 'put', serverObj, {}, function(response) {
                console.log(response);
                $scope.loader(false);
                if (response.statusCode == 200) {
                    $scope.notification("Updated Successfully..");
                    window.location.hash = '#/Server-List'
                } else {
                    $scope.notification("Not able to save, please contact Administrator..");
                }
            })
        })
        }

        var editServer = function(serverObj) {
            ctrlComm.put('serverObj', serverObj);
            window.location.hash = "#/Update-Server";
        }


        var cancelServer = function() {
            window.location.hash = "#/Server-List";
        }

        var deleteServer = function(serverObj) {
            var input = {
                text: 'Are you sure you want to delete',
                name: serverObj.display_name
            }
            $scope.confirmation(input, function() {
                confirmDelete(serverObj);
            });
        }

        function confirmDelete(serverObj) {
            request.service('servers', 'delete', serverObj.serverId, {}, function(response) {
                console.log(response);
                $scope.loader(false);
                if (response.statusCode == 200) {
                    $scope.notification("Delted Successfully..");
                    window.location.hash = '#/Add-Server'
                } else {
                    $scope.notification("Not able to delete, please contact Administrator..");
                }
            })
        }

        var showAlltableRows = function() {
            $scope.viewby = $scope.totalItems;
            $scope.setItemsPerPage($scope.viewby);
        }



        $scope.showAlltableRows = showAlltableRows;
        $scope.addServer = addServer;
        $scope.saveServer = saveServer;
        $scope.updateServer = updateServer;
        $scope.editServer = editServer;
        $scope.deleteServer = deleteServer;
        $scope.cancelServer = cancelServer;
    }
    app.controller('serverCtrl', ['$scope', 'request', 'ctrlComm', '$location', '$filter', serverCtrl]);
}());
