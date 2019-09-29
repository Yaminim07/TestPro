// const schema = require('./models/schema')
const mongoose = require('mongoose')

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


var activeTests = [];

function loadTests(){
  var request = new XMLHttpRequest
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      var newData = JSON.parse(this.response)
      activeTests = newData
      for(let i = 0;i < newData.length; i++){
        let testFlex = document.createElement("div")
        testFlex.setAttribute("class","test-flex")

        //testBar creation
        let testBar = document.createElement("div")
        testBar.setAttribute("class","testbar clearfix")
        testBar.setAttribute("onclick","showDetails(" + i + 1 + ")")
        let a = document.createElement("a")
        a.setAttribute("onclick","loadTest(this.id)")
        a.setAttribute("id", i + 1)
        a.innerHTML = "START"
        let span = document.createElement("span")
        span.innerHTML = newData[i].testname
        testBar.appendChild(a)
        testBar.appendChild(span)


        //testDetails creation
        let testDetails = document.createElement("div")
        testDetails.setAttribute("class","test-details")
        let p = document.createElement("p")
        //Host name fetching from database
        // var host = mongoose.model("user").findOne({id: newData[i].host_id})
        // p.innerHTML = "This test is hosted by " + host.username
        testDetails.appendChild(p)

        testFlex.appendChild(testBar)
        testFlex.appendChild(testDetails)
        document.getElementsByClassName("test-wrapper")[0].appendChild(testFlex)
      }
    }
  }
  request.open('GET','/load-tests',true)
  request.send()
}

var index = 0;
var score = 0;

function loadTest(test_id){
  let elem = document.getElementsByClassName("test-page")
  elem[0].style.display = "block";
  document.getElementsByClassName("applyFade")[0].style.opacity = 0.4;        
  // document.getElementsByClassName("image-container")[0].style.opacity = 0.4;
  id = Number(test_id)
  continueTest()
  // index = 0
}

function continueTest(){
  if(index < 2){
    document.getElementsByClassName('question-space')[0].innerHTML = activeTests[id - 1].questions[index].details
    document.getElementsByClassName('option1')[0].appendChild(document.createTextNode(activeTests[id - 1].questions[index].answer))
    document.getElementsByClassName('option2')[0].appendChild(document.createTextNode(activeTests[id - 1].questions[index].option1))
    document.getElementsByClassName('option3')[0].appendChild(document.createTextNode(activeTests[id - 1].questions[index].option2))
    document.getElementsByClassName('option4')[0].appendChild(document.createTextNode(activeTests[id - 1].questions[index].option3))
    answer = activeTests[id - 1].questions[index].answer
    document.getElementById('option1').disabled = false
    document.getElementById('option2').disabled = false
    document.getElementById('option3').disabled = false
    document.getElementById('option4').disabled = false
  }
  else{
    loadResult()
  }

}

function checkAnswer(){
  let first = document.getElementById('option1')
  let second = document.getElementById('option2')
  let third = document.getElementById('option3')
  let fourth = document.getElementById('option4')
  console.log(answer)
  if(!first.checked && !second.checked && !third.checked && !fourth.checked)
  alert('You have not answered')


  else{
    // console.log(answer)
    // console.log(first.nextSibling)
    if(first.checked && first.nextSibling.nodeValue === answer){
      document.getElementsByClassName('check-tab')[0].style.background = "green"
      score++
    }

    else if(second.checked && second.nextSibling.nodeValue === answer){
      document.getElementsByClassName('check-tab')[0].style.background = "green"
      score++
    }

    else if(third.checked && third.nextSibling.nodeValue === answer){
      document.getElementsByClassName('check-tab')[0].style.background = "green"
      score++
    }

    else if(fourth.checked && fourth.nextSibling.nodeValue === answer){
      document.getElementsByClassName('check-tab')[0].style.background = "green"
      score++
    }

    else
    document.getElementsByClassName('check-tab')[0].style.background = "red"

    first.disabled = true
    second.disabled = true
    third.disabled = true
    fourth.disabled = true

    index++
  }
}


function loadResult(){
  let elem = document.getElementsByClassName("result")
  elem[0].style.display = "block";
  document.getElementsByClassName("applyFade")[0].style.opacity = 0.4;  
  document.getElementsByClassName("test-page")[0].style.display = "none";
  console.log(score)
}


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
    'details': form.get('question'),
    'answer': form.get('answer'),
    'option1': form.get('option1'),
    'option2': form.get('option2'),
    'option3': form.get('option3')
  })
}

