var rootRef = firebase.database().ref().child("Inventory");
var userRef = firebase.database().ref().child("User");
var totalCost = 0;
var key = [];
var count;
var counterEdit = 0;
var Itable = document.getElementById("InventoryTable");
var row, cell1, cell2;
var ifEdit = false;

//This is used to check what the is the login users' types
userRef.on("child_added", function (snapshot) {
    var userPost = snapshot.val(),
        authEmail = userPost.Rep,
        authType = userPost.Type;
    //If user type is IT, then the website will show the inventory data from Inventory Table
    if (authEmail == email_id) {
        if(authType == "IT"){
            getInvData();
        }
    }

});

//Receive the Inventory data from the Inventory table in Firebase Database
function getInvData() {
    //The count is used to get the number of inventory data gotten from 
    count = 0;
    rootRef.on("child_added", function (snapshot) {
        var newPost = snapshot.val(),
            oRep = newPost.OrderRep,
            sRep = newPost.SellingRep,
            cust = newPost.Customer,
            locat = newPost.Location,
            units = newPost.Unit,
            sn = newPost.SN,
            purchasecost = newPost.PurchaseCost,
            estimatedate = newPost.EstimateShipping,
            actualdate = newPost.ActualReceiveDate,
            shipFrom = newPost.ShippingFrom,
            shipDest = newPost.ShippingDestination;
        
        //Get the key of each set of data in Inventory Table and store in the key array
        key[count] = snapshot.key;

        //If the purchasecost is empty in textfield, then set it as 0
        if (purchasecost == "") {
            purchasecost = 0;
        }
        //make the purchase cost fixed to 2 decimal
        purchasecost = parseFloat(purchasecost.toFixed(2));
        
        //Calculate the total of Purchase cost
        totalCost = totalCost + purchasecost;
    

        //append a row of a set data from Inventory Table
        //Each row will have onmouse over and onmouse out function which will be called 
        //when mouse hover over the row and when the mouse move away
        $("#table_body").append("<tr class=clickable-row onmouseover=clickFunc("+ count +") onmouseout=outFunc("+count+") id=count" +count+"><td >" + oRep + "</td><td>" + sRep  + "</td><td>" + cust + "</td><td>"+ locat +"</td><td>"
                                + units+ "</td><td>" + sn+ "</td><td> $"+ purchasecost+ "</td><td>" + estimatedate+ "</td><td>"
                                + actualdate + "</td><td>" + shipFrom + "</td><td>" + shipDest + "</td></tr>");

        //set the Total Cost to the id=Cost and set the decimal of the cost to 2 digit
        $('#Cost').html("$" + totalCost.toFixed(2));

        count ++;

    });

}

//when mouse is over the row, it will make that row editable
function clickFunc(x) {
    document.getElementById("count"+x).contentEditable="true";
}
//when mouse move away from the row, it will make the row uneditable
function outFunc(x){
    document.getElementById("count"+x).contentEditable="false";
    updateRowData(x);
}

//This function will run when user press and release a key in the editable row,
//and if this function ran then it means that the users did edit the data
function editInvTable(){
    var updateTotal = 0;
    var cellCost, strsplit; 
    //Set all the cost total to 0
    
    table = document.getElementById("InventoryTable");
    rows = table.getElementsByTagName("TR");
    
    //This for-loop will go through every purchase cost (column 6) and 
    //change the string value to float value, then calculate the changed total
    for(var p = 0; p < count ; p++){        
        if(rows[2+p].style.display != "none"){
            strsplit = rows[2+p].getElementsByTagName("TD")[6].innerHTML;
            if(strsplit == ""){
                cellCost = "0";
            }else{
                //This will only get the numeral value behind $ 
                cellCost = strsplit.substring(strsplit.indexOf("$") + 1);
            }
            updateTotal = updateTotal + parseFloat(cellCost);
        }
    }
    
    //set the updated Purchase cost total 
    $('#Cost').html("$" + updateTotal.toFixed(2));

    //This means that the user did edit the table
    ifEdit = true;
}

