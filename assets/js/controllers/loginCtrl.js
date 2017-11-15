    var app = angular.module("myApp", ["firebase"]);
var auth = {};
var refid = '';
var minlength = 12;
var minst = '';

/* Login */

app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        return $firebaseAuth();
    }
]);

app.service('TopProfileName', function() {
    this.userProfileName = null;
    this.userProfileImage = null;
})

app.factory("LoggedInUser", ["$firebaseArray",
    function($firebaseArray) {
        // create a reference to the database where we will store our data
        var ref = firebase.database().ref("User");
        return $firebaseArray(ref);

    }
]);




app.factory("Profile", ["$firebaseArray",
    function($firebaseArray) {

        // create a reference to the database where we will store our data
        var ref = firebase.database().ref("User/");

        return $firebaseArray(ref);
    }
]);

app.factory("CtProfile", ["$firebaseArray",
    function($firebaseArray) {


        var ref = firebase.database().ref("User/");

        return $firebaseArray(ref);
    }
]);

app.factory("StartupList", ["$firebaseArray",
    function($firebaseArray) {
        // create a reference to the database where we will store our data
        var ref = firebase.database().ref("User/").orderByChild("type").equalTo("startup");

        return $firebaseArray(ref);
    }
]);


app.factory("StudentsList", ["$firebaseArray",
    function($firebaseArray) {
        // create a reference to the database where we will store our data
        var ref = firebase.database().ref("User/").orderByChild("type").equalTo("student");
        //var ref = firebase.database().ref("User/");
        return $firebaseArray(ref);
    }
]);




app.factory("AccomodatorsList", ["$firebaseArray",
    function($firebaseArray) {
        // create a reference to the database where we will store our data
        var ref = firebase.database().ref("User/").orderByChild("type").equalTo("accomodator");
        //var ref = firebase.database().ref("User/");
        return $firebaseArray(ref);
    }
]);



app.factory("UserList", ["$firebaseArray",
    function($firebaseArray) {
        // create a reference to the database where we will store our data
        //var ref = firebase.database().ref("User/").orderByChild("type").equalTo("accomodator");
        var ref = firebase.database().ref("User/");
        return $firebaseArray(ref);
    }
]);

app.factory("AccreqList", ["$firebaseArray",
    function($firebaseArray) {
        // create a reference to the database where we will store our data
        //var ref = firebase.database().ref("User/").orderByChild("$id").equalTo("gnfgnsf");
        var ref = firebase.database().ref("AccomodatorRequests/");
        return $firebaseArray(ref);
    }
]);







app.controller("loginCtrl", ["$scope", "Auth", "$location", "$uibModal", "toaster", "TopProfileName", "$rootScope","$firebaseArray",
    function($scope, Auth, $location, $uibModal, toaster, TopProfileName, $rootScope,$firebaseArray) {






   $scope.getSiginOption = function()
    {


          var isMobile_j = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
              
              if (isMobile_j) {
                
                  Auth.$signInWithRedirect('google');
              } else
              {
                  Auth.$signInWithPopup('google');
              }



      
    }

        $scope.signout = function() {
            var amOnline = firebase.database().ref('.info/connected');
            var userRef = firebase.database().ref('presence/' + $scope.firebaseUser.uid);
            amOnline.on('value', function(snapshot) {

                if (snapshot.val()) {
                    userRef.remove();
                    // User is online, update UI.
                }
            });
            Auth.$signOut();
            $location.path("app/home");

            $scope.toaster = {
                type: 'success',
                title: 'Logged out Sucessfully',
                text: ''
            };

            toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);

        }


        $scope.items = ['item1', 'item2', 'item3'];

        $scope.openmodal = function(size) {

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'assets/views/login.html',
                controller: 'ModalInstanceCtrl',
                size: 'sm',
                keyboard:false,
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

            


        };



        $scope.auth = Auth;
    

        // any time auth state changes, add the user data to scope
        $scope.auth.$onAuthStateChanged(function(firebaseUser) {



            // if(firebaseUser != null){
            $scope.firebaseUser = firebaseUser;
            
            //if(firebaseUser != null){
            if (firebaseUser != null) {

                var ref = firebase.database().ref("User/" + $scope.firebaseUser.uid);

                ref.on('value', function(snapshot) {
                    $scope.CurrentUserObj=snapshot.val();
                });
               
                auth.useremail = $scope.firebaseUser.email;
                auth.uid = $scope.firebaseUser.uid;


                /* This needs to moved to scope */
                if (document.getElementById("prof_email")) {
                    document.getElementById("prof_email").value = $scope.firebaseUser.email;
                }
                if (document.getElementById("userid")) {
                    document.getElementById("userid").value = $scope.firebaseUser.uid;
                }
                /* This needs to moved to scope */

                var amOnline = firebase.database().ref('.info/connected');
                var userRef = firebase.database().ref('presence/' + $scope.firebaseUser.uid);
                amOnline.on('value', function(snapshot) {

                    if (snapshot.val()) {
                        userRef.onDisconnect().remove();
                        userRef.set(true);
                        // User is online, update UI.
                    }
                });



                var ref = firebase.database().ref("User/").child($scope.firebaseUser.uid);
                

            }

            //}

        });
    }
]);

