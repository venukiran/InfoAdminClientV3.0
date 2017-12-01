(function() {
    var app = angular.module('infoBus');
    var screenPositionCtrl = function($scope, request, ctrlComm, $location) {
        console.log("-------------- screenPositionCtrl -------------------");
        $scope.tabActive('screenPosition');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
        $scope.position = {};
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

        if (window.location.hash == "#/Screen-Position-List") {
            /*$scope.screenPositionList = [{
                "CITY": "Vijayawada",
                "LOCATION": "Bandar",
                "CITY_ID": "1",
                "LOC_ID": "1",
                "PLATFORM": "Platform - 1",
                "PLATFORM_ID": "1",
                "SCREEN": "TPT-SRIHARI-1",
                "SCREEN_ID": "1",
                "AREA": "Test1",
                "ORIENTATION": "Horizontal"
            }, {
                "CITY": "Anantapur",
                "LOCATION": "Anantapur",
                "CITY_ID": "4",
                "LOC_ID": "2",
                "PLATFORM": "Platform - 2",
                "PLATFORM_ID": "2",
                "SCREEN": "TPT-SRIHARI-2",
                "SCREEN_ID": "2",
                "AREA": "Test2",
                "ORIENTATION": "Vertical"
            }]
            */
            $scope.loader(true);
            request.service('screenPosition', 'get', {}, {}, function(response) {
                $scope.loader(false);
                $scope.screenPositionList = response;

                $scope.totalItems = $scope.screenPositionList.length;
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
        } else if (window.location.hash == "#/Add-Screen-Position") {
            $scope.page.title = 'Add Screen Position';
            $scope.page.type = 'post';
            $scope.position.ORIENTATION = 'Horizontal';
        } else if (window.location.hash == "#/Update-Screen-Position") {
            $scope.page.title = 'Update Screen Position';
            $scope.page.type = 'put'
            prePoppulateValues(ctrlComm.get('positionObj'));
        }


        var addScreenPosition = function() {
            window.location.hash = "#/Add-Screen-Position";
        }

        function prePoppulateValues(positionObj) {
            if (positionObj) {
                $scope.position = positionObj;
            } else {
                window.location.hash = "#/Screen-Position-List";
            }
        }


        var saveScreenPosition = function(positionObj) {
            request.service('screenPosition', 'post', positionObj , {}, function(response) {
               console.log(response);
                $scope.loader(false);
                if(response.statusCode == 200){
                    $scope.notification("Saved Successfully..");
                    window.location.hash = '#/Screen-Position-List'
                }else{
                    $scope.notification("Not able to save, please contact Administrator..");
                }
            })            
        }

        var updateScreenPosition = function(positionObj) {
            request.service('screenPosition', 'put', positionObj , {}, function(response) {
               console.log(response);
                $scope.loader(false);
                if(response.statusCode == 200){
                    $scope.notification("Saved Successfully..");
                    window.location.hash = '#/Screen-Position-List'
                }else{
                    $scope.notification("Not able to save, please contact Administrator..");
                }
            })            
        }

        var editScreenPosition = function(positionObj) {
            ctrlComm.put('positionObj', positionObj);
            window.location.hash = "#/Update-Screen-Position";
        }


        var cancelScreenPosition = function() {
            window.location.hash = "#/Screen-Position-List";
        }

        var deleteScreenPosition = function(positionObj) {
            var input = {
                text: 'Are you sure you want to delete',
                name: positionObj.display_name
            }
            $scope.confirmation(input, function() {
                confirmDelete(positionObj);
            });
        }

        function confirmDelete(positionObj) {
            request.service('screenPosition', 'delete', positionObj.positionId , {}, function(response) {
               console.log(response);
                $scope.loader(false);
                if(response.statusCode == 200){
                    $scope.notification("Deleted Successfully..");
                    window.location.hash = '#/Add-Screen-Position'
                }else{
                    $scope.notification("Not able to delete, please contact Administrator..");
                }
            })
        }

        var showAlltableRows = function() {
            $scope.viewby = $scope.totalItems;
            $scope.setItemsPerPage($scope.viewby);
        }



        $scope.showAlltableRows = showAlltableRows;
        $scope.addScreenPosition = addScreenPosition;
        $scope.saveScreenPosition = saveScreenPosition;
        $scope.updateScreenPosition = updateScreenPosition;
        $scope.editScreenPosition = editScreenPosition;
        $scope.deleteScreenPosition = deleteScreenPosition;
        $scope.cancelScreenPosition = cancelScreenPosition;
    }
    app.controller('screenPositionCtrl', ['$scope', 'request', 'ctrlComm', '$location', screenPositionCtrl]);
}());
