(function() {
    var app = angular.module('infoBus');
    var slotTrackerMasterCtrl = function($scope, request, ctrlComm, $location, $filter) {
        console.log("-------------- slotTrackerMasterCtrl -------------------");
        $scope.tabActive('slotTrackerMaster');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
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

        if (window.location.hash == "#/SlotTracker-List") {
            $scope.loader(true);
            $scope.getVideoList();
            request.service('slotTracker', 'get', {}, {}, function(response) {
                $scope.loader(false);
                console.log(response);
                $scope.slotTrackerList = response;
                angular.forEach($scope.slotTrackerList, function(obj) {
                    obj.locationName = $filter('filter')($scope.busStationList, { locationId: obj.locationId })[0].name
                    obj.videoName = $filter('filter')($scope.videoList, { videoId: obj.videoId })[0].videoName
                })

                $scope.totalItems = $scope.slotTrackerList.length;
                if ($scope.totalItems != 0 && $scope.tableRows.indexOf($scope.totalItems) == -1) {
                    $scope.tableRows.push($scope.totalItems);
                }

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
        } else if (window.location.hash == "#/Add-SlotTracker") {
            $scope.page.title = 'Add SlotTracker';
            $scope.page.type = 'post';
        } else if (window.location.hash == "#/Update-SlotTracker") {
            $scope.page.title = 'Update SlotTracker';
            $scope.page.type = 'put'
            prePoppulateValues(ctrlComm.get('slotTrackerObj'));
        }

        var addSlotTracker = function() {
            window.location.hash = "#/Add-SlotTracker";
        }

        function prePoppulateValues(slotTrackerObj) {
            if (slotTrackerObj) {
                $scope.SlotTracker = slotTrackerObj;
            } else {
                window.location.hash = "#/SlotTracker-List";
            }
        }


        var saveSlotTracker = function(slotTrackerObj) {
            /*request.service('sponsers', 'post', slotTrackerObj , {}, function(response) {
               console.log(response);
                $scope.loader(false);
                if(response.statusCode == 200){
                    $scope.notification("Saved Successfully..");
                    window.location.hash = '#/SlotTracker-List'
                }else{
                    $scope.notification("Not able to save, please contact Administrator..");
                }
            })*/
        }

        var updateSlotTracker = function(slotTrackerObj) {
            /*   request.service('sponsers', 'put', slotTrackerObj , {}, function(response) {
                  console.log(response);
                   $scope.loader(false);
                   if(response.statusCode == 200){
                       $scope.notification("Saved Successfully..");
                       window.location.hash = '#/SlotTracker-List'
                   }else{
                       $scope.notification("Not able to save, please contact Administrator..");
                   }
               })*/
        }

        var editSlotTracker = function(slotTrackerObj) {
            ctrlComm.put('slotTrackerObj', slotTrackerObj);
            window.location.hash = "#/Update-SlotTracker";
        }


        var cancelSlotTracker = function() {
            window.location.hash = "#/SlotTracker-List"
        }

        var deleteSlotTracker = function(slotTrackerObj) {
            var input = {
                text: 'Are you sure you want to delete',
                name: slotTrackerObj.display_name
            }
            $scope.confirmation(input, function() {
                confirmDelete(slotTrackerObj);
            });
        }

        function confirmDelete(slotTrackerObj) {
            /*request.service('sponsers', 'delete', slotTrackerObj.sponserId , {}, function(response) {
               console.log(response);
                $scope.loader(false);
                if(response.statusCode == 200){
                    $scope.notification("Deleted Successfully..");
                    window.location.hash = '#/Add-SlotTracker'
                }else{
                    $scope.notification("Not able to delete, please contact Administrator..");
                }
            })*/
        }

        var showAlltableRows = function() {
            $scope.viewby = $scope.totalItems;
            $scope.setItemsPerPage($scope.viewby);
        }



        $scope.showAlltableRows = showAlltableRows;
        $scope.addSlotTracker = addSlotTracker;
        $scope.saveSlotTracker = saveSlotTracker;
        $scope.updateSlotTracker = updateSlotTracker;
        $scope.editSlotTracker = editSlotTracker;
        $scope.deleteSlotTracker = deleteSlotTracker;
        $scope.cancelSlotTracker = cancelSlotTracker;
    }
    app.controller('slotTrackerMasterCtrl', ['$scope', 'request', 'ctrlComm', '$location', '$filter', slotTrackerMasterCtrl]);
}());
