var submitBtn = document.getElementById("submitBtn");
var orderRep = document.getElementById("userEmail");
var sellRep = document.getElementById("sellRep");
var customer = document.getElementById("customer");
var loc = document.getElementById("loc");
var unit = document.getElementById("unit");
var sn = document.getElementById("sn");
var purchaseCost = document.getElementById("purchaseCost");
var estimateDate = document.getElementById("estimateDate");
var actualDate = document.getElementById("actualDate");
var shippingFrom = document.getElementById("shippingFrom");
var shippingDest = document.getElementById("shippingDest");
var email_id;
var aType;

var submitOrderBtn = document.getElementById("submitOrderBtn"),
    rep = document.getElementById("userEmails"),
    dateOr = document.getElementById("dateOr"),
    product = document.getElementById("product"),
    serial = document.getElementById("serial"),
    cName = document.getElementById("cName"),
    zip = document.getElementById("zip"),
    terr = document.getElementById("terr"),
    equipC = document.getElementById("equipC"),
    rsdu = document.getElementById("rsdu"),
    analystC = document.getElementById("analystC"),
    XIC = document.getElementById("XIC"),
    CSIC = document.getElementById("CSIC"),
    resale = document.getElementById("resale"),
    buyout = document.getElementById("buyout"),
    funding = document.getElementById("funding"),
    revenue = document.getElementById("revenue"),
    grossP = document.getElementById("grossP"),
    profitMargin = document.getElementById("profitMargin"),
    gpbump = document.getElementById("gpbump"),
    cPayment = document.getElementById("cPayment"),
    invoice = document.getElementById("invoice");

var user_type;
var newUserEmail;
var gotten_type;
var initial, userName;

function myFunction(){
    var user = firebase.auth().currentUser.email;
    var repRef = firebase.database().ref().child("User");
    repRef.on("child_added", function (snapshot){
        var userPost = snapshot.val(),
            authEmail = userPost.Rep,
            authType = userPost.Type;
        //If user are an IT/Administrator User, then they can input inventory data
        if (authEmail == user ) {
            if(authType == "IT"){
                sbmInventory();
            }else{
                alert("Cannot input Inventory as Sales Rep");
            }
        }

    });

}

//The function is called when the submit button in New Inventory Information page is clicked.
//This will insert the date from new inventory information to Inventory table in Firebase database
function sbmInventory() {
    var firebaseRef = firebase.database().ref();
    var newData = {
        OrderRep: orderRep.textContent,
        SellingRep: sellRep.value,
        Customer: customer.value,
        Location: loc.value,
        Unit: unit.value,
        SN: sn.value,
        PurchaseCost: parseFloat(purchaseCost.value),
        EstimateShipping: estimateDate.value,
        ActualReceiveDate: actualDate.value,
        ShippingFrom: shippingFrom.value,
        ShippingDestination: shippingDest.value
    };
    firebaseRef.child("Inventory").push().set(newData);
    
    //Make the textfield for each data empty after the submit button is pressed
    document.getElementById("submitBtn").value = ' '
    document.getElementById("sellRep").value = ' '
    document.getElementById("customer").value = ' '
    document.getElementById("loc").value = ' '
    document.getElementById("unit").value = ' '
    document.getElementById("sn").value = ' '
    document.getElementById("purchaseCost").value = ''
    document.getElementById("estimateDate").value = ' '
    document.getElementById("actualDate").value = ' '
    document.getElementById("actualDate").value = ' '
    document.getElementById("shippingFrom").value = ''
    document.getElementById("shippingDest").value = ''
}

