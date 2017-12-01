(function() {
    var app = angular.module('infoBus');
    var videoMasterCtrl = function($scope, request, ctrlComm, $location, $filter) {
        console.log("-------------- videoMasterCtrl -------------------");
        $scope.tabActive('videoMaster');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
        $scope.video = {};
        $scope.videoFile = false;
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
        $scope.video.start_date = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.video.end_date = $filter('date')(new Date(), 'yyyy-MM-dd');

        if (window.location.hash == "#/Video-List") {
            $scope.loader(true);
            $scope.getVideoList(function() {
                $scope.loader(false);
                $scope.totalItems = $scope.videoList.length;
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
        } else if (window.location.hash == "#/Add-Video") {
            $scope.page.title = 'Add Video';
            $scope.page.type = 'post';
            //$scope.video.sponserId = 1;
        } else if (window.location.hash == "#/Update-Video") {
            $scope.page.title = 'Update Video';
            $scope.page.type = 'put'
                //$scope.video.sponserId = 1;
            prePoppulateValues(ctrlComm.get('videoObj'));
        }

        var addVideo = function() {
            window.location.hash = "#/Add-Video";
        }

        function prePoppulateValues(videoObj) {
            if (videoObj) {
                if (videoObj.status == 'Active') {
                    videoObj.status = true;
                } else {
                    videoObj.status = false;
                }
                if (videoObj.videoName != undefined) {
                    $scope.videoFile = true;
                }
                console.log(videoObj)
                $scope.video = videoObj;
            } else {
                window.location.hash = "#/Video-List";
            }
        }

        function validateVideoForm(cb) {
            if (!$scope.video.sponserId) {
                $scope.err.sponserId = true;
            } else {
                delete $scope.err.sponserId;
            }
            console.log($scope.videoFile)
            if (!$scope.videoFile) {
                $scope.err.video = true;
            } else {
                delete $scope.err.video;
            }

            if (!$scope.video.orientation) {
                $scope.err.orientation = true;
            } else {
                delete $scope.err.orientation;
            }

            if (!$scope.video.videoCategory) {
                $scope.err.videoCategory = true;
            } else {
                delete $scope.err.videoCategory;
            }

            if (!$scope.video.validFrom) {
                $scope.err.validFrom = true;
            } else {
                delete $scope.err.validFrom;
            }
            if (!$scope.video.validTo) {
                $scope.err.validTo = true;
            } else {
                delete $scope.err.validTo;
            }

            if (Object.keys($scope.err).length == 0) {
                if (cb) cb();
            } else {
                console.log("ERROR OBJECT ", $scope.err);
            }
        }


        var saveVideo = function(videoObj) {
            validateVideoForm(function() {
                videoObj.uploadedDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                if(videoObj.status == true){
                    videoObj.status = 'Active';
                }else {
                    videoObj.status = 'InActive';
                }
                //videoObj.sponserId = 1;
                request.service('videos', 'post', videoObj, {}, function(response) {
                    console.log(response);
                    $scope.loader(false);
                    if (response.statusCode == 200) {
                        $scope.notification("Saved Successfully..");
                          ctrlComm.put('videoName', videoObj.videoName)
                        //window.location.hash = '#/Video-List'
                        window.location.hash = '#/Add-Slot';
                    } else {
                        $scope.notification("Not able to save, please contact Administrator..");
                    }
                })

            })
        }

        var updateVideo = function(videoObj) {
            validateVideoForm(function() {
                videoObj.uploadedDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                 if(videoObj.status == true){
                    videoObj.status = 'Active';
                }else {
                    videoObj.status = 'InActive';
                }
                request.service('videos', 'put', videoObj, {}, function(response) {
                    console.log(response);
                    $scope.loader(false);
                    if (response.statusCode == 200) {
                        $scope.notification("Updated Successfully..");
                        window.location.hash = '#/Video-List'
                    } else {
                        $scope.notification("Not able to save, please contact Administrator..");
                    }
                })
            })
        }

        var editVideo = function(videoObj) {
            ctrlComm.put('videoObj', videoObj);
            window.location.hash = "#/Update-Video";
        }


        var cancelVideo = function() {
            window.location.hash = "#/Video-List"
        }

        var deleteVideo = function(videoObj) {
            var input = {
                text: 'Are you sure you want to delete',
                name: videoObj.display_name
            }
            $scope.confirmation(input, function() {
                confirmDelete(videoObj);
            });
        }

        function confirmDelete(videoObj) {
            request.service('videos', 'delete', videoObj.videoId, {}, function(response) {
                console.log(response);
                $scope.loader(false);
                if (response.statusCode == 200) {
                    $scope.notification("Deleted Successfully..");
                    window.location.hash = '#/Add-Video'
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
        window.URL = window.URL || window.webkitURL;
        $('#upload-file-selector').change(function() {
            var file = this.files[0];
            $scope.video.videoName = file.name
            $scope.video.videoFormat = file.name.split('.')[1]
            $scope.video.fileSize = parseFloat(file.size / 1048576).toFixed(2);
            $scope.$apply()
            var duration;
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#preview').attr('src', e.target.result)

            }
            $scope.videoFile = true;
            reader.readAsDataURL(file);
            $scope.fileObj = file;
            var video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function() {
                window.URL.revokeObjectURL($('#preview').attr('src'))
                duration = video.duration;
                $scope.video.playTime = duration;
                $('#playTime').val(duration)
            }
            video.src = URL.createObjectURL(file);
            //$scope.loader(false);
        })






        $scope.showAlltableRows = showAlltableRows;
        $scope.addVideo = addVideo;
        $scope.saveVideo = saveVideo;
        $scope.updateVideo = updateVideo;
        $scope.editVideo = editVideo;
        $scope.deleteVideo = deleteVideo;
        $scope.cancelVideo = cancelVideo;
    }
    app.controller('videoMasterCtrl', ['$scope', 'request', 'ctrlComm', '$location', '$filter', videoMasterCtrl]);
}());
