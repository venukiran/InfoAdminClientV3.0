(function() {
    var app = angular.module('infoBus');
    var roleMasterCtrl = function($scope, request, ctrlComm, $location) {
        console.log("-------------- roleMasterCtrl -------------------");
        $scope.tabActive('roleMaster');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
        $scope.plaform = {};
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



        if (window.location.hash == "#/RoleMaster-List") {
            
            $scope.loader(true);
            request.service('rolemasters', 'get', {}, {}, function(response) {
                $scope.loader(false);
                $scope.roleMasterList = response;

            $scope.totalItems = $scope.roleMasterList.length;
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
        } else if (window.location.hash == "#/Add-RoleMaster") {
            $scope.page.title = 'Add RoleMaster';
            $scope.page.type = 'post';
        } else if (window.location.hash == "#/Update-RoleMaster") {
            $scope.page.title = 'Update RoleMaster';
            $scope.page.type = 'put'
            prePoppulateValues(ctrlComm.get('roleObj'));
        }


        var addRoleMaster = function() {
            window.location.hash = "#/Add-RoleMaster";
        }

        function prePoppulateValues(roleObj) {
            if (rolemObj) {
                $scope.role = roleObj;
            } else {
                window.location.hash = "#/RoleMaster-List";
            }
        }


        var saveRoleMaster = function(platformObj) {
            request.service('platforms', 'post', platformObj , {}, function(response) {
               console.log(response);
                $scope.loader(false);
                if(response.statusCode == 200){
                    $scope.notification("Saved Successfully..");
                    window.location.hash = '#/RoleMaster-List'
                }else{
                    $scope.notification("Not able to save, please contact Administrator..");
                }
            })
        }

        var updateRoleMaster = function(platformObj) {
            request.service('platforms', 'put', platformObj , {}, function(response) {
               console.log(response);
                $scope.loader(false);
                if(response.statusCode == 200){
                    $scope.notification("Saved Successfully..");
                    window.location.hash = '#/RoleMaster-List'
                }else{
                    $scope.notification("Not able to save, please contact Administrator..");
                }
            })
        }

        var editRoleMaster = function(platformObj) {
            ctrlComm.put('platformObj', platformObj);
            window.location.hash = "#/Update-Platform";
        }


        var cancelRoleMaster = function() {
            window.location.hash = "#/Platform-List"
        }

        var deleteRoleMaster = function(platformObj) {
            var input = {
                text: 'Are you sure you want to delete',
                name: platformObj.display_name
            }
            $scope.confirmation(input, function() {
                confirmDelete(platformObj);
            });
        }

        function confirmDelete(platformObj) {
            request.service('platforms', 'delete', platformObj.platformId , {}, function(response) {
               console.log(response);
                $scope.loader(false);
                if(response.statusCode == 200){
                    $scope.notification("Deleted Successfully..");
                    window.location.hash = '#/Add-RoleMaster'
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
        $scope.addRoleMaster = addRoleMaster;
        $scope.saveRoleMaster = saveRoleMaster;
        $scope.updateRoleMaster = updateRoleMaster;
        $scope.editRoleMaster = editRoleMaster;
        $scope.deleteRoleMaster = deleteRoleMaster;
        $scope.cancelRoleMaster = cancelRoleMaster;
    }
    app.controller('platformMasterCtrl', ['$scope', 'request', 'ctrlComm', '$location', roleMasterCtrl]);
}());