
var orderRef = firebase.database().ref().child("Order");
var userRef = firebase.database().ref().child("User");
var equipT = 0, rsduT=0, analystT=0, XeroxICT=0, CSIcostT=0, resaleT=0,buyoutT=0,fundingT=0,performanceT=0,gProfitT=0;
var orderkey = [];
var orderCount;
var ifOrderEdit = false;

//Check what type of user is logged in by getting the email and
//usertype from the User Table
userRef.on("child_added",function(snapshot){
    var userPost = snapshot.val(),
        authEmail = userPost.Rep,
        authType = userPost.Type;

    if (authEmail == email_id ) {
            getOrderData(authType);
    }
});

//Will Update the table column that will change other value 
function editOrderTable(){
   
    var total=0;
    var Xtotal=0, CSICost= 0, rev=0;
    var FA=0, grossprofit=0, pmargin=0;
    //Set all the cost total to 0
    equipT = 0, rsduT=0, analystT=0, XeroxICT=0, CSIcostT=0, resaleT=0,buyoutT=0,fundingT=0,performanceT=0,gProfitT=0;
    table = document.getElementById("OrderTable");
    rows = table.getElementsByTagName("TR");
     
    //After edit, the for loop will get the value from the row that have cost and get rid of $ and change 
    //the value to numeral value, and recalculate the cost that depend on other variable. Like Xerox Total will 
    //change when column 7,8,9 changed
    for(var p = 0; p < orderCount ; p++){
        var td7 = rows[2+p].getElementsByTagName("td")[7].innerText.substring(rows[2+p].getElementsByTagName("td")[7].innerText.indexOf('$')+1);
        var td8 = rows[2+p].getElementsByTagName("td")[8].innerText.substring(rows[2+p].getElementsByTagName("td")[8].innerText.indexOf('$')+1);
        var td9 = rows[2+p].getElementsByTagName("td")[9].innerText.substring(rows[2+p].getElementsByTagName("td")[9].innerText.indexOf('$')+1);
        
        Xtotal = parseFloat(td7) + parseFloat(td8) + parseFloat(td9);
       
        CSICost = Xtotal * 1.08;
        
        var td12 = rows[2+p].getElementsByTagName("td")[12].innerText.substring(rows[2+p].getElementsByTagName("td")[12].innerText.indexOf('$')+1);
        var td13 = rows[2+p].getElementsByTagName("td")[13].innerText.substring(rows[2+p].getElementsByTagName("td")[13].innerText.indexOf('$')+1);
        FA = parseFloat(td12) - parseFloat(td13);
        rev = parseFloat(td12) *0.2 + parseFloat(td7);
        grossprofit = FA - CSICost;
        pmargin = (grossprofit/FA) * 100;
         
        //change the value of the row to new value
        rows[2+p].cells[10].innerHTML = "$"+Xtotal.toFixed(2);
        rows[2+p].cells[11].innerHTML = "$"+CSICost.toFixed(2);
        rows[2+p].cells[14].innerHTML = "$"+FA.toFixed(2);
        rows[2+p].cells[15].innerHTML = "$"+rev.toFixed(2);
        rows[2+p].cells[16].innerHTML = "$"+grossprofit.toFixed(2);
        rows[2+p].cells[17].innerHTML = pmargin.toFixed(2)+"%";
        
        //If the row is displayed, then calculate the total 
        if(rows[2+p].style.display != "none"){
            equipT = equipT + parseFloat(td7);
            rsduT = rsduT + parseFloat(td8);
            analystT = analystT + parseFloat(td9);
            XeroxICT = XeroxICT + parseFloat(Xtotal);
            CSIcostT = CSIcostT + parseFloat(CSICost);
            resaleT = resaleT + parseFloat(td12);
            buyoutT = buyoutT + parseFloat(td13); 
            fundingT = fundingT + parseFloat(FA);
            performanceT = performanceT + parseFloat(rev);
            gProfitT = gProfitT + parseFloat(grossprofit);
        }
    }
     //This is to set those total value to the cell with the same id
    $('#equipCell').html("$" + equipT.toFixed(2));
    $('#rsduCell').html("$" + rsduT.toFixed(2));
    $('#analystCell').html("$" + analystT.toFixed(2));
    $('#XICCell').html("$" + XeroxICT.toFixed(2));
    $('#CSIcostCell').html("$" + CSIcostT.toFixed(2));
    $('#resaleCell').html("$" + resaleT.toFixed(2));
    $('#buyoutCell').html("$" + buyoutT.toFixed(2));
    $('#fundingCell').html("$" + fundingT.toFixed(2));
    $('#performanceCell').html("$" + performanceT.toFixed(2));
    $('#grossPCell').html("$" + gProfitT.toFixed(2));
    
    ifOrderEdit = true;
}

