 $(document).ready(function(){


//Initialize Firebase
var config = {
    apiKey: "AIzaSyBEaQagNUzPCVvplBR-pMEXx-yb0t6ahMw",
    authDomain: "train-scheduler-d9812.firebaseapp.com",
    databaseURL: "https://train-scheduler-d9812.firebaseio.com",
    projectId: "train-scheduler-d9812",
    storageBucket: "train-scheduler-d9812.appspot.com",
    messagingSenderId: "642281170909"
  };
  firebase.initializeApp(config);

  var database = firebase.database()

    //Creating a button to add trains
  $("#addTrainBtn").on("click",function(){

        //Grabbing user input

        var trainName = $("#train-input").val().trim();
        var trainDest = $("#destination-input").val().trim();
        var firstTrain = $("#time-input").val().trim();
        var trainFreq = $("#frequency-input").val().trim();

        console.log(trainName);
        console.log(trainDest);  

        //Local temporary object holding train data

        var newTrain = {

            name: trainName,
            destination: trainDest,
            start: firstTrain,
            frequency: trainFreq

        };

        //Uploading train data to database
            database.ref().push(newTrain);

        alert("Train added!");

        //Clearing out text boxes
        $("#train-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");

        return false;
    });

    //Firebase event for adding train to the database and a row to the html

    database.ref().on("child_added", function(childSnapshot){
        
        console.log(childSnapshot.val());

        //Storing everything into variables
        var trainName = childSnapshot.val().name;
        var trainDest = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().start;
        var trainFreq = childSnapshot.val().frequency;



        var firstTimeConverted = moment(firstTrain, "HH:mm");
            console.log(firstTimeConverted);
            console.log(firstTrain);

        //Current Time
        var currentTime = moment().format("HH:mm");
        console.log("Current Time: " + moment(currentTime));

        //Time difference
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("Time Difference: " + diffTime);
        
        //Time apart
        var remainder = diffTime % trainFreq;
        console.log(remainder);

        //Minutes until arrival
        var minUntilArrival = trainFreq - remainder;
        console.log("Minutes until next train: " + minUntilArrival);

        //Next Train
        var nextTrain = moment().add(minUntilArrival, "minutes");
        console.log("Arrival Time: " + moment(nextTrain).format("HH:mm"));

        //Adding data into the table
        $("#trainTable > tbody").append("<tr><td>" + trainName + "<td>" + trainDest + "<td>" + trainFreq + "<td>" + moment(nextTrain).format("HH:mm") + "<td>" + minUntilArrival + "<tr><td> ");



    });
 });