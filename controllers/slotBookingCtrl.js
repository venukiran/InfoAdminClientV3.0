(function() {
    var app = angular.module('infoBus');
    var slotBookingCtrl = function($scope, request, ctrlComm, $location, $filter) {
        console.log("-------------- slotBookingCtrl -------------------");
        $scope.tabActive('slotBooking');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
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
        $scope.page = {};
        $scope.err = {};
        $scope.slot.start_date = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.slot.end_date = $filter('date')(new Date(), 'yyyy-MM-dd');
        $('#timepicker1').timepicker();
        $('#timepicker2').timepicker();

        if (window.location.hash == "#/Slot-Booking-List") {
            $scope.slotBookingList = [{
                "VIDEO_ID": "1",
                "VIDEO": "1",
                "VIDEO_NAME": "abc",
                "start_date": "2017-04-21",
                "end_date": "2017-04-23",
                "start_time": "11.30",
                "end_time": "06:20",
                "REPEATS_FOR_DAY": "20",
            }, {
                "VIDEO_ID": "2",
                "VIDEO": "2",
                "VIDEO_NAME": "xyz",
                "start_date": "2017-04-03",
                "end_date": "2017-04-12",
                "start_time": "02:35",
                "end_time": "10:30",
                "REPEATS_FOR_DAY": "25",
            }]
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
        } else if (window.location.hash == "#/Add-Slot") {
            $scope.page.title = 'Add Slot Booking';
            $scope.page.type = 'post';
        } else if (window.location.hash == "#/Update-Slot") {
            $scope.page.title = 'Update Slot Booking';
            $scope.page.type = 'put'
            prePoppulateValues(ctrlComm.get('slotObj'));
        }

        var addSlot = function() {
            window.location.hash = "#/Add-Slot";
        }

        function prePoppulateValues(slotObj) {
            if (slotObj) {
                $scope.slot = slotObj;
            } else {
                window.location.hash = "#/Slot-Booking-List";
            }
        }


        var saveSlot = function(slotObj) {}

        var updateSlot = function(slotObj) {}

        var editSlot = function(slotObj) {
            ctrlComm.put('slotObj', slotObj);
            window.location.hash = "#/Update-Slot";
        }


        var cancelSlot = function() {
            window.location.hash = "#/Slot-Booking-List"
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

        }

        var showAlltableRows = function() {
            $scope.viewby = $scope.totalItems;
            $scope.setItemsPerPage($scope.viewby);
        }


        $scope.showAlltableRows = showAlltableRows;
        $scope.addSlot = addSlot;
        $scope.saveSlot = saveSlot;
        $scope.updateSlot = updateSlot;
        $scope.editSlot = editSlot;
        $scope.deleteSlot = deleteSlot;
        $scope.cancelSlot = cancelSlot;
    }
    app.controller('slotBookingCtrl', ['$scope', 'request', 'ctrlComm', '$location', '$filter', slotBookingCtrl]);
}());
