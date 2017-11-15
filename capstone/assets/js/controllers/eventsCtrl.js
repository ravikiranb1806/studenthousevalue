'use strict';
/** 
 * controller for Events
 */



/* Login */

app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        return $firebaseAuth();
    }
]);


app.directive('autoSubmitForm', ['$interpolate', function($interpolate) {
    return {
        replace: true,
        scope: {
            formData: '='
        },
        template: '',
        link: function($scope, element, $attrs) {
            $scope.$on($attrs['event'], function(event, data) {
                var form = $interpolate('<form action="{{formData.redirectUrl}}" method="{{formData.redirectMethod}}"><div><input name="id" type="text" type="hidden" value="{{formData.redirectData.id}}"/></div></form>')($scope);

            })
        }
    }
}]);



app.service('BuyTicketShowHide', function() {
    this.ticket_price = null;
})



app.service('currentEventMenu', function() {
    this.highlightsUrlactive = null;
    this.ScheduleUrlactive = null;


    this.EventUrlactive = null;
    this.ConnectUrlactive = null;



})



app.factory("Event", ["$firebaseArray",
    function($firebaseArray) {
        // create a reference to the database where we will store our data
        var ref = firebase.database().ref("Event");

        return $firebaseArray(ref);
    }
]);


app.controller("paymentCtrl", ["$scope", "$state", "$sce", "Event", "$stateParams", "$location", "$firebaseArray", "$rootScope", "BuyTicketShowHide", "currentEventMenu", "SweetAlert", "$http", "Auth", "$uibModal", function($scope, $state, $sce, Event, $stateParams, $location, $firebaseArray, $rootScope, BuyTicketShowHide, currentEventMenu, SweetAlert, $http, Auth, $uibModal) {



    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {

        if (firebaseUser == null) {

            alert('Some error occured');

        } else {




            firebase.database().ref('Transactions/').orderByChild('ticket_id').equalTo($stateParams.ticket_id).once('value').then(function(data) {


                data.forEach(function(childSnapshot) {

                    $scope.ui_ticket_id = childSnapshot.val().ticket_id;
                    $scope.ui_event_id = childSnapshot.val().event_id;




                    firebase.database().ref('Event/' + childSnapshot.val().event_id).once('value').then(function(data) {
                        $scope.ui_event_name = data.val().name;
                        $scope.ui_event_date = data.val().startdate;
                        $scope.ui_event_address = data.val().address;
                        $scope.ui_event_price = data.val().ticket_price;
                        $scope.ui_event_slug = data.val().slug;

                        $http.get('http://api-email.startupmasterclasspune.in:9000/', {
                            params: {
                                customerEmail: firebaseUser.email,
                                eventName: data.val().name,
                                eventTicketId: childSnapshot.val().ticket_id,
                                eventDate: data.val().startdate,
                                eventVenue: data.val().address,
                                eventBookedAt: "",
                                eventPrice: data.val().ticket_price,
                            },

                        });


                    });



                });

            });

        }

    });



}]);