/* Login */






/* CONTROLLER FOR CREATE PROFILE PAGE */

app.controller("ProfileCtrl", ["$scope", "Auth", "UserList","$location","$uibModal","$firebaseArray","$uibModalStack","$window",
    function($scope, Auth, UserList,$location,$uibModal,$firebaseArray,$uibModalStack,$window ) {

        /* FUNCTION CALLED WHEN SAVE CHANGES BUTTON IS CLICKED  */
        $scope.auth = Auth;
        $scope.userlist = UserList;
        $scope.plink = [];
        $scope.plink.pflag = 0;
        var user_info = Auth.$getAuth();

        console.log($scope.modalInstance);
         if ($scope.modalInstance) {
                    $scope.modalInstance.close();
            }

        $scope.ptype = [];
        $scope.userlist.$loaded(function() {

            if(user_info != null){

            var userid = user_info['uid'];

            var profile_value = $scope.userlist.$getRecord(userid);
            
            $scope.plink.pflag = 1;

            if(profile_value.type == "student"){
                
                $scope.ptype.profile_type = 0;
                $scope.plink.link = "#/app/pages/accomodatorslist"
                
             }else{
                $scope.ptype.profile_type = 1;
                $scope.plink.link = "#/app/pages/studentslist";
                
             }
            

            angular.forEach($scope.userlist,
                function(value, key) {

                    if (value.email == auth.useremail) {
                            $scope.firstname = value.firstname;
                            $scope.lastname = value.lastname;
                            $scope.password = value.password;
                            $scope.education = value.education;
                            $scope.major = value.major;
                            $scope.type = value.type;
                            $scope.about = value.about;
                            $scope.email = value.email;
                            $scope.gender = value.gender;
                            $scope.dbrefid = value.$id;
                            
                        

                    }

                });
            }


        });



        $scope.saveProfile = function() {
                
            var list = $scope.userlist.$getRecord($scope.dbrefid);
            if(list != null){

                console.log('Updating Profile');

                list.email = $scope.email;
                list.firstname = $scope.firstname;
                list.lastname = $scope.lastname;
                list.password = $scope.password;
                list.education = $scope.education;
                list.major = $scope.major;
                list.gender = $scope.gender;
                list.type = $scope.type;
                list.about = $scope.about;
                $scope.userlist.$save(list);

            }else{

            console.log('Creating Profile');

             $scope.auth.$createUserWithEmailAndPassword($scope.email, $scope.password)
              .then(function(firebaseUser) {
                console.log("User " + firebaseUser.uid + " created successfully!");
                var userRef = firebase.database().ref('User/').child(firebaseUser.uid);
                userRef.on('value', function(snapshot) {
                    var exists = (snapshot.val() !== null)
                    if (!exists) {
                        userRef.set({
                            email: $scope.email,
                            firstname: $scope.firstname,
                            lastname: $scope.lastname,
                            password: $scope.password,
                            education: $scope.education,
                            major: $scope.major,
                            gender: $scope.gender,
                            type: $scope.type,
                            about: $scope.about,
                            isRequested:0,
                            joined: Math.round((new Date()).getTime() / 1000)
                            //some more user data

                        });

                      if($scope.type == "accomodator"){

                         $location.path("app/pages/studentslist");

                         }else{

                         $location.path("app/pages/accomodatorslist");

                        }
                    }

                });


              }).catch(function(error) {
                console.error("Error: ", error);
              });
          }
           
        };

        $scope.reloadRoute = function() {
           $window.location.reload();
        }


        $scope.signinProfile=function(){
                $scope.auth.$signInWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser) {
                  var userRef = firebase.database().ref('User/').child(firebaseUser.uid);
                    userRef.on('value', function(snapshot) {
                    var exists = (snapshot.val() !== null);
                    var data = snapshot.val();
                    
                    if(data.type == "accomodator"){

                        $location.path("app/pages/studentslist");

                    }else{

                         $location.path("app/pages/accomodatorslist");

                    }
                    

                });

                  
                }).catch(function(error) {
                  $scope.ptype.auth = 0;
                  console.error("Authentication failed:", error);
                });

        }




        


   // });

    }
]);




