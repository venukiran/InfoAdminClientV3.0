(function() {
    var app = angular.module('infoBus');
    var slotBookingMasterCtrl = function($scope, request, ctrlComm, $location, $filter) {
        console.log("-------------- slotBookingMasterCtrl -------------------");
        $scope.tabActive('slotBookingMaster');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
        $scope.slotBookingList = {};
        $scope.slot = {};
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

        $scope.dropdownSettings = {
            scrollable: true,
            scrollableHeight: '350px',
            showCheckAll: true,
            showUncheckAll: true
        }

        $scope.translationText = {
            buttonDefaultText: '- Select Locations -',
        }

        $scope.locationOptions = [];
        $scope.selectedLocations = [];
        $scope.page = {};
        $scope.err = {};
        $scope.slotBookingList.startDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.slotBookingList.endDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.hoursObj = [
            '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'
        ]

        if (window.location.hash == "#/SlotBooking-List") {
            $scope.loader(true);
            $scope.getVideoList(function() {

                request.service('bookslots', 'get', {}, {}, function(response) {
                    $scope.loader(false);
                    $scope.slotBookingList = response;
                    angular.forEach($scope.slotBookingList, function(obj) {
                        //obj.locationName = $filter('filter')($scope.busStationList, { locationId: obj.locationId })[0].name;
                        obj.videoName = $filter('filter')($scope.videoList, { videoId: obj.videoId })[0].videoName;
                    })
                    $scope.totalItems = $scope.slotBookingList.length;
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
            });
        } else if (window.location.hash == "#/Add-Slot") {
            $scope.page.title = 'Add Slot';
            $scope.page.type = 'post';
            $scope.page.populateVideo = false;
            if(ctrlComm.get('videoName') != undefined){
                var videoName = ctrlComm.get('videoName')
                $scope.page.populateVideo = true;
                var videosList = $filter('filter')($scope.videoList, {videoName: videoName });
                var videosListLength = $filter('filter')($scope.videoList, {videoName: videoName }).length;
                $scope.slot.videoId = videosList[videosListLength-1].videoId;
                ctrlComm.del('videoName');
                //$scope.slot.videoId = 
            }
        } else if (window.location.hash == "#/Update-Slot") {
            $scope.page.title = 'Update Slot';
            $scope.page.type = 'put'
            console.log(ctrlComm.get('slotObj'))
            prePoppulateValues(ctrlComm.get('slotObj'));
        }

        $scope.getBusStationList(function() {
            angular.forEach($scope.busStationList, function(obj) {
                $scope.locationOptions.push({ id: obj.locationId, label: obj.name })
            })
        })

        var addSlot = function(slotObj) {
            window.location.hash = "#/Add-Slot";
        }

        function prePoppulateValues(slotObj) {
            if (slotObj) {
                slotObj.startTime = slotObj.startTime.split(':')[0];
                slotObj.endTime = slotObj.endTime.split(':')[0];
                $scope.slot = slotObj;
                angular.forEach(slotObj.locationId.split(','), function(obj) {
                    $scope.selectedLocations.push({ 'id': parseInt(obj) })
                })
            } else {
                window.location.hash = "#/SlotBooking-List";
            }
        }

        function validateSlotForm(cb) {
            if (!$scope.selectedLocations.length) {
                $scope.err.selectedLocations = true;
            } else {
                delete $scope.err.selectedLocations;
            }


            if (!$scope.slot.videoId) {
                $scope.err.videoId = true;
            } else {
                delete $scope.err.videoId;
            }

            if (!$scope.slot.startDate) {
                $scope.err.startDate = true;
            } else {
                delete $scope.err.startDate;
            }

            if (!$scope.slot.startTime) {
                $scope.err.startTime = true;
            } else {
                delete $scope.err.startTime;
            }
            if (!$scope.slot.endDate) {
                $scope.err.endDate = true;
            } else {
                delete $scope.err.endDate;
            }

            if (!$scope.slot.endTime) {
                $scope.err.endTime = true;
            } else {
                delete $scope.err.endTime;
            }

            if (!$scope.slot.repeatsPerDay) {
                $scope.err.repeatsPerDay = true;
            } else {
                delete $scope.err.repeatsPerDay;
            }

            if (Object.keys($scope.err).length == 0) {
                if (cb) cb();
            } else {
                console.log("ERROR OBJECT ", $scope.err);
            }
        }


        var saveSlot = function(slotObj) {
            validateSlotForm(function() {
                slotObj.startTime = slotObj.startTime + ':00:00';
                slotObj.endTime = slotObj.endTime + ':00:00';
                slotObj.bookedDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                slotObj.uploadedDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                slotObj.locationId = []
                angular.forEach($scope.selectedLocations, function(obj) {
                    slotObj.locationId.push(obj.id);
                })
                slotObj.locationId = slotObj.locationId.join()
                request.service('bookslots', 'post', slotObj, {}, function(response) {
                    console.log(response);
                    $scope.loader(false);
                    if (response.statusCode == 200) {
                        $scope.notification("Saved Successfully");
                        window.location.hash = '#/SlotBooking-List'
                    } else {
                        $scope.notification("Not able to save, please contact Administrator..");
                    }
                })
            })
        }

        var updateSlot = function(slotObj) {
            slotObj.startTime = slotObj.startTime + ':00:00';
            slotObj.endTime = slotObj.endTime + ':00:00';
            slotObj.bookedDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            slotObj.uploadedDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            slotObj.locationId = []
            angular.forEach($scope.selectedLocations, function(obj) {
                slotObj.locationId.push(obj.id);
            })
            slotObj.locationId = slotObj.locationId.join()
            request.service('bookslots', 'put', slotObj, {}, function(response) {
                console.log(response);
                $scope.loader(false);
                if (response.statusCode == 200) {
                    $scope.notification("Updated Successfully");
                    window.location.hash = '#/SlotBooking-List';
                } else {
                    $scope.notification("Not able to save, please contact Administrator..");
                }
            })
        }

        var editSlot = function(slotObj) {
            ctrlComm.put('slotObj', slotObj);
            window.location.hash = "#/Update-Slot";
        }


        var cancelSlot = function() {
            window.location.hash = "#/SlotBooking-List"
        }

        var deleteSlot = function(slotObj) {
            var input = {
                text: 'Are you sure you want to delete',
                name: slotObj.display_name
            }
            $scope.confirmation(input, function() {
                confirmDelete(slotObj);
            });
        }

        function confirmDelete(slotObj) {
            request.service('bookslots', 'delete', slotObj.slotBookId, {}, function(response) {
                console.log(response);
                $scope.loader(false);
                if (response.statusCode == 200) {
                    $scope.notification("Deleted Successfully");
                    $scope.getVideoList(function() {

                        request.service('bookslots', 'get', {}, {}, function(response) {
                            $scope.loader(false);
                            $scope.slotBookingList = response;
                            angular.forEach($scope.slotBookingList, function(obj) {
                                console.log(obj)
                                obj.locationName = $filter('filter')($scope.busStationList, { locationId: obj.locationId })[0].name
                                obj.videoName = $filter('filter')($scope.videoList, { videoId: obj.videoId })[0].videoName
                            })
                            $scope.totalItems = $scope.slotBookingList.length;
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
                    });
                } else {
                    $scope.notification("Not able to delete, please contact Administrator..");
                }
            })
        }

        var showAlltableRows = function() {
            $scope.viewby = $scope.totalItems;
            $scope.setItemsPerPage($scope.viewby);
        }

        $scope.chooseFile = function() {
            document.getElementById("upload-file-selector").click();
        }




        $scope.showAlltableRows = showAlltableRows;
        $scope.addSlot = addSlot;
        $scope.saveSlot = saveSlot;
        $scope.updateSlot = updateSlot;
        $scope.editSlot = editSlot;
        $scope.deleteSlot = deleteSlot;
        $scope.cancelSlot = cancelSlot;
    }
    app.controller('slotBookingMasterCtrl', ['$scope', 'request', 'ctrlComm', '$location', '$filter', slotBookingMasterCtrl]);
}());
