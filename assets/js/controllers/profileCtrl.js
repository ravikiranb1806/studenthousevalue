var app = angular.module("myApp", ["firebase"]).controller("profileCtrl", profileCtrl);

function SampleCtrl($firebaseStorage) {
  // create a Storage reference for the $firebaseStorage binding
  var storageRef = firebase.storage().ref('userProfiles/physicsmarie');
  var storage = $firebaseStorage(storageRef);
  var file = // get a file from the template (see Retrieving files from template section below)
  var uploadTask = storage.$put(file);
  // of upload via a RAW, base64, or base64url string
  var stringUploadTask = storage.$putString('5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB', 'base64');
}
SampleCtrl.$inject = ["$firebaseStorage"];