//This is function is called when user pressed the submit button in New Order Information page
//Will insert the new data into Order Table in Firebase database.
function orderIns(){
    var firebaseRef = firebase.database().ref();
    
    //convert the percentage value into decimals
    var PM = parseFloat(profitMargin.value);
    PM = PM/100;
    var GP = parseFloat(gpbump.value);
    GP = GP/100;
    
    var orderData = {
        Rep: rep.textContent,
        DateOrder: dateOr.value,
        Product: product.value,
        SerialNumber: serial.value,
        CustomerName: cName.value,
        ZipCode: zip.value,
        Territory: terr.value,
        EquipmentCost: parseFloat(equipC.value),
        RSDU: parseFloat(rsdu.value),
        AnalystCost: parseFloat(analystC.value),
        XeroxInvoiceCost: parseFloat(XIC.value),
        CSICost: parseFloat(CSIC.value),
        ResalePrice: parseFloat(resale.value),
        BuyoutEvolve: parseFloat(buyout.value),
        FundingAmount: parseFloat(funding.value),
        Performance: parseFloat(revenue.value),
        GrossProfit: parseFloat(grossP.value),
        ProfitMargin: parseFloat(PM),
        GPBump: parseFloat(GP),
        CustomerPayment: cPayment.value,
        InvoiceNumber: invoice.value
    }
    //insert the data from Order form into Firebase
    firebaseRef.child("Order").push().set(orderData);
    
    //Make the Textbox empty
    document.getElementById("dateOr").value = ' '
    document.getElementById("product").value = ' '
    document.getElementById("serial").value = ' '
    document.getElementById("cName").value = ' '
    document.getElementById("zip").value = ' '
    document.getElementById("terr").value = ' '
    document.getElementById("equipC").value = ' '
    document.getElementById("rsdu").value = ' '
    document.getElementById("analystC").value = ' '
    document.getElementById("XIC").value = ' '
    document.getElementById("CSIC").value = ' '
    document.getElementById("resale").value = ' '
    document.getElementById("buyout").value = ' '
    document.getElementById("funding").value = ' '
    document.getElementById("revenue").value = ' '
    document.getElementById("grossP").value = ' '
    document.getElementById("profitMargin").value = ' '
    document.getElementById("gpbump").value = ' '
    document.getElementById("cPayment").value = ' '
    document.getElementById("invoice").value = ' '
}


//These are functions that will change other textbox's value when
//their own text are changed.

//For the Xerox Invoice Cost and CSI Cost need Equipment Cost, RSDU and Analyst Cost
//Whenever the user press a key and release the key in the selected textbox, then the selected textbox keyup function will be called
$("#equipC").keyup(function(){
    var equip, RSdu, analyst, Xtotal, CSICost, rev;
    var Resales, BuyoutEv ,FA, grossprofit, pmargin;

    if(buyout.value == ""){
        BuyoutEv= 0
    }else{
        BuyoutEv = parseFloat(buyout.value)
    }

    if(equipC.value == ""){
        equip = 0
    }else
        equip = parseFloat(equipC.value)

    if(rsdu.value == ""){
        RSdu = 0
    }else{
        RSdu = parseFloat(rsdu.value)
    }

    if(analystC.value == ""){
        analyst = 0
    }else{
        analyst = parseFloat(analystC.value)
    }

    if(resale.value == ""){
        Resales = 0
    }else{
        Resales = parseFloat(resale.value)
    }
    Xtotal = equip + RSdu + analyst;
    CSICost = Xtotal * 1.08;
    rev = Resales *0.2 + equip;
    FA = Resales - BuyoutEv;
    grossprofit = FA - CSICost;
    pmargin = (grossprofit/FA)*100;

    document.getElementById("XIC").value = Xtotal.toString()
    document.getElementById("CSIC").value = CSICost.toFixed(2).toString()
    document.getElementById("revenue").value = rev.toFixed(2).toString()
    document.getElementById("grossP").value = grossprofit.toFixed(2).toString()
    if(FA == 0){
        document.getElementById("profitMargin").value = "0"
    }else{
        document.getElementById("profitMargin").value = pmargin.toFixed(2).toString()
    }

});

$("#rsdu").keyup(function(){
    var equip, RSdu, analyst, Xtotal, CSICost;

    var Resales, BuyoutEv ,FA, grossprofit, pmargin;
    if(resale.value == ""){
        Resales = 0
    }else
        Resales = parseFloat(resale.value)


    if(buyout.value == ""){
        BuyoutEv= 0
    }else{
        BuyoutEv = parseFloat(buyout.value)
    }

    if(equipC.value == ""){
        equip = 0
    }else
        equip = parseFloat(equipC.value)


    if(rsdu.value == ""){
        RSdu = 0
    }else{
        RSdu = parseFloat(rsdu.value)
    }

    if(analystC.value == ""){
        analyst = 0
    }else{
        analyst = parseFloat(analystC.value)
    }
    Xtotal = equip + RSdu + analyst;
    CSICost = Xtotal * 1.08;
    FA = Resales - BuyoutEv;
    grossprofit = FA - CSICost;
    pmargin = (grossprofit/FA)*100;
    document.getElementById("XIC").value = Xtotal.toString()
    document.getElementById("CSIC").value = CSICost.toFixed(2).toString()
    document.getElementById("grossP").value = grossprofit.toFixed(2).toString()
    document.getElementById("profitMargin").value = pmargin.toFixed(2).toString()
});