app.controller("eventsNavCtrl", ["$scope", "$state", "$sce", "Event", "$stateParams", "$location", "$firebaseArray", "$rootScope", "BuyTicketShowHide", "currentEventMenu", "SweetAlert", "$http", "Auth", "$uibModal", function($scope, $state, $sce, Event, $stateParams, $location, $firebaseArray, $rootScope, BuyTicketShowHide, currentEventMenu, SweetAlert, $http, Auth, $uibModal) {




    $scope.formData = {
        redirectUrl: 'https://payment-gateway-url',
        redirectMethod: 'POST',
        redirectData: {
            id: 1,
            para1: 'para1'
        }
    };

    $scope.transaction = function() {
        $scope.$broadcast('gateway.redirect');
    };




    $scope.getClass = function(path) {


        path = path.replace("#", "");
        return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    }


    $scope.highlightsUrl = '#/app/pages/events/' + $stateParams.slug;
    $scope.scheduleUrl = '#/app/pages/schedule/' + $stateParams.slug;


    $rootScope.$on('currentEventMenuChnaged', function() {



        $scope.highlightsUrlactive = currentEventMenu.highlightsUrlactive;
        $scope.ScheduleUrlactive = currentEventMenu.ScheduleUrlactive;
        $scope.ticket_price = BuyTicketShowHide.ticket_price;
        $scope.EventUrlactive = currentEventMenu.EventUrlactive;
        $scope.ConnectUrlactive = currentEventMenu.ConnectUrlactive;



    });


    $rootScope.$on('BuyTicketShowHideChnaged', function() {

            $scope.ticket_price = BuyTicketShowHide.ticket_price;
      
      
    });


    $scope.EventArrObj = []

    firebase.database().ref('Event/').orderByChild('published').equalTo(true).once('value').then(function(data) {



        $scope.currentPageSlug = $stateParams.slug;


        data.forEach(function(childSnapshot) {



            if ($location.$$url == '/app/home' && childSnapshot.val().default == true) {


                currentEventMenu.highlightsUrlactive = 'active';
                currentEventMenu.ScheduleUrlactive = '';
                currentEventMenu.EventUrlactive = 'active';
                currentEventMenu.ConnectUrlactive = '';

                $rootScope.$broadcast('currentEventMenuChnaged');
                $scope.$apply(function() {

                    $scope.highlightsUrl = '#/app/pages/events/' + childSnapshot.val().slug;
                    $scope.scheduleUrl = '#/app/pages/schedule/' + childSnapshot.val().slug;

                });


                $scope.currentPageSlug = childSnapshot.val().slug;
            }

            $scope.SingleEvenObj = childSnapshot.val();
            $scope.SingleEvenObj.key = childSnapshot.key;
            $scope.EventArrObj.push($scope.SingleEvenObj);
        });



        $scope.EventArrObj = $scope.EventArrObj.sort(function(a, b) {
            return a.startdate - b.startdate;
        }).reverse();


        function findCurrentObject(obj) {
            return obj.slug === $scope.currentPageSlug;
        }

        $scope.EventArr = $scope.EventArrObj;


        $scope.$apply(function() {

            $scope.selectedOption = $scope.EventArrObj.find(findCurrentObject);

        });




        $scope.proceedPayment = function() {



            $scope.auth = Auth;
            $scope.auth.$onAuthStateChanged(function(firebaseUser) {

                if (firebaseUser == null) {
                    $scope.user_loggedin = false;
                    $scope.items = ['item1', 'item2', 'item3'];
                    $scope.modalInstance = $uibModal.open({

                        templateUrl: 'assets/views/smc-login_login.html',
                        controller: 'ModalInstanceCtrl',
                        size: "sm",
                       
                        keyboard: false,
                        resolve: {
                            items: function() {
                                return $scope.items;
                            }
                        }

                    });



                } else {

                    if ($scope.modalInstance) {
                        $scope.modalInstance.close();
                    }

                    $scope.user_loggedin = true;


                    SweetAlert.swal({


                            title: "Confirm purchasing ths ticket?",
                            text: "You will be redirected to the payment gateway",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Proceed",
                            cancelButtonText: "Cancel",
                            closeOnConfirm: true,
                            closeOnCancel: false


                        },

                        function(isConfirm) {
                            if (isConfirm) {

                                firebase.database().ref('User/'+firebaseUser.uid).once('value').then(function(Userdata) {




                                    var EventdateObj = new Date($scope.selectedOption.startdate * 1000);
                                    var Currdate = new Date();
                                    var CurrTime = Currdate.getTime();
                                    var ticket_id = ('0' + EventdateObj.getDate()).slice(-2) + '' + ('0' + EventdateObj.getMonth()).slice(-2) + '-' + Userdata.key.substring(0, 5) + '' + CurrTime.toString().slice(-5);



                                    var rp_pay_options = {

                                        "key": "rzp_test_KRQn2wwVUjheso",
                                        "amount": $scope.selectedOption.ticket_price * 100, // 2000 paise = INR 20
                                        "name": "Startup MasterClass",
                                        "description": $scope.selectedOption.name,
                                        "image": "https://oasthousemedia.co.uk/wp-content/uploads/2015/09/your-logo.jpg",
                                        "handler": function(response) {



                                            $scope.firebaseUser = firebaseUser;


                                            var ref = firebase.database().ref("Transactions/");
                                            $scope.transaction = $firebaseArray(ref);




                                            $scope.transaction.$add({
                                                transaction_id: response.razorpay_payment_id,
                                                event_id: $scope.selectedOption.key,
                                                user_id: Userdata.key,
                                                time: CurrTime,
                                                ticket_id: ticket_id
                                            });

                                            $location.path('app/payment-success/' + ticket_id);


                                        },
                                        "prefill": {
                                            "name": firebaseUser.displayName,
                                            "email": firebaseUser.email,
                                            "contact": Userdata.val().mobile
                                        },
                                        "notes": {
                                            "address": ""
                                        },
                                        "theme": {
                                            "color": "#F37254"
                                        }
                                    };

                                    var rzp1 = new Razorpay(rp_pay_options);
                                    rzp1.open();
                                    //e.preventDefault();

                                });
                            } else {



                                SweetAlert.swal({

                                    title: "Cancelled",
                                    text: ":(",
                                    type: "error",
                                    confirmButtonColor: "#007AFF"
                                });

                            }



                        });

                }


            });
        };




        $scope.update = function() {

            $scope.SelectedEventId = $scope.selectedOption.id;
            if ($state.current.title == 'Events') {
                $location.path('app/pages/events/' + $scope.selectedOption.slug);
            } else {
                $location.path('app/pages/schedule/' + $scope.selectedOption.slug);
            }

            $scope.highlightsUrl = '#/app/pages/events/' + $scope.selectedOption.slug;
            $scope.scheduleUrl = '#/app/pages/schedule/' + $scope.selectedOption.slug;

        }
    });


}]);