//Function called when mouse hover over the row
function editInFunc(x){
    //make that row editable
    document.getElementById("oCount"+x).contentEditable="true";
}
//Function called when mouse move away from the row
function editOutFunc(x){
    //make that row uneditable
    document.getElementById("oCount"+x).contentEditable="false";
    updateORowData(x);
}

//This will get the data from the row and update the datbase
function updateORowData(x){
    var dataLoc = 0;
    var table, rows, cellCost, strsplit;
    var getID;
    table = document.getElementById("ordertable_body");
    rows = table.getElementsByTagName("TR");
    getID = document.getElementById("oCount"+x).id;
 
    for(var p = 0; p < rows.length ; p++){
        rowID = rows[p].id;
        if(rowID == getID){
            //If there was edit in the row then ifOrderEdit will be true
            if(ifOrderEdit == true){
                getID = getID.substring(getID.indexOf("t")+1, getID.length);
                
                //Get the edited row value and get rid of the $ and %
                var td7 = rows[p].getElementsByTagName("td")[7].innerText.substring(rows[p].getElementsByTagName("td")[7].innerText.indexOf('$')+1);
                var td8 = rows[p].getElementsByTagName("td")[8].innerText.substring(rows[p].getElementsByTagName("td")[8].innerText.indexOf('$')+1);
                var td9 = rows[p].getElementsByTagName("td")[9].innerText.substring(rows[p].getElementsByTagName("td")[9].innerText.indexOf('$')+1);
                var td10 = rows[p].getElementsByTagName("td")[10].innerText.substring(rows[p].getElementsByTagName("td")[10].innerText.indexOf('$')+1);
                var td11 = rows[p].getElementsByTagName("td")[11].innerText.substring(rows[p].getElementsByTagName("td")[11].innerText.indexOf('$')+1);
                var td12 = rows[p].getElementsByTagName("td")[12].innerText.substring(rows[p].getElementsByTagName("td")[12].innerText.indexOf('$')+1);
                var td13 = rows[p].getElementsByTagName("td")[13].innerText.substring(rows[p].getElementsByTagName("td")[13].innerText.indexOf('$')+1);
                var td14 = rows[p].getElementsByTagName("td")[14].innerText.substring(rows[p].getElementsByTagName("td")[14].innerText.indexOf('$')+1);
                var td15 = rows[p].getElementsByTagName("td")[15].innerText.substring(rows[p].getElementsByTagName("td")[15].innerText.indexOf('$')+1);
                var td16 = rows[p].getElementsByTagName("td")[16].innerText.substring(rows[p].getElementsByTagName("td")[16].innerText.indexOf('$')+1);
                var td17 = rows[p].getElementsByTagName("td")[17].innerText.substring(0,rows[p].getElementsByTagName("td")[17].innerText.indexOf('%'));
                var td18 = rows[p].getElementsByTagName("td")[18].innerText.substring(0,rows[p].getElementsByTagName("td")[18].innerText.indexOf('%'));
                
                //make the profit margin that don't have value to 0
                if(td17 == "NaN"){
                    td17 = parseFloat("0");            
                }

                var postData = {
                    Rep: rows[p].getElementsByTagName("TD")[0].innerHTML,
                    DateOrder: rows[p].getElementsByTagName("TD")[1].innerHTML,
                    Product: rows[p].getElementsByTagName("TD")[2].innerHTML,
                    SerialNumber: rows[p].getElementsByTagName("TD")[3].innerHTML,
                    CustomerName: rows[p].getElementsByTagName("TD")[4].innerHTML,
                    ZipCode: rows[p].getElementsByTagName("TD")[5].innerHTML,
                    Territory: rows[p].getElementsByTagName("TD")[6].innerHTML,            
                    EquipmentCost: parseFloat(td7),
                    RSDU: parseFloat(td8),
                    AnalystCost: parseFloat(td9),
                    XeroxInvoiceCost: parseFloat(td10),
                    CSICost: parseFloat(td11),
                    ResalePrice: parseFloat(td12),
                    BuyoutEvolve: parseFloat(td13),
                    FundingAmount: parseFloat(td14),
                    Performance: parseFloat(td15),
                    GrossProfit: parseFloat(td16),
                    ProfitMargin: parseFloat(td17/100),
                    GPBump: parseFloat(td18/100),
                    CustomerPayment: rows[p].getElementsByTagName("TD")[19].innerHTML,
                    InvoiceNumber: rows[p].getElementsByTagName("TD")[20].innerHTML
                };
                
                //called to update the Order Tables based on the key from the orderkey array
                //The getID will get the number after variable oCount1, which in this case will be 1
                //Because if user sort or filter the table which will reorganize the table but the ID will 
                //stay the same, so the oCount ID's number at the end will count as the index for the orderkey array
                var updates = {};
                updates['/Order/' + orderkey[parseInt(getID)]] = postData;
                firebase.database().ref().update(updates);
                
                //Change ifOrderEdit to false, so the row won't be know as editted
                ifOrderEdit = false;
                break
            }
        }
    }
    

}