app.controller("AccomodatorsCtrl", ["$scope","UserList" ,"AccomodatorsList","Auth","AccreqList", "$firebaseArray","$uibModalStack",
    function($scope,UserList,AccomodatorsList,Auth,AccreqList, $firebaseArray,$uibModalStack) {
        
        $scope.accomodators_list = AccomodatorsList;
        $scope.accreq_list = AccreqList;
        $scope.acclist = [];
        $scope.auth = Auth;

        var user_info = Auth.$getAuth();
        var userid = user_info['uid'];
        $scope.userlist = UserList;
        $scope.ptype = [];

        var top = $uibModalStack.getTop();
        if (top) {
            $uibModalStack.dismiss(top.key);
        }
        
        $scope.userlist.$loaded(function() {
            
            var profile_value = $scope.userlist.$getRecord(userid);
            console.log(profile_value);
            if(profile_value.type == "student"){
               
                $scope.ptype.profile_type = 0;
               
             }else{
                $scope.ptype.profile_type = 1;
                
             }

         });

        $scope.accreq_list.$loaded(function() {

        $scope.accomodators_list.$loaded(function() {
        

        for (i = 0; i < $scope.accomodators_list.length; i++) {

            var value = $scope.accomodators_list[i];

            var accreq_ref = userid+"_"+value.$id;
            var req_sent = $scope.accreq_list.$getRecord(accreq_ref);
               
                   if(req_sent == null){
                    var rsent = 0;
                    
                   }else{
                    var isAccepted = req_sent.isAccepted;
                    var isBlocked = req_sent.isBlocked;
                    
                    if(isAccepted == 1){
                        var rsent = 2;
                    }else{
                        var rsent = 1;
                    }
                    
                    
                   }

                     $scope.acclist.push({
                                firstname: value.firstname,
                                lastname: value.lastname,
                                about: value.about,
                                gender: value.gender,
                                major: value.major,
                                request: rsent,
                                id: value.$id
                            });
                
         }

        });

        });

        $scope.sendrequest = function(item_id) {

             var user_info = Auth.$getAuth();
             var userid = user_info['uid'];
             var accreq_ref = userid+"_"+item_id;
             var userRef = firebase.database().ref('AccomodatorRequests/').child(accreq_ref);
                userRef.on('value', function(snapshot) {
                    var exists = (snapshot.val() !== null)
                    if (!exists) {
                        userRef.set({
                            reqid: userid,
                            uid:item_id,
                            isBlocked: 0
                        });

                       $scope.acclist = [];

                       $scope.accreq_list.$loaded(function() {

                        $scope.accomodators_list.$loaded(function() {
                        

                        for (i = 0; i < $scope.accomodators_list.length; i++) {

                            var value = $scope.accomodators_list[i];

                            var accreq_ref = userid+"_"+value.$id;
                            var req_sent = $scope.accreq_list.$getRecord(accreq_ref);
                               
                                   if(req_sent == null){
                                    var rsent = 0;
                                   }else{
                                    var rsent = 1;
                                   }

                                     $scope.acclist.push({
                                                firstname: value.firstname,
                                                lastname: value.lastname,
                                                about: value.about,
                                                gender: value.gender,
                                                major: value.major,
                                                request: rsent,
                                                id: value.$id
                                            });
                                
                         }

                        });

                        });




                    }

                });

                


        };  




        }


        ]);


