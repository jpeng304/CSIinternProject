# CSIinternProject

The website is coded with HTML, CSS and JavaScript, and it is connected to Firebase Database where the data are stored. 
Also, the website is hosted by Firebase and the url is https://sample-4015c.firebaseapp.com/.

-The website will need the users to log in or create a new account using only Email with copysolution.com as the domain and 
check if users are IT or Sales Rep.

-For IT users, they are able to insert Inventory and Order data, and they are able to view all the Inventory and Order data on the Table

-For Sale Rep users, they are only able to insert Order data, and only be able to view their own Order data based on the Order Rep name. 

-For Order Data Input, there are some textfields will automatically filled in with the calculated cost after users input some
other cost textfields.

-Users are able to edit the html table value, and the program will update the row of the updated value to Firebase Database. 
There are some columns' cells change depend on other columns' cells, so if users change a value, then it will change other cell's 
value as well. Example: XeroxInvoice = equipment cost + RSDU + Analyst Cost. If user change the any of those three variables in a 
row, then that row's XeroxInvoice will be changed as well. 

-When viewing the data on the html table, users can sort in ascending or descending orders, and they are able to filter the html
table as well. When filter a column that contain cost, it will show the rows with the searched column that is greater than the 
inserted search number. For columns that does not contain cost, it will be filter base on if the text is contain in the searched column.

-The transfer data webpage is only accessable by the IT users. On that page, there are two buttons which are "Transfer data from Google
Sheet to Firebase" and "Transfer data from Firebase to Google Sheet". The "Transfer data from Google Sheet to Firebase" button let users
import Order and Inventory Sheet into Firebase. The "Transfer data from Firebase to Google Sheet" button let users import Order and 
Inventory Table from Firebase into Google Sheet, but the user need to change Firebase's Rule for both read and write to true or else
it won't work. The GAS textfile is the Google App Script code that is needed in the Google Sheet's Script code to transfer data between
Google Sheet and Firebase. The excel sheet is the testing sheet I used.