//This is to get the Data from Order Table
function getOrderData(authType){
    orderCount = 0;
    orderRef.on("child_added", function (snapshot) {

        var orderPost = snapshot.val(),
            reps = orderPost.Rep,
            dateO = orderPost.DateOrder,
            prod = orderPost.Product,
            serialN = orderPost.SerialNumber,
            custName = orderPost.CustomerName,
            zipC= orderPost.ZipCode,
            territory = orderPost.Territory,
            equipCost = orderPost.EquipmentCost,
            rsdu = orderPost.RSDU,

            analystCo = orderPost.AnalystCost,
            XeroxIC = orderPost.XeroxInvoiceCost,
            CSIcost = orderPost.CSICost,
            resaleP = orderPost.ResalePrice,
            buyEvolve= orderPost.BuyoutEvolve,
            fundingA = orderPost.FundingAmount,
            performanceR = orderPost.Performance,
            gProfit= orderPost.GrossProfit,

            pMargin = orderPost.ProfitMargin,
            bump = orderPost.GPBump,
            custPay = orderPost.CustomerPayment,
            invoiceN = orderPost.InvoiceNumber;


        //The authenticate type is IT can view everything in the order
        if(authType == "IT"){
            orderkey[orderCount] = snapshot.key;
            
            //Firebase won't allow / in the data, so this will switched back | to /
            reps = reps.replace("|", "/");
            prod = prod.replace("|","/");

            //These if statement make the data that is empty or non-number to 0
            //The data transfer from google drive have different characters, so these are the if statements
            //to make those characters into numeral
            if(equipCost == "" || equipCost == "$-" || equipCost == "$ -"){
                equipCost = 0;
            }
            if(rsdu == "" || rsdu == "$-" || rsdu == "$ -"){
                rsdu = 0;
            }
            if(analystCo == "" || analystCo == "$-" || analystCo == "$ -"){
                analystCo = 0;
            }
            if(CSIcost == "" || CSIcost == "$-" || CSIcost == "$ -"){
                CSIcost = 0;
            }
            if(resaleP == "" || resaleP == "$-" || resaleP == "$ -"){
                resaleP = 0;
            }
            if(buyEvolve == "" || buyEvolve == "$-" || buyEvolve == "$ -"){
                buyEvolve = 0;
            }
            if(fundingA == "" || fundingA == "$-" || fundingA == "$ -"){
                fundingA = 0;
            }
            if(XeroxIC == "" || XeroxIC == "$-" || XeroxIC == "$ -"){
                XeroxIC = 0;
            }
            if(CSIcost == "" || CSIcost == "$-" || CSIcost == "$ -"){
                CSIcost = 0;
            }
            if(performanceR == "" || performanceR == "$-" || performanceR == "$ -"){
                performanceR = 0;
            }
            if(gProfit == "" || gProfit == "$-" || gProfit == "$ -"){
                gProfit = 0;
            }
            if(pMargin =="" || pMargin == "#DIV/0!"){
                pMargin = 0;
            }
            if(bump =="" || bump == "#DIV/0!"){
                bump= 0;
            }
            //make the read data from database to float for cost and set as 2 decimal
            equipCost = parseFloat(equipCost.toFixed(2));
            rsdu = parseFloat(rsdu.toFixed(2));
            analystCo = parseFloat(analystCo.toFixed(2));
            XeroxIC = parseFloat(XeroxIC.toFixed(2));
            CSIcost = parseFloat(CSIcost.toFixed(2));
            resaleP = parseFloat(resaleP.toFixed(2));
            buyEvolve = parseFloat(buyEvolve.toFixed(2));
            fundingA = parseFloat(fundingA.toFixed(2));
            performanceR = parseFloat(performanceR.toFixed(2));
            gProfit = parseFloat(gProfit.toFixed(2));

            //make the read decimal number data from database to float and times 100 to make it percentage
            pMargin = (pMargin *100).toFixed(2);
            bump = (bump *100).toFixed(2);

            //This will set the read data into a row of the table with the onmouseover and onmouseout function
            $("#ordertable_body").append("<tr onmouseover=editInFunc("+orderCount+") onmouseout=editOutFunc("+orderCount+") id=oCount"+orderCount+"> <td>" + reps + "</td><td>" + dateO  + "</td><td>" + prod  + "</td><td>"+ serialN +"</td><td>"
                                    + custName+ "</td><td>" + zipC+ "</td><td>"+ territory + "</td><td> $" + equipCost + "</td><td> $" + rsdu + "</td><td> $"
                                    + analystCo + "</td><td> $" + XeroxIC + "</td><td> $" + CSIcost + "</td><td> $" + resaleP + "</td><td> $"
                                    + buyEvolve + "</td><td> $" + fundingA + "</td><td> $" + performanceR + "</td><td> $" + gProfit + "</td><td>"+ pMargin + "%</td><td>" + bump + "%</td><td>"
                                    + custPay + "</td><td>" + invoiceN + "</td></tr>");


            //Calculate the total for each of the field equipment cost, rsdu, analyst cost, xerox invoice cost, CSI cost, resale price, buyout evolve, funding amount, performance(revenue), gross profit
            equipT += equipCost;
            rsduT += rsdu;
            analystT += analystCo;
            XeroxICT += XeroxIC;
            CSIcostT += CSIcost;
            resaleT += resaleP;
            buyoutT += buyEvolve;
            fundingT += fundingA;
            performanceT += performanceR;
            gProfitT += gProfit;

            //This is to set those total value to the cell with the same id
            $('#equipCell').html("$" + equipT.toFixed(2));
            $('#rsduCell').html("$" + rsduT.toFixed(2));
            $('#analystCell').html("$" + analystT.toFixed(2));
            $('#XICCell').html("$" + XeroxICT.toFixed(2));
            $('#CSIcostCell').html("$" + CSIcostT.toFixed(2));
            $('#resaleCell').html("$" + resaleT.toFixed(2));
            $('#buyoutCell').html("$" + buyoutT.toFixed(2));
            $('#fundingCell').html("$" + fundingT.toFixed(2));
            $('#performanceCell').html("$" + performanceT.toFixed(2));
            $('#grossPCell').html("$" + gProfitT.toFixed(2));
            
            
            orderCount++;
        //If authenticate type is Rep then there are some limitation to what they can see in the Order Table
        }else{
            //Need to get their Initial and name
            if(reps == email_id || reps.indexOf(initial)!=-1 || reps.indexOf(userName)!=-1){
                orderkey[orderCount] = snapshot.key;

                //replace the | to / since there was problems with writing / into the database
                reps = reps.replace("|", "/");
                prod = prod.replace("|","/");


                //These if statement make the data that is empty or non-number to 0
                //The data transfer from google drive have different characters, so these are the if statements
                //to make those characters into numeral
                if(equipCost == "" || equipCost == "$-" || equipCost == "$ -"){
                    equipCost = 0;
                }
                if(rsdu == "" || rsdu == "$-" || rsdu == "$ -"){
                    rsdu = 0;
                }
                if(analystCo == "" || analystCo == "$-" || analystCo == "$ -"){
                    analystCo = 0;
                }
                if(CSIcost == "" || CSIcost == "$-" || CSIcost == "$ -"){
                    CSIcost = 0;
                }
                if(resaleP == "" || resaleP == "$-" || resaleP == "$ -"){
                    resaleP = 0;
                }
                if(buyEvolve == "" || buyEvolve == "$-" || buyEvolve == "$ -"){
                    buyEvolve = 0;
                }
                if(fundingA == "" || fundingA == "$-" || fundingA == "$ -"){
                    fundingA = 0;
                }
                if(XeroxIC == "" || XeroxIC == "$-" || XeroxIC == "$ -"){
                    XeroxIC = 0;
                }
                if(CSIcost == "" || CSIcost == "$-" || CSIcost == "$ -"){
                    CSIcost = 0;
                }
                if(performanceR == "" || performanceR == "$-" || performanceR == "$ -"){
                    performanceR = 0;
                }
                if(gProfit == "" || gProfit == "$-" || gProfit == "$ -"){
                    gProfit = 0;
                }
                if(pMargin =="" || pMargin == "#DIV/0!"){
                    pMargin = 0;
                }
                if(bump =="" || bump == "#DIV/0!"){
                    bump= 0;
                }
                //make the read data from database to float for cost and 2 decimal 
                equipCost = parseFloat(equipCost.toFixed(2));
                rsdu = parseFloat(rsdu.toFixed(2));
                analystCo = parseFloat(analystCo.toFixed(2));
                XeroxIC = parseFloat(XeroxIC.toFixed(2));
                CSIcost = parseFloat(CSIcost.toFixed(2));
                resaleP = parseFloat(resaleP.toFixed(2));
                buyEvolve = parseFloat(buyEvolve.toFixed(2));
                fundingA = parseFloat(fundingA.toFixed(2));
                performanceR = parseFloat(performanceR.toFixed(2));
                gProfit = parseFloat(gProfit.toFixed(2));

                //make the read decimal number data from database to float and times 100 to make it percentage
                pMargin = (pMargin *100).toFixed(2);
                bump = (bump *100).toFixed(2);

                //This will set the read data into a row of the table with the onmouseover and onmouseout function
                $("#ordertable_body").append("<tr onmouseover=editInFunc("+orderCount+") onmouseout=editOutFunc("+orderCount+")             id=oCount"+orderCount+" ><td>" + reps + "</td><td>" + dateO  + "</td><td>" + prod  + "</td><td>"+ serialN +"</td><td>"
                                        + custName+ "</td><td>" + zipC+ "</td><td>"+ territory + "</td><td> $" + equipCost + "</td><td> $" + rsdu + "</td><td> $"
                                        + analystCo + "</td><td> $" + XeroxIC + "</td><td> $" + CSIcost + "</td><td> $" + resaleP + "</td><td> $"
                                        + buyEvolve + "</td><td> $" + fundingA + "</td><td> $" + performanceR + "</td><td> $" + gProfit + "</td><td>"+ pMargin + "%</td><td>" + bump + "%</td><td>"
                                        + custPay + "</td><td>" + invoiceN + "</td></tr>");

                //Calculate the total for each of the field equipment cost, rsdu, analyst cost, xerox invoice cost, CSI cost, resale price, buyout evolve, funding amount, performance(revenue), gross profit
                equipT += equipCost;
                rsduT += rsdu;
                analystT += analystCo;
                XeroxICT += XeroxIC;
                CSIcostT += CSIcost;
                resaleT += resaleP;
                buyoutT += buyEvolve;
                fundingT += fundingA;
                performanceT += performanceR;
                gProfitT += gProfit;

                //This is to set those total value to the cell with the same id
                $('#equipCell').html("$" + equipT.toFixed(2));
                $('#rsduCell').html("$" + rsduT.toFixed(2));
                $('#analystCell').html("$" + analystT.toFixed(2));
                $('#XICCell').html("$" + XeroxICT.toFixed(2));
                $('#CSIcostCell').html("$" + CSIcostT.toFixed(2));
                $('#resaleCell').html("$" + resaleT.toFixed(2));
                $('#buyoutCell').html("$" + buyoutT.toFixed(2));
                $('#fundingCell').html("$" + fundingT.toFixed(2));
                $('#performanceCell').html("$" + performanceT.toFixed(2));
                $('#grossPCell').html("$" + gProfitT.toFixed(2));
                 orderCount++;


            }
        }
    });
}

