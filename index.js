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
})

app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)



app.use('/assets', express.static('assets'));


app.get('/', (req, res) => {
  // res.sendFile('views/index.html' , { root : __dirname});
  res.sendFile(path.resolve(__dirname + '/views/index.html'));  

});

app.get('/logout', (req,res) => {
  req.logOut();
  // res.sendFile(path.resolve(__dirname + '/views/index.html'));  
  res.redirect('/')
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

app.get('/certificate', (req, res) => {
  res.sendFile('views/certificate.html' , { root : __dirname});
});


app.get('/fetch-data', (req, res) => {
  mongoose.model('test').find({host_id: req.user.id}).then((data) => {
    // console.log(typeof data)
    res.send(data)
  })
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
  
  var test_id_holder = {}
  new schema.Test({
    testname: req.body.testname,
    host_id: req.user.id,
    questions: req.body.questions
  }).save().then((data) => {
    test_id_holder.test_id = data._id
    res.send(test_id_holder)
  })
  
});


app.get('/update-page/:testId', (req, res) => {
  res.sendFile('views/update.html' , { root : __dirname});
})


app.post('/save-test-details', (req, res) => {
  
  new schema.Performance({
    testname : req.body.testname,
    username: req.user.username,
    score: req.body.score
  }).save().then((data) => {
 
    res.send(data)
  })
})

app.post('/save-question', (req, res) => {

  mongoose.model('test').findById(req.body.test_id).then((data) => {
    let _id = req.body.test_id
    let quesArray = data.questions
    let ques = {
      details: req.body.details,
      answer: req.body.answer,
      option1: req.body.option1,
      option2: req.body.option2,
      option3: req.body.option3
    }
    quesArray.push(ques)
    // console.log(quesArray)
    
    mongoose.model('test').update({_id: _id}, {$set: {questions: quesArray}}).then((data) => {
      // console.log('executed')
      res.send()
    })
  })

})

app.post('/fetch-test', (req, res) => {
  mongoose.model('test').findOne({_id: req.body.testId}).then((data) => {
    res.send(data)
  })
})


app.post('/delete-data', (req, res) => {
  mongoose.model('test').remove(req.body).then((data) => {

  })
})

app.post("/update-database", (req, res) => {
  mongoose.model('test').findOneAndUpdate({_id: req.body.testId}, {
    testname: req.body.testname,
    questions: req.body.questions
  }).then((data) => {
 
  })
})


app.get('/add-question', (req, res) => {

  res.sendFile('views/add-page.html' , { root : __dirname});
});





app.get('/generate-link/:resultId', (req, res) => {

  res.sendFile('views/certificate.html' , { root : __dirname});    
});

app.post('/get-test-data', (req, res) => {
  mongoose.model('performance').find({_id: req.body.id}).then((data) => {
    
    res.send(data)
  })

});



app.listen(process.env.PORT || 3000, () => {
  console.log('Request recieving')
});