app.controller("AdminCtrl", ["$scope", "UserList","StudentsList", "Auth","$uibModal","AccreqList" ,"$firebaseArray","$rootScope","$uibModalStack",
    function($scope,UserList ,StudentsList,Auth,$uibModal,AccreqList,$firebaseArray,$rootScope,$uibModalStack) {
        $scope.students_list = StudentsList;
        $scope.accreq_list = AccreqList;
        $scope.slist = [];
      //  var user_info = Auth.$getAuth();
       // var userid = user_info['uid'];
        //$scope.userlist = UserList;
        $scope.ptype = [];
        var top = $uibModalStack.getTop();
        if (top) {
            $uibModalStack.dismiss(top.key);
        }
        $scope.auth = Auth;

        $scope.students_list.$loaded(function() {
            

            for (i = 0; i < $scope.students_list.length; i++) {

                var value = $scope.students_list[i];
                $scope.slist.push({
                                    firstname: value.firstname,
                                    lastname: value.lastname,
                                    about: value.about,
                                    email: value.email,
                                    gender: value.gender,
                                    major: value.major,
                                    id: value.$id
                                });
                    
             }

        });


       }
]);


app.controller("AccAdminCtrl", ["$scope","UserList" ,"AccomodatorsList","Auth","AccreqList", "$firebaseArray","$uibModalStack",
    function($scope,UserList,AccomodatorsList,Auth,AccreqList, $firebaseArray,$uibModalStack) {
        $scope.accomodators_list = AccomodatorsList;
        $scope.accreq_list = AccreqList;
        $scope.acclist = [];
        $scope.auth = Auth;
      //  var user_info = Auth.$getAuth();
       // var userid = user_info['uid'];
        //$scope.userlist = UserList;
        $scope.ptype = [];
        var top = $uibModalStack.getTop();
        if (top) {
            $uibModalStack.dismiss(top.key);
        }
        $scope.auth = Auth;

        $scope.accomodators_list.$loaded(function() {
            

            for (i = 0; i < $scope.accomodators_list.length; i++) {

                var value = $scope.accomodators_list[i];
                $scope.acclist.push({
                                    firstname: value.firstname,
                                    lastname: value.lastname,
                                    about: value.about,
                                    email: value.email,
                                    gender: value.gender,
                                    major: value.major,
                                    id: value.$id
                                });
                    
                }

        });


       }
]);