/* DO NOT DELETE, this function is for looping through the whole table and updating it
function updateOrderData(){
    var table, rows, cellCost, strsplit;
    var getOID;
    table = document.getElementById("OrderTable");
    rows = table.getElementsByTagName("TR");
  
    for(var p = 0; p < orderCount ; p++){
        
        getOID = rows[2+p].id;
        getOID = getOID.substring(getOID.indexOf("t")+1, getOID.length);
       
      
         var td7 = rows[2+p].getElementsByTagName("td")[7].innerText.substring(rows[2+p].getElementsByTagName("td")[7].innerText.indexOf('$')+1);
         var td8 = rows[2+p].getElementsByTagName("td")[8].innerText.substring(rows[2+p].getElementsByTagName("td")[8].innerText.indexOf('$')+1);
         var td9 = rows[2+p].getElementsByTagName("td")[9].innerText.substring(rows[2+p].getElementsByTagName("td")[9].innerText.indexOf('$')+1);
         var td10 = rows[2+p].getElementsByTagName("td")[10].innerText.substring(rows[2+p].getElementsByTagName("td")[10].innerText.indexOf('$')+1);
         var td11 = rows[2+p].getElementsByTagName("td")[11].innerText.substring(rows[2+p].getElementsByTagName("td")[11].innerText.indexOf('$')+1);
         var td12 = rows[2+p].getElementsByTagName("td")[12].innerText.substring(rows[2+p].getElementsByTagName("td")[12].innerText.indexOf('$')+1);
         var td13 = rows[2+p].getElementsByTagName("td")[13].innerText.substring(rows[2+p].getElementsByTagName("td")[13].innerText.indexOf('$')+1);
         var td14 = rows[2+p].getElementsByTagName("td")[14].innerText.substring(rows[2+p].getElementsByTagName("td")[14].innerText.indexOf('$')+1);
         var td15 = rows[2+p].getElementsByTagName("td")[15].innerText.substring(rows[2+p].getElementsByTagName("td")[15].innerText.indexOf('$')+1);
         var td16 = rows[2+p].getElementsByTagName("td")[16].innerText.substring(rows[2+p].getElementsByTagName("td")[16].innerText.indexOf('$')+1);
         var td17 = rows[2+p].getElementsByTagName("td")[17].innerText.substring(0,rows[2+p].getElementsByTagName("td")[17].innerText.indexOf('%'));
         var td18 = rows[2+p].getElementsByTagName("td")[18].innerText.substring(0,rows[2+p].getElementsByTagName("td")[18].innerText.indexOf('%'));
      
        
        //make the profit margin that don't have value to 0
        if(td17 == "NaN"){
            td17 = parseFloat("0");            
        }
     
        var postData = {
        Rep: rows[2+p].getElementsByTagName("TD")[0].innerHTML,
        DateOrder: rows[2+p].getElementsByTagName("TD")[1].innerHTML,
        Product: rows[2+p].getElementsByTagName("TD")[2].innerHTML,
        SerialNumber: rows[2+p].getElementsByTagName("TD")[3].innerHTML,
        CustomerName: rows[2+p].getElementsByTagName("TD")[4].innerHTML,
        ZipCode: rows[2+p].getElementsByTagName("TD")[5].innerHTML,
        Territory: rows[2+p].getElementsByTagName("TD")[6].innerHTML,            
        EquipmentCost: parseFloat(td7),
        RSDU: parseFloat(td8),
        AnalystCost: parseFloat(td9),
        XeroxInvoiceCost: parseFloat(td10),
        CSICost: parseFloat(td11),
        ResalePrice: parseFloat(td12),
        BuyoutEvolve: parseFloat(td13),
        FundingAmount: parseFloat(td14),
        Performance: parseFloat(td15),
        GrossProfit: parseFloat(td16),
        ProfitMargin: parseFloat(td17/100),
        GPBump: parseFloat(td18/100),
        CustomerPayment: rows[2+p].getElementsByTagName("TD")[19].innerHTML,
        InvoiceNumber: rows[2+p].getElementsByTagName("TD")[20].innerHTML
        };

        var updates = {};
        updates['/Order/' + orderkey[parseInt(getOID)]] = postData;
        firebase.database().ref().update(updates);
    }
    
}*/