$("#analystC").keyup(function(){
    var equip, RSdu, analyst, Xtotal, CSICost;
    var Resales, BuyoutEv ,FA, grossprofit,pmargin;
    if(resale.value == ""){
        Resales = 0
    }else
        Resales = parseFloat(resale.value)


    if(buyout.value == ""){
        BuyoutEv= 0
    }else{
        BuyoutEv = parseFloat(buyout.value)
    }
    if(equipC.value == ""){
        equip = 0
    }else
        equip = parseFloat(equipC.value)


    if(rsdu.value == ""){
        RSdu = 0
    }else{
        RSdu = parseFloat(rsdu.value)
    }

    if(analystC.value == ""){
        analyst = 0
    }else{
        analyst = parseFloat(analystC.value)
    }
    Xtotal = equip + RSdu + analyst;
    CSICost = Xtotal * 1.08;
    FA = Resales - BuyoutEv;
    grossprofit = FA - CSICost;
    pmargin = (grossprofit/FA)*100;
    document.getElementById("XIC").value = Xtotal.toString()
    document.getElementById("CSIC").value = CSICost.toFixed(2).toString()
    document.getElementById("grossP").value = grossprofit.toFixed(2).toString()
    document.getElementById("profitMargin").value = pmargin.toFixed(2).toString()

});


$("#resale").keyup(function(){
    var Resales, BuyoutEv ,FA, rev, equip, RSdu, analyst, CSICost, gprofit, pmargin;
    if(resale.value == ""){
        Resales = 0
    }else
        Resales = parseFloat(resale.value)
    if(buyout.value == ""){
        BuyoutEv= 0
    }else{
        BuyoutEv = parseFloat(buyout.value)
    }


    if(equipC.value == ""){
        equip = 0
    }else
        equip = parseFloat(equipC.value)

    if(rsdu.value == ""){
        RSdu = 0
    }else{
        RSdu = parseFloat(rsdu.value)
    }

    if(analystC.value == ""){
        analyst = 0
    }else{
        analyst = parseFloat(analystC.value)
    }


    FA = Resales - BuyoutEv;
    rev = Resales * 0.2 + equip;
    CSICost = (equip + RSdu + analyst) * 1.08;
    gprofit = FA - CSICost;
    pmargin = (gprofit/FA)*100;


    document.getElementById("funding").value = FA.toString()
    document.getElementById("revenue").value = rev.toFixed(2).toString()
    document.getElementById("grossP").value = gprofit.toFixed(2).toString()
    document.getElementById("profitMargin").value = pmargin.toFixed(2).toString()
});

$("#buyout").keyup(function(){
    var Resales, BuyoutEv ,FA, equip, RSdu, analyst, CSICost,gprofit, pmargin;
    if(resale.value == ""){
        Resales = 0
    }else
        Resales = parseFloat(resale.value)


    if(buyout.value == ""){
        BuyoutEv= 0
    }else{
        BuyoutEv = parseFloat(buyout.value)
    }

     if(equipC.value == ""){
        equip = 0
    }else
        equip = parseFloat(equipC.value)

    if(rsdu.value == ""){
        RSdu = 0
    }else{
        RSdu = parseFloat(rsdu.value)
    }

    if(analystC.value == ""){
        analyst = 0
    }else{
        analyst = parseFloat(analystC.value)
    }

    FA = Resales - BuyoutEv;
    CSICost = (equip + RSdu + analyst) * 1.08;
    gprofit = FA - CSICost;
    pmargin = (gprofit/FA)*100;
    document.getElementById("funding").value = FA.toString()
    document.getElementById("grossP").value = gprofit.toFixed(2).toString()
    document.getElementById("profitMargin").value = pmargin.toFixed(2).toString()
});

