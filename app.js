//Require
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const sha = require("sha256");



//App
app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("Public"));
app.set("view engine", "ejs");

//Mongoose
mongoose.connect("mongodb+srv://KenZera:hsQoO117YBWsFa4W@cluster0.ehsurqj.mongodb.net/CryptoBox")

//Schemas
const userSchema = mongoose.Schema({
  host: String,
  name: String,
  email: String,
  password: String,
});

const hostSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

//Models
const User = mongoose.model("User", userSchema);
const Host = mongoose.model("Host", hostSchema);


//Get
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/hostLogin", function(req, res){
  res.render("hostLogin", {errorMessage: ""});
})

app.get("/hostRegister", function(req, res){
  res.render("hostRegister");
});

app.get("/home", function(req, res) {
  res.render("mainMenu");
});

app.get("/addUser", function(req, res){
  res.render("addUser");
});

app.get("/authenticateUser", function(req, res) {
  res.render("authenticateUser", {errorMessage: ""});
});

app.get("/mainMenu", function(req, res) {
  res.render("mainMenu");
});

//Post
app.post("/hostLogin", function(req, res) {
  const tempEmail = req.body.hostLoginEmail;
  const tempPass = sha(req.body.hostLoginPass);
  const tempName = req.body.hostLoginName;

  Host.findOne({name: tempName}, function(err, host) {
    if(err){
      res.send(err);
    }
    else{
      if (host) {
        if (host.email == tempEmail) {
          if (host.password == tempPass) {
            console.log("Success");

            res.render("mainMenu", {cName: tempName, message: ""});
          }
          else {
            console.log("Wrong Password");
            res.render("hostLogin", {errorMessage: "Wrong Password"});
          }
        }
        else{
          console.log("Email not Found");
          res.render("hostLogin", {errorMessage: "Email Not Found"});
        }
      }
      else {
        console.log("Company not Found");
        res.render("hostLogin", {errorMessage: "Company Not Found"});
      }
    }
  });

});

app.post("/hostRegister", function(req, res) {
  const regName = req.body.hostRegisterName;
  const regEmail = req.body.hostRegisterEmail;
  const regPass = sha(req.body.hostRegisterPassword);

    const newHost = Host({
      name: regName,
      email: regEmail,
      password: regPass,
    });
    newHost.save();
    res.render("mainMenu", {cName: regName, message: ""});

});


app.post("/addUser", function(req, res) {
  const userHost = req.body.userHostName;
  const userName = req.body.userName;
  const userEmail = req.body.userEmail;
  const userPassword = sha(req.body.userPassword);


    const newUser = User({
      host: userHost,
      name: userName,
      email: userEmail,
      password: userPassword
    });
    newUser.save();

  res.render("mainMenu", {cName: userHost, message: ""});
});

app.post("/authenticateUser", function(req, res){
  const tempEmail = req.body.userEmail;
  const tempPass = sha(req.body.userPassword);
  const tempName = req.body.userHostName;
  User.findOne({host: tempName, email: tempEmail}, function(err, user) {
    if(err){
      res.send(err);
    }
    else{
      if(user){
        if(user.password == tempPass) {
          res.render("mainMenu", {cName: tempName, message: "User Authenticated"});
        }
        else{
          res.render("authenticateUser", {cName: tempName, errorMessage: "Wrong Password"})
        }
      }
      else{
        res.render("authenticateUser", {cName: tempName, errorMessage: "Email Not Found"});
      }
    }
  });
});

app.post("/redirectAuth", function(req, res) {
  res.render("authenticateUser", {cName : req.body.hostName, errorMessage: ""});
});

app.post("/redirectAdd", function(req, res) {
  res.render("addUser", {cName: req.body.hostName, errorMessage: ""});
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server Started!");
});