app.controller("StudentsCtrl", ["$scope", "UserList","StudentsList", "Auth","$uibModal","AccreqList" ,"$firebaseArray","$rootScope","$uibModalStack",
    function($scope,UserList ,StudentsList,Auth,$uibModal,AccreqList,$firebaseArray,$rootScope,$uibModalStack) {
        
        $scope.students_list = StudentsList;
        $scope.accreq_list = AccreqList;
        $scope.slist = [];
        var user_info = Auth.$getAuth();
        var userid = user_info['uid'];
        $scope.userlist = UserList;
        $scope.ptype = [];
        var top = $uibModalStack.getTop();
        if (top) {
            $uibModalStack.dismiss(top.key);
        }
        $scope.auth = Auth;

        $scope.userlist.$loaded(function() {
            
            var profile_value = $scope.userlist.$getRecord(userid);
            
            if(profile_value.type == "student"){
               
                $scope.ptype.profile_type = 0;
               
             }else{
                $scope.ptype.profile_type = 1;
                
             }

         });

        
        $scope.accreq_list.$loaded(function() {
           
            $scope.students_list.$loaded(function() {
            

            for (i = 0; i < $scope.students_list.length; i++) {

                var value = $scope.students_list[i];
                var accreq_ref = userid+"_"+value.$id;
                var req_sent = $scope.accreq_list.$getRecord(accreq_ref);
                
                   if(req_sent == null){
                    var rsent = 0;
                    
                   }else{
                    var isBlocked = req_sent.isBlocked;
                    
                    var isAccepted = req_sent.isAccepted;
                    if(isBlocked == 1){
                        
                        var rsent = 3;

                    }else{
                            if(isAccepted == 1){
                                var rsent = 2;
                            }else{
                                var rsent = 1;
                            }

                    }
                    
                   }


                

                $scope.slist.push({
                                    firstname: value.firstname,
                                    lastname: value.lastname,
                                    about: value.about,
                                    gender: value.gender,
                                    major: value.major,
                                    request: rsent,
                                    id: value.$id
                                });
                    
             }

            });


        });

        $scope.sendrequest = function(item_id) {

             var user_info = Auth.$getAuth();
             var userid = user_info['uid'];
             var accreq_ref = userid+"_"+item_id;
             var userRef = firebase.database().ref('AccomodatorRequests/').child(accreq_ref);
                userRef.on('value', function(snapshot) {
                    var exists = (snapshot.val() !== null)
                    if (!exists) {
                        userRef.set({
                            reqid: userid,
                            uid:item_id,
                            isBlocked: 0
                        });

                        $scope.slist = [];



                        $scope.accreq_list.$loaded(function() {
           
                            $scope.students_list.$loaded(function() {
                            

                            for (i = 0; i < $scope.students_list.length; i++) {

                                var value = $scope.students_list[i];
                                var accreq_ref = userid+"_"+value.$id;
                                var req_sent = $scope.accreq_list.$getRecord(accreq_ref);
                               
                                   if(req_sent == null){
                                    var rsent = 0;
                                   }else{
                                    var rsent = 1;
                                   }
                                
                                $scope.slist.push({
                                                    firstname: value.firstname,
                                                    lastname: value.lastname,
                                                    about: value.about,
                                                    gender: value.gender,
                                                    major: value.major,
                                                    request: rsent,
                                                    id: value.$id
                                                });
                                    
                             }

                            });
                        });






                    }

                });





                


        }; 



        }


]);


