(function() {
    var app = angular.module('infoBus');
    var platformMasterCtrl = function($scope, request, ctrlComm, $location, $filter) {
        console.log("-------------- platformMasterCtrl -------------------");
        $scope.tabActive('platformMaster');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
        $scope.platform = {};
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



        if (window.location.hash == "#/Platform-List") {
            $scope.loader(true);
            request.service('platforms', 'get', {}, {}, function(response) {
                $scope.loader(false);
                $scope.platformList = response;
                angular.forEach($scope.platformList, function(obj) {
                    obj.locationName = $filter('filter')($scope.busStationList, { locationId: obj.locId })[0].name
                })

                $scope.totalItems = $scope.platformList.length;
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
        } else if (window.location.hash == "#/Add-Platform") {
            $scope.page.title = 'Add Platform';
            $scope.page.type = 'post';
        } else if (window.location.hash == "#/Update-Platform") {
            $scope.page.title = 'Update Platform';
            $scope.page.type = 'put'
            prePoppulateValues(ctrlComm.get('platformObj'));
        }


        var addPlatform = function() {
            window.location.hash = "#/Add-Platform";
        }

        function prePoppulateValues(platformObj) {
            if (platformObj) {
                $scope.platform = platformObj;
            } else {
                window.location.hash = "#/Platform-List";
            }
        }

        function validatePlatform(cb) {
            if (!$scope.platform.name) {
                $scope.err.name = true;
            } else {
                delete $scope.err.name;
            }

            if (!$scope.platform.number) {
                $scope.err.number = true;
            } else {
                delete $scope.err.number;
            }

            if (!$scope.platform.locId) {
                $scope.err.locId = true;
            } else {
                delete $scope.err.locId;
            }

            if (Object.keys($scope.err).length == 0) {
                if (cb) cb();
            } else {
                console.log("ERROR OBJECT ", $scope.err);
            }
        }


        var savePlatform = function(platformObj) {
            validatePlatform(function() {
                request.service('platforms', 'post', platformObj, {}, function(response) {
                    console.log(response);
                    $scope.loader(false);
                    if (response.statusCode == 200) {
                        $scope.notification("Saved Successfully..");
                        window.location.hash = '#/Platform-List'
                    } else {
                        $scope.notification("Not able to save, please contact Administrator..");
                    }
                })
            })
        }

        var updatePlatform = function(platformObj) {
            validatePlatform(function() {
                request.service('platforms', 'put', platformObj, {}, function(response) {
                    console.log(response);
                    $scope.loader(false);
                    if (response.statusCode == 200) {
                        $scope.notification("Updated Successfully..");
                        window.location.hash = '#/Platform-List'
                    } else {
                        $scope.notification("Not able to save, please contact Administrator..");
                    }
                })
            })
        }

        var editPlatform = function(platformObj) {
            ctrlComm.put('platformObj', platformObj);
            window.location.hash = "#/Update-Platform";
        }


        var cancelPlatform = function() {
            window.location.hash = "#/Platform-List"
        }

        var deletePlatform = function(platformObj) {
            var input = {
                text: 'Are you sure you want to delete',
                name: platformObj.display_name
            }
            $scope.confirmation(input, function() {
                confirmDelete(platformObj);
            });
        }

        function confirmDelete(platformObj) {
            request.service('platforms', 'delete', platformObj.platformId, {}, function(response) {
                console.log(response);
                $scope.loader(false);
                if (response.statusCode == 200) {
                    $scope.notification("Deleted Successfully..");
                    window.location.hash = '#/Add-Platform'
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
        $scope.addPlatform = addPlatform;
        $scope.savePlatform = savePlatform;
        $scope.updatePlatform = updatePlatform;
        $scope.editPlatform = editPlatform;
        $scope.deletePlatform = deletePlatform;
        $scope.cancelPlatform = cancelPlatform;
    }
    app.controller('platformMasterCtrl', ['$scope', 'request', 'ctrlComm', '$location', '$filter', platformMasterCtrl]);
}());
