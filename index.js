const express = require('express')
const authRoutes = require('./routes/auth-routes.js')
const profileRoutes = require('./routes/host-routes')

const passAuth = require('./config/passport-setup')
const mongoose = require('mongoose')
// const schema = require('./schema')
const bodyParser = require('body-parser')

const keys = require('./config/keys')
const cookieSession = require('cookie-session')
const passport = require('passport')
const app = express();
// const multer = require('multer')

// const upload = multer()

const path = require('path')

const schema = require('./models/schema')


app.use(express.static(__dirname))

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}))

app.use(passport.initialize());

app.use(passport.session());

mongoose.connect(keys.mongodb.dbURI, (err) => {
  if(err){
    console.log(err);
  }
  console.log('database connected')
})

app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)



app.use('/assets', express.static('assets'));


app.get('/', (req, res) => {
  res.sendFile('views/index.html' , { root : __dirname});
});

app.get('/logout', (req,res) => {
  req.logOut();
  res.sendFile(path.resolve(__dirname + '/views/index.html'));  
})

app.get('/host', (req, res) => {
  res.sendFile('views/host.html' , { root : __dirname});
});

app.get('/user', (req, res) => {
  res.sendFile('views/user.html' , { root : __dirname});
});


app.get('/newTest-page', (req, res) => {
  res.sendFile('views/add-page.html' , { root : __dirname});
});

app.get('/fetch-data', (req, res) => {
  mongoose.model('test').find({host_id: req.user.id}).then((data) => {
    // console.log(typeof data)
    res.send(data)
  })
  // res.sendFile('views/add-page.html' , { root : __dirname});
});

app.get('/load-tests', (req,res) => {
  mongoose.model('test').find({}).then((data) => {
    res.send(data)
  })
})


app.use(bodyParser.json());

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ 
    extended: true
})); 
  

app.post('/add-question', (req, res) => {
  
  // console.log(req.body)
  new schema.Test({
    testname: req.body.testname,
    host_id: req.user.id,
    questions: req.body.questions
  }).save()
  res.send()
});



app.get('/add-question', (req, res) => {
  // add Question To Database
  
  res.sendFile('views/add-page.html' , { root : __dirname});
});


app.listen(process.env.PORT || 3000, () => {
  console.log('Request recieving')
});












// function home(){
//   let mainContainer = document.getElementsByClassName("main-container")
//   let elem = mainContainer[0].lastElementChild
//   while(elem){
//     mainContainer[0].removeChild(elem)
//     elem = mainContainer[0].lastElementChild
//   }
//   let container = document.createElement("div")
//   let head = document.createElement("h1")
//   head.innerHTML = "Tests available"
//   let innerContainer = document.createElement("div")
//   let list = document.createElement("a")
//   list.setAttribute("href", "./index.html")
//   list.innerHTML = "Test1"
//   let list2 = document.createElement("a")
//   list2.setAttribute("href", "./index.html")
//   list2.innerHTML = "Test2"
//   innerContainer.appendChild(head)
//   innerContainer.appendChild(list)
//   innerContainer.appendChild(list2)
//   container.appendChild(innerContainer)
//   mainContainer[0].appendChild(container)

// }

// function showDropdown(){
//   let elem = document.getElementsByClassName("dropdown-content")
//   if(!elem[0].style.opacity)
//   elem[0].style.opacity = 1
//   else if(elem[0].style.opacity === "0")
//   elem[0].style.opacity = 1
//   else
//   elem[0].style.opacity = 0
// }

// function showDetails(index){
//   let elem = document.getElementsByClassName("test-details")
//   if( !elem[index - 1].style.display || elem[index - 1].style.display === "none")
//   elem[index - 1].style.display = "block"
//   else
//   elem[index - 1].style.display = "none"
  
//   // elem[0].style.transform = "scaleY(1)"
//   // elem[0].style.display = "block"
// }

// function removeDetails(index){
//   let elem = document.getElementsByClassName("test-details")
//   elem[index - 1].style.display = "none"
// }

// function loadTest(){
//   let elem = document.getElementsByClassName("test-page")
//   elem[0].style.display = "block";
//   document.getElementsByClassName("applyFade")[0].style.opacity = 0.4;        
        
// //     $("#but2").click(function(){
// //             $("#popdiv").fadeOut(200);              
// //         });
// // });
//   document.getElementsByClassName("image-container")[0].style.opacity = 0.4;
// }

// function showScore(){
//   document.getElementsByClassName("result")[0].style.display = "block";
//   document.getElementsByClassName("test-page")[0].style.display = "none";
// }

// function loadResult(){
//   let elem = document.getElementsByClassName("result")
//   elem[0].style.display = "block";
//   document.getElementsByClassName("applyFade")[0].style.opacity = 0.4;  
//   document.getElementsByClassName("test-page")[0].style.display = "none";
// }

// function loadHome(){
//   let elem = document.getElementsByClassName("result")
//   elem[0].style.display = "none";
//   document.getElementsByClassName("applyFade")[0].style.opacity = 1;  
//   document.getElementsByClassName("test-page")[0].style.display = "none";
// }

// function loadNewTest(){
//   document.getElementsByClassName("host-details")[0].style.opacity = 0.4
//   document.getElementsByClassName("add-page")[0].style.display = "block"
// }

// function loadConfirmation(){
//   document.getElementsByClassName("host-details")[0].style.opacity = 0.4;
//   document.getElementsByClassName("confirm")[0].style.display = "block";
// }