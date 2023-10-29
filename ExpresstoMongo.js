var exp=require("express"); //Import Express
var dot=require("dotenv"); // Import dotenv Package
var mon=require("mongoose"); //Import Mongoose Package
var cors=require('cors')
var app = exp();//Initizling the exp
var bparser=require('body-parser');
bparserInit=bparser.urlencoded({extended:false});
app.use(cors());
app.use(exp.json());
 
//Connecting to MongoDB with mongosh connection link
mon.connect
("mongodb://127.0.0.1:27017/local?directConnection=true&serverSelectionTimeoutMS=2000t&appName=ExpressToMongoDB").then(()=>
//Checking wheather the connected or not
{console.log('Connected to the Database.')}).catch(
    ()=>{console.log("Unable to Connect. Check the URL.")}
)
 
//Define the Structure of collections
const  userSchema={userId: String, password: String, emailId: String};
 
//Link the structure with the name of actual collection of the database
//Actual Collection name is Users
//Model(<collectionName>,<schemaName or structureOfTheCollection>)
var UserData=mon.model('Users',userSchema);
//Inserting Data into collections
 
//getById *
//getBypassword *
//getByemailid *
 
function getAllUsers(request, response) {
    // Retrieving all records. If successful, retrieve and display; otherwise, handle errors.
    UserData.find()
      .then((data) => {
        console.log(data);
        response.send(data);
      })
      .catch((error) => {
        console.log(error);
        response.send('Could not retrieve the data.');
      });
  }
  app.get('/allUsers', getAllUsers);
 
 
function addNewUser(request, response){ //Prepare the data to be inserted into the Collection
var udata=new UserData({'userId': request.body.uid, 'password': request.body.password, 'emailId': request.body.emailId}); //Insert the data into the collections to check if the data insertion is successfully //Use save() function for inserting the data
udata.save().then((data)=>{console.log("Insert Successfully");
response.send("<b>Inserted Data Successfully");
}).catch((error)=>
{
    console.log(error);
    response.send("Unable to insert the data.")
});
}
app.post('/addUsers', bparserInit, addNewUser);
 
//updateUsers *  
// PUT API
function updateUser(request, response) {
    var userId = request.body.uid;
    var newPassword = request.body.password;
    var newEmailId = request.body.emailId;
 
    // Find the user by userId and update their data
    UserData.findOne({ 'userId': userId })
        .then((user) => {
            if (!user) {
                response.status(404).send('User not found');
            } else {
                // Update user data
                user.password = newPassword;
                user.emailId = newEmailId;
                // Save the updated user data
                return user.save();
            }
        })
        .then((updatedUser) => {
            if (updatedUser) {
                console.log('User data updated successfully');
                response.status(200).send('User data updated successfully');
            }
        })
        .catch((err) => {
            console.error(err);
            response.status(500).send('Error updating user');
        });
}
 
app.put('/update', bparserInit, updateUser);
//deleteUsers *
function deleteUser(request, response) {
    var userId = request.body.uid;
 
    // Find the user by userId and remove them
    UserData.findOneAndRemove({ 'userId': userId })
        .then((user) => {
            if (!user) {
                response.status(404).send('User not found');
            } else {
                console.log('User deleted successfully');
                response.status(200).send('User deleted successfully');
            }
        })
        .catch((err) => {
            console.error(err);
            response.status(500).send('Error deleting user');
        });
}
 
app.delete('/delete', bparserInit, deleteUser);
 
//If Connection has any issues it will through the error
app.listen(8000, function(error) {
    if (error !== undefined) {
        console.log(error.message);
    } else {
        console.log('Connected to port 8000. Waiting for requests.');
        console.log('On the browser, visit http://localhost:8000/');
    }
});