(function() {
    var app = angular.module('infoBus');
    var busStationMasterCtrl = function($scope, request, ctrlComm, $location) {
        console.log("-------------- busStationMasterCtrl -------------------");
        $scope.tabActive('busStationMaster');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
        $scope.busStation = {};
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

        if (window.location.hash == "#/Bus-Station-List") {
            $scope.loader(true);
            $scope.getBusStationList(function() {
                $scope.loader(false);
                $scope.totalItems = $scope.busStationList.length;
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

        } else if (window.location.hash == "#/Add-Bus-Station") {

            $scope.page.title = 'Add Bus Station';
            $scope.page.type = 'post';
        } else if (window.location.hash == "#/Update-Bus-Station") {
            $scope.page.title = 'Update Bus Station';
            $scope.page.type = 'put'
            prePoppulateValues(ctrlComm.get('busObj'));
        } else if (window.location.hash == '#/View-Bus-Station') {
            $scope.page.title = 'View Bus Station';
            $scope.page.type = 'view';
            prePoppulateValues(ctrlComm.get('busObj'));
        }

        var viewBusStation = function(busObj) {
            ctrlComm.put('busObj', busObj);
            window.location.hash = '#/View-Bus-Station';
        }

        var addBusStation = function() {
            window.location.hash = "#/Add-Bus-Station";
        }

        function prePoppulateValues(busObj) {
            console.log("busObj")
            if (busObj) {
                $scope.busStation = busObj;
            } else {
                window.location.hash = "#/Bus-Station-List";
            }
        }

        function validateBusStation(cb) {
            if (!$scope.busStation.name) {
                $scope.err.locationName = true;
            } else {
                delete $scope.err.locationName;
            }

            if (!$scope.busStation.address1) {
                $scope.err.address1 = true;
            } else {
                delete $scope.err.address1;
            }

            if (!$scope.busStation.district) {
                $scope.err.district = true;
            } else {
                delete $scope.err.district;
            }

            if (!$scope.busStation.cityName) {
                $scope.err.cityName = true;
            } else {
                delete $scope.err.cityName;
            }

            if (!$scope.busStation.state) {
                $scope.err.state = true;
            } else {
                delete $scope.err.state;
            }

            if (!$scope.busStation.pincode) {
                $scope.err.pincode = true;
            } else {
                if ($scope.busStation.pincode.length != 6) {
                    $scope.err.pincode_cdn = true;
                } else {
                    delete $scope.err.pincode;
                    delete $scope.err.pincode_cdn;
                }
            }

            if (!$scope.busStation.contactPerson) {
                $scope.err.contactPerson = true;
            } else {
                delete $scope.err.contactPerson;
            }

            if (!$scope.busStation.phone) {
                $scope.err.phone = true;
            } else {
                if ($scope.busStation.phone.length != 10) {
                    $scope.err.phone_cdn = true;
                } else {
                    delete $scope.err.phone;
                    delete $scope.err.phone_cdn;
                }
            }
            if (!$scope.busStation.email) {
                $scope.err.email = true;
            } else {
                if (!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).test($scope.busStation.email)) {
                    $scope.err.email_cdn = true;

                } else {
                    delete $scope.err.email;
                    delete $scope.err.email_cdn;
                }
            }

            if (Object.keys($scope.err).length == 0) {
                if (cb) cb();
            } else {
                console.log("ERROR OBJECT ", $scope.err);
            }
        }


        var saveBusStation = function(busObj) {
            validateBusStation(function() {
                request.service('locations', 'post', busObj, {}, function(response) {
                    console.log(response);
                    $scope.loader(false);
                    if (response.statusCode == 200) {
                        $scope.notification("Saved Successfully");
                        window.location.hash = '#/Bus-Station-List'
                    } else {
                        $scope.notification("Not able to save, please contact Administrator..");
                    }
                })
            })

        }

        var updateBusStation = function(busObj) {
            validateBusStation(function() {
            request.service('locations', 'put', busObj, {}, function(response) {
                console.log(response);
                $scope.loader(false);
                if (response.statusCode == 200) {
                    $scope.notification("Updated Successfully");
                    window.location.hash = '#/Bus-Station-List'
                } else {
                    $scope.notification("Not able to save, please contact Administrator..");
                }
            })
        })

        }

        var editBusStation = function(busObj) {
            ctrlComm.put('busObj', busObj);
            window.location.hash = "#/Update-Bus-Station";
        }


        var cancelBusStation = function() {
            window.location.hash = "#/Bus-Station-List"
        }

        var deleteBusStation = function(busObj) {
            console.log(busObj)
            var input = {
                text: 'Are you sure you want to delete',
                name: busObj.display_name
            }
            $scope.confirmation(input, function() {
                confirmDelete(busObj);
            });
        }

        function confirmDelete(busObj) {
            request.service('locations', 'delete', busObj.locationId, {}, function(response) {
                //console.log(response)
                $scope.loader(false);
                if (response.statusCode == 200) {
                    $scope.notification("Deleted Successfully");
                    window.location.hash = '#/Bus-Station-List';
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
        $scope.addBusStation = addBusStation;
        $scope.saveBusStation = saveBusStation;
        $scope.updateBusStation = updateBusStation;
        $scope.editBusStation = editBusStation;
        $scope.deleteBusStation = deleteBusStation;
        $scope.cancelBusStation = cancelBusStation;
        $scope.viewBusStation = viewBusStation;
    }
    app.controller('busStationMasterCtrl', ['$scope', 'request', 'ctrlComm', '$location', busStationMasterCtrl]);
}());