//When User is sign in, this will check the User Table with sign in email to see  
//what type of user is it (Rep or IT)
var userRef = firebase.database().ref().child("User");
userRef.on("child_added", function (snapshot){
     var userPost = snapshot.val(),
        authEmail = userPost.Rep,
        authType = userPost.Type;

    //If type is Rep, then it will only show insert order and order view page tab
    //If type is IT, then it will show insert inventory, inventory view, insert order, order view and transfer page tabe
    if (authEmail == email_id ) {
        if(authType != "IT"){
            $("#nav2").show();
            $("#nav").hide();
        } else {
            $("#nav").show();
            $("#nav2").hide();
        }
    }
  })


//Firebase Login Functions called when user login
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in then check the
    var user = firebase.auth().currentUser;
    if (user != null) {
        email_id = user.email;
        var n = email_id.indexOf(".");
        //Get the initial and the First and last name and capitalize the first letter
        initial = (email_id.charAt(0) + email_id.charAt(n+1)).toUpperCase();
        userName = email_id.charAt(0).toUpperCase() + email_id.substring(1,email_id.indexOf('.')) + " " + email_id.charAt(n+1).toUpperCase();
        
        document.getElementById("use_para").innerHTML = "Welcome " + email_id;
        document.getElementById("userEmail").innerHTML = email_id;
    }

  } else {
    // No user is signed in.

  }
});

//This function is called when the user press the login button at the login screen 
function login(){
    //Get the email and password from the textfield
    var aa;
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;
    
    //Check the User Table to see if there are the same email as inputted,then
    //get the email and the type from database
    userRef.on("child_added", function (snapshot){
      var userPost = snapshot.val(),
         authEmail = userPost.Rep,
         authType = userPost.Type;
        if (authEmail == userEmail ) {
                 aa = authEmail;
                 aType = authType;            
        }
    });

    //when sign in, it will check if the user type is Rep or IT.
    //Rep will direct to insertOrder page and IT will direct to inventoryInput page.
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function(user){
        if(aType != "IT"){
            location.href = "insertOrder.html";
        } else {
            location.href = "inventoryInput.html";
        }
    }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Error: " + errorMessage);

        });

}

//To allow the enter key to be used
document.body.addEventListener('keydown', function(e) {
  if (e.keyCode == 13) {
    login();
  }
});

//Logout out function called when user pressed the log out button in the header,
//and redirect back to the login screen
function logout(){
    firebase.auth().signOut();
    if (location.href != "index.html"){
      location.href = "index.html";
    }
}

//This function is called when user clicked the Register button in login screen
function signUp(){
    //Get the email and password from the textfield
    var newEmail = document.getElementById("email_field").value;
    var newPass = document.getElementById("password_field").value;
    
    //Get the domain of the email
    var domain = newEmail.substring(newEmail.lastIndexOf("@") +1);
    //only let email with domain copysolution.com to register
    if(domain == "copysolution.com"){
        //This function will get the user type by checking the selected radio button of Rep or IT
        getUserType();
        firebase.auth().createUserWithEmailAndPassword(newEmail, newPass).then(function(user){
            if(aType == "IT"){
                location.href = "inventoryInput.html";
                getUserType();
            }else{
                location.href = "insertOrder.html";
                getUserType();
            }
        }).catch(function(error) {

          // Handle Errors here.

          var errorCode = error.code;
          var errorMessage = error.message;
          alert("Error: " + errorMessage);
          // ...
        });
    }else{
        alert("The E-mail is wrong format");
    }
}

//This function will be called when users are registering for an account 
function getUserType(){
    //Get the email from email text field
    newUserEmail = document.getElementById("email_field").value;
    //check if the IT or Rep radio button is checked and set as variable, and
    //will not let the users register if no radio button is checked
    if(document.getElementById('asIT').checked) {
        aType = "IT";
        user_type = "IT";
    }else if(document.getElementById('asRep').checked) {
        aType = "Sales Rep";
        user_type ="Sales Rep";
    }else{
        alert("Select a type of user");
    }
    insertUser();
}

//Insert the user email and type into the User Table of Firebase
function insertUser(){
    var firebaseRef = firebase.database().ref();
    var userData = {
        Rep: newUserEmail,
        Type: user_type
    }
    //insert the data from Order form into Firebase
    firebaseRef.child("User").push().set(userData);

}

//This will send verification to the registered user *Did not apply this to the project yet
function send_verification(){
    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function() {
      // Email sent.
        alert("Check Your Mail for Verification");
    }).catch(function(error) {
      // An error happened.
        alert("Error: " + error.message);
    });
}

//End Firebase Login Functions
