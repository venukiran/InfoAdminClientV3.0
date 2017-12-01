(function() {
    var app = angular.module('infoBus');
    var screenMasterCtrl = function($scope, request, ctrlComm, $location) {
        console.log("-------------- screenMasterCtrl -------------------");
        $scope.tabActive('screenMaster');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
        $scope.screen = {};
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

        if (window.location.hash == "#/Screen-List") {

            $scope.loader(true);
            request.service('screens', 'get', {}, {}, function(response) {
                $scope.loader(false);
                $scope.screenList = response;

                $scope.totalItems = $scope.screenList.length;
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
        } else if (window.location.hash == "#/Add-Screen") {
            $scope.page.title = 'Add Screen';
            $scope.page.type = 'post';
            $scope.screen.ORIENTATION = 'Horizontal';
        } else if (window.location.hash == "#/Update-Screen") {
            $scope.page.title = 'Update Screen';
            $scope.page.type = 'put'
            prePoppulateValues(ctrlComm.get('screenObj'));
        }


        var addScreen = function() {
            window.location.hash = "#/Add-Screen";
        }

        function prePoppulateValues(screenObj) {
            if (screenObj) {
                $scope.screen = screenObj;
            } else {
                window.location.hash = "#/Screen-List";
            }
        }

        function validateScreen(cb) {
            if (!$scope.screen.name) {
                $scope.err.name = true;
            } else {
                delete $scope.err.name;
            }
            if (!$scope.screen.orientation) {
                $scope.err.orientation = true;
            } else {
                delete $scope.err.orientation;
            }

            if (!$scope.screen.resolution) {
                $scope.err.resolution = true;
            } else {
                delete $scope.err.resolution;
            }

             if (!$scope.screen.browserType) {
                $scope.err.browserType = true;
            } else {
                delete $scope.err.browserType;
            }

            if (!$scope.screen.version) {
                $scope.err.version = true;
            } else {
                delete $scope.err.version;
            }

            if (Object.keys($scope.err).length == 0) {
                if (cb) cb();
            } else {
                console.log("ERROR OBJECT ", $scope.err);
            }
        }


        var saveScreen = function(screenObj) {
            validateScreen(function() {
                request.service('screens', 'post', screenObj, {}, function(response) {
                    console.log(response);
                    $scope.loader(false);
                    if (response.statusCode == 200) {
                        $scope.notification("Saved Successfully..");
                        window.location.hash = '#/Screen-List'
                    } else {
                        $scope.notification("Not able to save, please contact Administrator..");
                    }
                })
            })
        }

        var updateScreen = function(screenObj) {
            validateScreen(function() {
                request.service('screens', 'put', screenObj, {}, function(response) {
                    console.log(response);
                    $scope.loader(false);
                    if (response.statusCode == 200) {
                        $scope.notification("Updated Successfully..");
                        window.location.hash = '#/Screen-List'
                    } else {
                        $scope.notification("Not able to save, please contact Administrator..");
                    }
                })
            })
        }

        var editScreen = function(screenObj) {
            ctrlComm.put('screenObj', screenObj);
            window.location.hash = "#/Update-Screen";
        }


        var cancelScreen = function() {
            window.location.hash = "#/Screen-List"
        }

        var deleteScreen = function(screenObj) {
            var input = {
                text: 'Are you sure you want to delete',
                name: screenObj.display_name
            }
            $scope.confirmation(input, function() {
                confirmDelete(screenObj);
            });
        }

        function confirmDelete(screenObj) {
            request.service('screens', 'delete', screenObj.screenId, {}, function(response) {
                console.log(response);
                $scope.loader(false);
                if (response.statusCode == 200) {
                    $scope.notification("Deleted Successfully..");
                    window.location.hash = '#/Add-Screen'
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
        $scope.addScreen = addScreen;
        $scope.saveScreen = saveScreen;
        $scope.updateScreen = updateScreen;
        $scope.editScreen = editScreen;
        $scope.deleteScreen = deleteScreen;
        $scope.cancelScreen = cancelScreen;
    }
    app.controller('screenMasterCtrl', ['$scope', 'request', 'ctrlComm', '$location', screenMasterCtrl]);
}());