app.controller("AccreqCtrl", ["$scope","AccreqList","UserList","Auth","StudentsList", "$firebaseArray","$location",
    function($scope, AccreqList,UserList,Auth,StudentsList, $firebaseArray,$location) {
        
        $scope.accreq_list = AccreqList;
        $scope.students_list = StudentsList;
        $scope.auth = Auth;
        $scope.arlist = [];
        var user_info = Auth.$getAuth();
        var userid = user_info['uid'];
        $scope.userlist = UserList;
        $scope.ptype = []; 
        $scope.userlist.$loaded(function() {
            
            var profile_value = $scope.userlist.$getRecord(userid);
            if(profile_value.type == "student"){
                $scope.ptype.profile_type = 0;
               
             }else{
                $scope.ptype.profile_type = 1;
                
             }


                $scope.accreq_list.$loaded(function() {

                    for (i = 0; i < $scope.accreq_list.length; i++) {

                        var list = $scope.accreq_list[i];

                        if ((list.isBlocked == 0) && (list.uid == userid)) {

                            var value = $scope.userlist.$getRecord(list.reqid);
                            $scope.arlist.push({
                                firstname: value.firstname,
                                lastname: value.lastname,
                                about: value.about,
                                gender: value.gender,
                                major: value.major,
                                id: value.$id
                            });


                        }

                    }

                });

                 



             
        

        
        });
        

        

        $scope.blockreq = function(item_id) {

             var accreq_ref = item_id+"_"+userid;
             var list = $scope.accreq_list.$getRecord(accreq_ref);

              if(list != null){

                list.isBlocked = 1;
                $scope.accreq_list.$save(list);
                console.log("Profile Blocked");
                $scope.arlist = [];

                $scope.accreq_list.$loaded(function() {

                    for (i = 0; i < $scope.accreq_list.length; i++) {

                        var list = $scope.accreq_list[i];

                        if ((list.isBlocked == 0) && (list.uid == userid)) {

                            var value = $scope.userlist.$getRecord(list.reqid);
                            $scope.arlist.push({
                                firstname: value.firstname,
                                lastname: value.lastname,
                                about: value.about,
                                gender: value.gender,
                                major: value.major,
                                id: value.$id
                            });


                        }

                    }

                });



             } 



                


        };



         $scope.acceptreq = function(item_id) {

             var accreq_ref = item_id+"_"+userid;
             var list = $scope.accreq_list.$getRecord(accreq_ref);
             
              if(list != null){

                list.isAccepted = 1;
                $scope.accreq_list.$save(list);
                console.log("Profile accepted");
                $scope.arlist = [];

                $scope.accreq_list.$loaded(function() {

                    for (i = 0; i < $scope.accreq_list.length; i++) {

                        var list = $scope.accreq_list[i];

                        if ((list.isBlocked == 0) && (list.uid == userid)) {

                            var value = $scope.userlist.$getRecord(list.reqid);
                            $scope.arlist.push({
                                firstname: value.firstname,
                                lastname: value.lastname,
                                about: value.about,
                                gender: value.gender,
                                major: value.major,
                                id: value.$id
                            });


                        }

                    }

                });



             } 

             $location.path("app/pages/chat/"+item_id);

                


        }; 




        }


        ]);



app.controller("BlockreqCtrl", ["$scope","UserList","AccreqList","Auth","StudentsList", "$firebaseArray",
    function($scope,UserList ,AccreqList,Auth,StudentsList, $firebaseArray) {
        
        $scope.accreq_list = AccreqList;
        $scope.students_list = StudentsList;
        $scope.auth = Auth;
        $scope.arlist = [];
        var user_info = Auth.$getAuth();
        var userid = user_info['uid'];
        $scope.userlist = UserList;
        $scope.ptype = [];
        
        $scope.userlist.$loaded(function() {
            
            var profile_value = $scope.userlist.$getRecord(userid);
           
            if(profile_value.type == "student"){
               
                $scope.ptype.profile_type = 0;
               
             }else{
                $scope.ptype.profile_type = 1;
                
             }

         });



         $scope.accreq_list.$loaded(function() {

                    for (i = 0; i < $scope.accreq_list.length; i++) {

                        var list = $scope.accreq_list[i];

                        if ((list.isBlocked == 1) && (list.uid == userid)) {

                            var value = $scope.userlist.$getRecord(list.reqid);
                            $scope.arlist.push({
                                firstname: value.firstname,
                                lastname: value.lastname,
                                about: value.about,
                                gender: value.gender,
                                major: value.major,
                                id: value.$id
                            });


                        }

                    }

                });

         $scope.revoke_request = function(item_id) {

             var accreq_ref = item_id+"_"+userid;
             var list = $scope.accreq_list.$getRecord(accreq_ref);
              if(list != null){

                list.isBlocked = 0;
                $scope.accreq_list.$save(list);
                console.log("Profile Revoked");

                $scope.arlist = [];

                $scope.accreq_list.$loaded(function() {

                    for (i = 0; i < $scope.accreq_list.length; i++) {

                        var list = $scope.accreq_list[i];

                        if ((list.isBlocked == 1) && (list.uid == userid)) {

                            var value = $scope.userlist.$getRecord(list.reqid);
                            $scope.arlist.push({
                                firstname: value.firstname,
                                lastname: value.lastname,
                                about: value.about,
                                gender: value.gender,
                                major: value.major,
                                id: value.$id
                            });


                        }

                    }

                });



             } 



                


        }; 

        
        
       

        
        }


        ]);