app.controller("eventsCtrl", ["$scope", "$state", "$sce", "Event", "$stateParams", "$location", "$firebaseArray", "$rootScope", "BuyTicketShowHide", "currentEventMenu", function($scope, $state, $sce, Event, $stateParams, $location, $firebaseArray, $rootScope, BuyTicketShowHide, currentEventMenu) {

    currentEventMenu.highlightsUrlactive = 'active';
    currentEventMenu.ScheduleUrlactive = '';
    currentEventMenu.EventUrlactive = 'active';
    currentEventMenu.ConnectUrlactive = '';



    $rootScope.$broadcast('currentEventMenuChnaged');



    $scope.iframeShowhide = 'block';



    if ($location.$$url == '/app/home') {

        firebase.database().ref('Event/').orderByChild('default').equalTo(true).once('value').then(function(snapshot) {

            snapshot.forEach(function(childSnapshot) {

                $scope.SelectedEventId = childSnapshot.key;
                $scope.SelectedEvenObj = childSnapshot.val();
                $scope.EventUrl = $scope.SelectedEvenObj.url

            });



            $scope.trustSrc = function(src) {

                return $sce.trustAsResourceUrl(src);
            };

            if (new Date($scope.SelectedEvenObj.startdate * 1000).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {

                BuyTicketShowHide.ticket_price = $scope.SelectedEvenObj.ticket_price;

            } else {
                BuyTicketShowHide.ticket_price = '';
            }

            $rootScope.$broadcast('BuyTicketShowHideChnaged');



            $scope.iframeShowhide = 'none';


        });


    } else

    {

        firebase.database().ref('Event/').orderByChild('slug').equalTo($stateParams.slug).once('value').then(function(snapshot) {

            snapshot.forEach(function(childSnapshot) {

                $scope.SelectedEventId = childSnapshot.key;
                $scope.SelectedEvenObj = childSnapshot.val();
                $scope.EventUrl = $scope.SelectedEvenObj.url
            });



            $scope.trustSrc = function(src) {

                return $sce.trustAsResourceUrl(src);
            };



            if (new Date($scope.SelectedEvenObj.startdate * 1000).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {

                BuyTicketShowHide.ticket_price = $scope.SelectedEvenObj.ticket_price;

            } else {
                BuyTicketShowHide.ticket_price = '';
            }

            $rootScope.$broadcast('BuyTicketShowHideChnaged');
            $scope.iframeShowhide = 'none';
        });


    }



    $scope.iframeHeight = window.innerHeight;


}]);