//This function will update the database if there are any data edited
function updateRowData(x){
    var dataLoc = 0;
    var table, rows, cellCost, strsplit;
    var getID;
    table = document.getElementById("table_body");
    rows = table.getElementsByTagName("TR");
    getID = document.getElementById("count"+x).id;
    
    for(var p = 0; p < rows.length ; p++){
        rowID = rows[p].id;
        if(rowID == getID){
            if(ifEdit == true){
                dataLoc = p;
                getID = getID.substring(getID.indexOf("t")+1, getID.length);
                strsplit = rows[dataLoc].getElementsByTagName("TD")[6].innerHTML;
                if(strsplit == ""){
                    cellCost = "0";
                }else{
                    cellCost = strsplit.substring(strsplit.indexOf("$") + 1);
                }
                var postData = {
                    OrderRep: rows[dataLoc].getElementsByTagName("TD")[0].innerHTML,
                    SellingRep: rows[dataLoc].getElementsByTagName("TD")[1].innerHTML,
                    Customer: rows[dataLoc].getElementsByTagName("TD")[2].innerHTML,
                    Location: rows[dataLoc].getElementsByTagName("TD")[3].innerHTML,
                    Unit: rows[dataLoc].getElementsByTagName("TD")[4].innerHTML,
                    SN: rows[dataLoc].getElementsByTagName("TD")[5].innerHTML,
                    PurchaseCost: parseFloat(cellCost),
                    EstimateShipping: rows[dataLoc].getElementsByTagName("TD")[7].innerHTML,
                    ActualReceiveDate: rows[dataLoc].getElementsByTagName("TD")[8].innerHTML,
                    ShippingFrom: rows[dataLoc].getElementsByTagName("TD")[9].innerHTML,
                    ShippingDestination: rows[dataLoc].getElementsByTagName("TD")[10].innerHTML
                };
                //Update the data in Inventory table that have the same key 
                var updates = {};
                updates['/Inventory/' + key[parseInt(getID)]] = postData;
                firebase.database().ref().update(updates);
                
                //set ifEdit to false, so it will know there are no edit
                ifEdit = false;
                break
            }
        }
    }
}


//This function will sort the table in ascending or descending order and the n in parameter is the pressed column number
function sortTable(n) {
    counterEdit = 1;
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    var lenx, leny,resx,resy;
    table = document.getElementById("InventoryTable");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 2; i < rows.length - 2; i++) {
            //6 is the number of the Purchase Cost Column
            if(n==6){
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements text you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[n].innerText;
                y = rows[i + 1].getElementsByTagName("TD")[n].innerText;
                //This will remove the $ sign from the text,so we can change to number
                lenx = x.length;
                leny = y.length;
                resx = x.substring(1,lenx);
                resy = y.substring(1,leny);
                //If a cell in Purchase Cost column is empty, then it is a 0
                if (resx =="")
                    resx ="0"
                if (resy =="")
                    resy = "0"
                /* Check if the two rows should switch place,
                based on the direction, asc or desc: */
                if (dir == "asc") {
                    if (parseFloat(resx) > parseFloat(resy)) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (parseFloat(resx) < parseFloat(resy)) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }else{
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                /* Check if the two rows should switch place,
                based on the direction, asc or desc: */
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
      }

}


//This function filter out the table base on what user are searching
function InvSearch(m) {
  // Declare variables
  var input, filter, table, tr, td, i;
  var numInput, totalPurchase = 0, tdCost;
  var costCell = document.getElementById("Cost").innerHTML
  input = document.getElementById("myInput"+m);
  filter = input.value.toUpperCase();

  table = document.getElementById("InventoryTable");
  tr = table.getElementsByTagName("tr");


    //This is for the Purchase Cost which contain only numerical value
    if(m==6){
        for (i = 2; i < tr.length -1; i++) {
            //alert(tr.length);
            td = tr[i].getElementsByTagName("td")[m];

            var tdtext = td.innerText;
            var resFilter = tdtext.substring(tdtext.indexOf('$')+1);
            if(resFilter == ""){
                resFilter = 0
            }
            if(input.value == ""){
                numInput = 0
            }
            else{
                numInput = parseFloat(input.value)
            }

            if(td){
              if (parseFloat(resFilter)>= numInput) {
                tr[i].style.display = "";
                  //add the total for the filtered cost
                totalPurchase += parseFloat(resFilter);
                $('#Cost').html("$" + totalPurchase.toFixed(2));
              } else {
                tr[i].style.display = "none";
              }
            }

        }


    }else{
      // Loop through all table rows, and hide those who don't match the search query
        for (i = 2; i < tr.length-1; i++) {

            td = tr[i].getElementsByTagName("td")[m];
            if (td) {
              if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                tdCost = tr[i].getElementsByTagName("td")[6];

                var tdtext = tdCost.innerText;
                var resFilter = tdtext.substring(tdtext.indexOf('$')+1);
                if(resFilter == ""){
                    resFilter = 0
                }

                totalPurchase += parseFloat(resFilter);
                $('#Cost').html("$" + totalPurchase.toFixed(2));
              } else {
                tr[i].style.display = "none";
              }
            }
        }
    }
}