/* CREATE CHATS REF. FROM FIREBASE */

app.factory("Message", ["$firebaseArray",
    function($firebaseArray) {
        // create a reference to the database where we will store our data
        var ref = firebase.database().ref("Chats");
        return $firebaseArray(ref);




    }
]);


/* CONTROLLER FOR CHAT PAGE */

app.controller("ChatCtrlFb", ["$scope", "Message", "Auth", "$firebaseArray", "$stateParams", "Profile","$http",
    function($scope, Message, Auth, $firebaseArray, $stateParams, Profile,$http) {
        $scope.auth = Auth;
        var ctuserid = $stateParams.userid;
        var user_Arr = [];
        $scope.profile = Profile;

        /* PROMISE FUNCTION TO LOAD ALL THE VALUES FROM USER DB REFERENCE FROM FIREBASE */

        $scope.profile.$loaded(function() {
            
            /* GET RECORD FOR USERID PASSED AS A PARAMETER */

            var profile_data = $scope.profile.$getRecord(ctuserid);
            $scope.firstname = profile_data.firstname;
            $scope.lastname = profile_data.lastname;
            $scope.address = profile_data.address;
            $scope.email = profile_data.email;
            $scope.type = profile_data.type;
            $scope.industry = profile_data.industry;
            $scope.subIndustry = profile_data.subIndustry;
            $scope.image = profile_data.image != null ? profile_data.image : 'assets/images/blank-profile-picture-973460_960_720.png';


        });


        $scope.auth.$onAuthStateChanged(function(firebaseUser) {
            $scope.firebaseUser = firebaseUser;
            user_Arr[0] = $scope.firebaseUser.uid;
            user_Arr[1] = ctuserid;
            var afsort = user_Arr.sort();

            /* CREATE FIREBASE DB REF. WITH USERID1_USERID2 */

            var ref = firebase.database().ref("Chats/" + afsort[0] + "_" + afsort[1]);
            Message = $firebaseArray(ref);
            ref.once('value', function(snapshot) {
                var exists = (snapshot.val() !== null);
                if (!exists) {
                    //var nref = firebase.database().ref("Chats/"+ctuserid+"_"+$scope.firebaseUser.uid);
                    //Message = $firebaseArray(nref);
                }


                $scope.user = $scope.firebaseUser.displayName;
                $scope.messages = Message;


                setTimeout(function(){ 

                    var objDiv = document.getElementById("chatBox");
                    objDiv.scrollTop = objDiv.scrollHeight;

                 }, 100);


                



            });

            $scope.getCharIndivClass = function(user_id) {
                if (user_id == $scope.firebaseUser.uid) {
                    return 'chat_self_user';
                } else {
                    return 'chat_other_user';
                }

            }

            /* FUNCTION TO ADD NEW CHAT MESSAGES */

            $scope.addMessage = function() {
               


                if($scope.messages[0] == undefined){

                    $http.get('http://api-email.startupmasterclasspune.in:9000/initChat', 
                          {
                              params:{customerEmail: $scope.email,
                              customerName: $scope.firstname,
                              MessageBody: $scope.message,
                              ChatInitiatorName:  $scope.user
                              }
                              // headers: {Authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='}
                          });


                }

                $scope.messages.$add({
                    from: $scope.user,
                    user_id: $scope.firebaseUser.uid,
                    content: $scope.message,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });

                $scope.message = "";

                setTimeout(function(){ 

                    var objDiv = document.getElementById("chatBox");
                    objDiv.scrollTop = objDiv.scrollHeight;

                 }, 100);



                

                

            };



        });



    }
]);






