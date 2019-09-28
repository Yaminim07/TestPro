// const schema = require('./models/schema')
// const mongoose = require('mongoose')

// mongoose.model('tests').remove({})

// new schema.Test({
//   testname: 'JAVASCRIPT',
//   host_id: '5d8e6293f7016817f8eb170a',
//   questions: [{
//     details: 'lorem ipsum1',
//     answer: '1',
//     option1: '4',
//     option2: '5',
//     option3: '10'
//   }, {
//     details: 'lorem ipsum2',
//     answer: '2',
//     option1: '4',
//     option2: '5',
//     option3: '10'
//   }, {
//     details: 'lorem ipsum3',
//     answer: '3',
//     option1: '4',
//     option2: '5',
//     option3: '10'
//   }]
// }).save().then((data) => {
//   // console.log(data)
// })


var tests = []

function loadConfirmation(){
  
}


function fetchData() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var newData = JSON.parse(this.response)
    tests = newData
    console.log(newData)
    let parent = document.getElementsByClassName('test')[0]
    for(let i = 0;i < newData.length;i++){
      let topicContainer = document.createElement("div")
      topicContainer.setAttribute("class",'topic-container')
      let h4 = document.createElement("h4")
      h4.innerHTML = "TOPIC"
      let p = document.createElement("p")
      p.innerHTML = newData[i].testname
      topicContainer.appendChild(h4)
      topicContainer.appendChild(p)
      let questionContainer = document.createElement("div")
      questionContainer.setAttribute("class",'question-container')
      h4 = document.createElement("h4")
      h4.innerHTML = "Questions"
      p = document.createElement("p")
      p.innerHTML = newData[i].questions.length
      questionContainer.appendChild(h4)
      questionContainer.appendChild(p)

      //Edit btn

      let btnContainer = document.createElement("div")
      btnContainer.setAttribute("class","btn-container clearfix")
      let editBtn = document.createElement("a")
      editBtn.setAttribute("class","edit-btn")
      let icon = document.createElement("i")
      icon.setAttribute("class","fa fa-pencil")
      let txt = document.createElement("span")
      txt.innerHTML = "EDIT"
      editBtn.appendChild(icon)
      editBtn.appendChild(txt)
      btnContainer.appendChild(editBtn)

      //Delete btn

      let deleteBtn = document.createElement("a")
      deleteBtn.setAttribute("class","delete-btn")
      deleteBtn.setAttribute("onclick","loadConfirmation()")
      icon = document.createElement("i")
      icon.setAttribute("class","fa fa-trash")
      txt = document.createElement("span")
      txt.innerHTML = "DELETE"
      deleteBtn.appendChild(icon)
      deleteBtn.appendChild(txt)
      btnContainer.appendChild(deleteBtn)


      let yourTest = document.createElement("div")
      yourTest.setAttribute("class","your-test clearfix")
      yourTest.appendChild(topicContainer)
      yourTest.appendChild(questionContainer)
      yourTest.appendChild(btnContainer)
      parent.appendChild(yourTest)
    }
  }
  };
  request.open('GET','/fetch-data', true)
  request.send();
}




var testname;
var questions = []
function saveData(){
  var request = new XMLHttpRequest();
  var data = JSON.stringify({
    testname: testname,
    questions: questions
  })
  request.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
     
    }
  }
  request.open('POST','/add-question',true)
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(data)
}

function addQuestion(){
  let form = new FormData(document.getElementById('form-element'));
  testname = form.get('testname')
  questions.push({
    'question': form.get('question'),
    'answer': form.get('answer'),
    'option1': form.get('option1'),
    'option2': form.get('option2'),
    'option3': form.get('option3')
  })
}