//Sort the table base on ascending or descending order when user click on the header of the column
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("OrderTable");
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
    for (i = 2; i < (rows.length - 2); i++) {
        //6 is the number of the Purchase Cost Column
        if(n>=7 && n<=16){
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
function OrdSearch(m) {
  // Declare variables
  var input, filter, table, tr, td, i, numInput;
  input = document.getElementById("orderSearch"+m);
  filter = input.value.toUpperCase();
  table = document.getElementById("OrderTable");
  tr = table.getElementsByTagName("tr");
  // Loop through all table rows, and hide those who don't match the search query
  //started i at 2 because row 0 is the header and row 1 is the search bar which both should not be moved.

  //Set all the cost total to 0
  equipT = 0, rsduT=0, analystT=0, XeroxICT=0, CSIcostT=0, resaleT=0,buyoutT=0,fundingT=0,performanceT=0,gProfitT=0;

  //This if statement is to check from which column search field the user used, so that it will
  if(m>=7 && m <=18){
      for (i = 2; i < tr.length -1; i++) {
          td = tr[i].getElementsByTagName("td")[m];
          var tdtext = td.innerText;
          var resFilter = tdtext.substring(tdtext.indexOf('$')+1);
          
          //Get the numeral value of the currency
          var td7 = tr[i].getElementsByTagName("td")[7].innerText.substring(tr[i].getElementsByTagName("td")[7].innerText.indexOf('$')+1);
          var td8 = tr[i].getElementsByTagName("td")[8].innerText.substring(tr[i].getElementsByTagName("td")[8].innerText.indexOf('$')+1);
          var td9 = tr[i].getElementsByTagName("td")[9].innerText.substring(tr[i].getElementsByTagName("td")[9].innerText.indexOf('$')+1);
          var td10 = tr[i].getElementsByTagName("td")[10].innerText.substring(tr[i].getElementsByTagName("td")[10].innerText.indexOf('$')+1);
          var td11 = tr[i].getElementsByTagName("td")[11].innerText.substring(tr[i].getElementsByTagName("td")[11].innerText.indexOf('$')+1);
          var td12 = tr[i].getElementsByTagName("td")[12].innerText.substring(tr[i].getElementsByTagName("td")[12].innerText.indexOf('$')+1);
          var td13 = tr[i].getElementsByTagName("td")[13].innerText.substring(tr[i].getElementsByTagName("td")[13].innerText.indexOf('$')+1);
          var td14 = tr[i].getElementsByTagName("td")[14].innerText.substring(tr[i].getElementsByTagName("td")[14].innerText.indexOf('$')+1);
          var td15 = tr[i].getElementsByTagName("td")[15].innerText.substring(tr[i].getElementsByTagName("td")[15].innerText.indexOf('$')+1);
          var td16 = tr[i].getElementsByTagName("td")[16].innerText.substring(tr[i].getElementsByTagName("td")[16].innerText.indexOf('$')+1);

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
              //Will show only those numbers greater than the searched number
              //Will calculate the total of each cost with the newly display table
              if (parseFloat(resFilter)>= numInput) {
                tr[i].style.display = "";

                //Calculate the total for the shown row
                equipT += parseFloat(td7);
                rsduT += parseFloat(td8);
                analystT += parseFloat(td9);
                XeroxICT+= parseFloat(td10);
                CSIcostT += parseFloat(td11);
                resaleT += parseFloat(td12);
                buyoutT += parseFloat(td13);
                fundingT += parseFloat(td14);
                performanceT += parseFloat(td15);
                gProfitT += parseFloat(td16);




                $('#equipCell').html("$" + equipT.toFixed(2));
                $('#rsduCell').html("$" + rsduT.toFixed(2));
                $('#analystCell').html("$" + analystT.toFixed(2));
                $('#XICCell').html("$" + XeroxICT.toFixed(2));
                $('#CSIcostCell').html("$" + CSIcostT.toFixed(2));
                $('#resaleCell').html("$" + resaleT.toFixed(2));
                $('#buyoutCell').html("$" + buyoutT.toFixed(2));
                $('#fundingCell').html("$" + fundingT.toFixed(2));
                $('#performanceCell').html("$" + performanceT.toFixed(2));
                $('#grossPCell').html("$" + gProfitT.toFixed(2));
              } else {
                tr[i].style.display = "none";
              }
            }

        }
      //The else is for other column that don't have numerical values
    }else{
        for (i = 2; i < tr.length -1; i++) {
            td = tr[i].getElementsByTagName("td")[m];
                 var td7 = tr[i].getElementsByTagName("td")[7].innerText.substring(tr[i].getElementsByTagName("td")[7].innerText.indexOf('$')+1);
          var td8 = tr[i].getElementsByTagName("td")[8].innerText.substring(tr[i].getElementsByTagName("td")[8].innerText.indexOf('$')+1);
          var td9 = tr[i].getElementsByTagName("td")[9].innerText.substring(tr[i].getElementsByTagName("td")[9].innerText.indexOf('$')+1);
          var td10 = tr[i].getElementsByTagName("td")[10].innerText.substring(tr[i].getElementsByTagName("td")[10].innerText.indexOf('$')+1);
          var td11 = tr[i].getElementsByTagName("td")[11].innerText.substring(tr[i].getElementsByTagName("td")[11].innerText.indexOf('$')+1);
          var td12 = tr[i].getElementsByTagName("td")[12].innerText.substring(tr[i].getElementsByTagName("td")[12].innerText.indexOf('$')+1);
          var td13 = tr[i].getElementsByTagName("td")[13].innerText.substring(tr[i].getElementsByTagName("td")[13].innerText.indexOf('$')+1);
          var td14 = tr[i].getElementsByTagName("td")[14].innerText.substring(tr[i].getElementsByTagName("td")[14].innerText.indexOf('$')+1);
          var td15 = tr[i].getElementsByTagName("td")[15].innerText.substring(tr[i].getElementsByTagName("td")[15].innerText.indexOf('$')+1);
          var td16 = tr[i].getElementsByTagName("td")[16].innerText.substring(tr[i].getElementsByTagName("td")[16].innerText.indexOf('$')+1);
            if (td) {
              //Will show only the rows with the searched word of that column
              //Will calculate the total of each cost with the newly display table
              if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                //Calculate the total for the shown row
                equipT += parseFloat(td7);
                rsduT += parseFloat(td8);
                analystT += parseFloat(td9);
                XeroxICT+= parseFloat(td10);
                CSIcostT += parseFloat(td11);
                resaleT += parseFloat(td12);
                buyoutT += parseFloat(td13);
                fundingT += parseFloat(td14);
                performanceT += parseFloat(td15);
                gProfitT += parseFloat(td16);




                $('#equipCell').html("$" + equipT.toFixed(2));
                $('#rsduCell').html("$" + rsduT.toFixed(2));
                $('#analystCell').html("$" + analystT.toFixed(2));
                $('#XICCell').html("$" + XeroxICT.toFixed(2));
                $('#CSIcostCell').html("$" + CSIcostT.toFixed(2));
                $('#resaleCell').html("$" + resaleT.toFixed(2));
                $('#buyoutCell').html("$" + buyoutT.toFixed(2));
                $('#fundingCell').html("$" + fundingT.toFixed(2));
                $('#performanceCell').html("$" + performanceT.toFixed(2));
                $('#grossPCell').html("$" + gProfitT.toFixed(2));
              } else {
                tr[i].style.display = "none";
              }
            }
        }
    }
}
