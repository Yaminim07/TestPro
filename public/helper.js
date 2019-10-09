
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

  window.onblur = function(){
    if(illegalAttempt === 3){
      alert("Test cancelled")
      window.location.href = "../views/user.html"
    }

    else{
      alert("You cannot open new tab, only " + (3 - illegalAttempt) + " attempts left")
      illegalAttempt++
    }
  };

  score = 0;

  let elem = document.getElementsByClassName("test-page")
  elem[0].style.display = "block";
  document.getElementsByClassName("applyFade")[0].style.opacity = 0;  
  document.getElementsByTagName('header')[0].style.opacity = 0;
  document.getElementsByTagName('footer')[0].style.opacity = 0;      

  id = Number(test_id)

  continueTest(ques)
}

function continueTest(ques){
  if(index < 5){


    document.getElementById('option1').checked = false
    document.getElementById('option2').checked = false
    document.getElementById('option3').checked = false
    document.getElementById('option4').checked = false

    document.getElementsByClassName('check-tab')[0].style.background = "lightgray"
    document.getElementsByClassName('question-space')[0].innerHTML = activeTests[id - 1].questions[index].details
    // let first = document.getElementsByClassName('answer1')[0]
    // console.log(document.getElementById('answer1'))
    
  //  first.replaceChild(document.createTextNode(activeTests[id - 1].questions[index].answer),first.childNodes[1])
    let options = []
    options.push(activeTests[id - 1].questions[index].answer)
    options.push(activeTests[id - 1].questions[index].option1)
    options.push(activeTests[id - 1].questions[index].option2)
    options.push(activeTests[id - 1].questions[index].option3)

    let random = Math.floor(Math.random() * 3) + 1

    document.getElementById('answer1').innerHTML = options[random]
    random = (random + 1) % 4
    document.getElementById('answer2').innerHTML = options[random]
    random = (random + 1) % 4
    document.getElementById('answer3').innerHTML = options[random]
    random = (random + 1) % 4
    document.getElementById('answer4').innerHTML = options[random]

      
    answer = activeTests[id - 1].questions[index].answer
    // console.log(activeTests[id - 1])
    document.getElementById('option1').disabled = false
    document.getElementById('option2').disabled = false
    document.getElementById('option3').disabled = false
    document.getElementById('option4').disabled = false
  }
  else{
    window.onblur = false
    // save test details inclding score in database
    var request = new XMLHttpRequest()
    request.onreadystatechange = function(){
      // certificate details save in this.response
      // sendCertificateLink(JSON.parse(this.response))
      loadResult(JSON.parse(this.response))
    }
    console.log(activeTests[id - 1])
    var data = {
      testname: activeTests[id - 1].testname,
      score: score
    };
    request.open('POST','/save-test-details',true)

    request.setRequestHeader('Content-Type', 'application/json');

    request.send(JSON.stringify(data))
  }

}

function multipleChecked(first, second, third, fourth){
  let count = 0;
  if(first)
  count++;
  if(second)
  count++;
  if(third)
  count++
  if(fourth)
  count++
  if(count > 1)
  return true;
  return false;
}

function setCheckTabColor(){
  let first = document.getElementById('option1')
  let second = document.getElementById('option2')
  let third = document.getElementById('option3')
  let fourth = document.getElementById('option4')

  if(!first.checked && !second.checked && !third.checked && !fourth.checked){
    let popUp = document.getElementById('showPopUp')
    popUp.innerHTML = "You have not answered"
    if(!popUp.style.animation){
      
   
      popUp.style.animation = "cssAnimation 3s"
      popUp.style.animationDelay = "50ms"
    // popUp.style.opacity = 0;
    }

    else{
      let newNode = popUp.cloneNode(true)
      popUp.parentNode.replaceChild(newNode, popUp)
    }

  }
  
  else if(multipleChecked(first.checked, second.checked, third.checked, fourth.checked)){
    let popUp = document.getElementById('showPopUp')
    popUp.innerHTML = "Answer only one"
    if(!popUp.style.animation){
      
      popUp.style.animation = "cssAnimation 3s"
      popUp.style.animationDelay = "50ms"
    // popUp.style.opacity = 0;
    }

    else{
      let newNode = popUp.cloneNode(true)
      popUp.parentNode.replaceChild(newNode, popUp)
    }
  }

  else{
    if((first.checked && first.nextSibling.innerHTML === answer) || (second.checked && second.nextSibling.innerHTML === answer) || (third.checked && third.nextSibling.innerHTML === answer) || (fourth.checked && fourth.nextSibling.innerHTML === answer)){
      document.getElementsByClassName('check-tab')[0].style.background = "green"
    }

    else
    document.getElementsByClassName('check-tab')[0].style.background = "red"


    first.disabled = true
    second.disabled = true
    third.disabled = true
    fourth.disabled = true
  }

}

function checkAnswer(){
  let first = document.getElementById('option1')
  let second = document.getElementById('option2')
  let third = document.getElementById('option3')
  let fourth = document.getElementById('option4')
  // console.log(answer)
  if(!first.checked && !second.checked && !third.checked && !fourth.checked){
    let popUp = document.getElementById('showPopUp')
    popUp.innerHTML = "You have not answered"
    if(!popUp.style.animation){
      
   
      popUp.style.animation = "cssAnimation 3s"
      popUp.style.animationDelay = "50ms"
    // popUp.style.opacity = 0;
    }

    else{
      let newNode = popUp.cloneNode(true)
      popUp.parentNode.replaceChild(newNode, popUp)
    }

  }
  
  else if(multipleChecked(first.checked, second.checked, third.checked, fourth.checked)){
    let popUp = document.getElementById('showPopUp')
    popUp.innerHTML = "Answer only one"
    if(!popUp.style.animation){
      
      popUp.style.animation = "cssAnimation 3s"
      popUp.style.animationDelay = "50ms"
    // popUp.style.opacity = 0;
    }

    else{
      let newNode = popUp.cloneNode(true)
      popUp.parentNode.replaceChild(newNode, popUp)
    }
  }

  else{

    if(first.checked && first.nextSibling.innerHTML === answer){
      score++
    }

    else if(second.checked && second.nextSibling.innerHTML === answer){
      score++
    }

    else if(third.checked && third.nextSibling.innerHTML === answer){
      score++
    }

    else if(fourth.checked && fourth.nextSibling.innerHTML === answer){
      score++
    }

    first.disabled = true
    second.disabled = true
    third.disabled = true
    fourth.disabled = true

    index++
    ques = (ques + 1) % (activeTests[id - 1].questions.length)

    continueTest()

  }
}

function loadResult(data){
  let elem = document.getElementsByClassName("result")
  document.getElementsByClassName('score-holder')[0].innerHTML = score


  // document.getElementById('testname').innerHTML = data.testname
  // document.getElementById('username').innerHTML = data.username
  // document.getElementById('score').innerHTML = data.score
  let id = data._id
  document.getElementsByClassName('certificate-link')[0].setAttribute("href","/generate-link/" + id)
  document.getElementsByClassName('certificate-link')[0].setAttribute("id",id)

  elem[0].style.display = "block";
  document.getElementsByClassName("applyFade")[0].style.opacity = 0;  
  document.getElementsByClassName("test-page")[0].style.display = "none";

  // console.log(data)
}

function generateLink(data){
  var request = new XMLHttpRequest()
  request.open('POST','/generate-link',true)
  request.send(JSON.stringify(data))
}

var tests = []

function loadConfirmation(id){
  let curId = Number(id)
  if(confirm('Are you sure you want to delete?')){
    // delete data from database , delete that child from dom
    var req = new XMLHttpRequest()

    req.onreadystatechange = function(){

      for(let i = curId;i < yourTests.length; i++){
        let parent = document.getElementsByClassName('test')[0]
        let tempId = parent.children[i].children[2].children[1].getAttribute('id')
        parent.children[i].children[2].children[1].setAttribute('id', Number(tempId) - 1)
      }

      let parent = document.getElementsByClassName('test')[0]
      let child = parent.children[curId - 1]
      // console.log(child)
      parent.removeChild(child)
      yourTests.splice(curId - 1, 1)

    }

    req.open('POST','/delete-data',true)
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(yourTests[curId - 1]))

  }else{
    //do nothing
  }
}

function fetchData() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var newData = JSON.parse(this.response)
    yourTests = newData
    // console.log(yourTests)
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
      // editBtn.setAttribute("onclick","loadEditpage(this.id)")
      editBtn.setAttribute("href", "/update-page/" + (yourTests[i]._id))
      editBtn.setAttribute('id', i + 1)
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
      deleteBtn.setAttribute("onclick","loadConfirmation(this.id)")
      deleteBtn.setAttribute('id', i + 1)
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


function loadEditpage(id){

  currentTest = yourTests[Number(id) - 1]
  var req = new XMLHttpRequest()
  req.onreadystatechange = function(){
    // document.getElementsByClassName('testname')[0].value = currentTest.testname
    // for(let i = 0;i < currentTest.questions.length; i++){

    //   let wrapper = document.createElement('div')
    //   wrapper.setAttribute('class','question-wrapper')
    //   let ques = document.createElement('div')
    //   ques.setAttribute('class','question-added clearfix')
    //   let span = document.createElement('span')
    //   span.innerHTML = "Question " + (i + 1)
    //   let a = document.createElement('a')
    //   a.setAttribute("id", i + 1)
    //   a.setAttribute("onclick", "updateQuestion(this.id)")
    //   a.innerHTML = "VIEW"
    //   ques.appendChild(span)
    //   ques.appendChild(a)
    //   wrapper.appendChild(ques)
    //   let form = document.getElementById('form-element')
    //   form.insertBefore(wrapper, document.getElementsByClassName('add-question-btn')[0])

      // adding question details

    //   let hostQuestion = document.createElement("div")
    //   hostQuestion.setAttribute("class","host-question")
    //   hostQuestion.style.display = "none"

    //   let heading = document.createElement("h3")
    //   heading.innerHTML = "Question"
    //   let textArea = document.createElement("textarea")
    //   textArea.setAttribute("id","question")
    //   textArea.setAttribute("name","question")
    //   textArea.value = currentTest.questions[i].details
    //   hostQuestion.appendChild(heading)
    //   hostQuestion.appendChild(textArea)
    //   let refNode = document.getElementsByClassName('question-wrapper')[i]
    //   refNode.parentElement.insertBefore(hostQuestion, refNode.nextSibling)
    // }
  }
  req.open('POST','/update-question',true)
  req.send()

}

var testname;
var questions = []

function saveData(){
  let form = new FormData(document.getElementById('form-element'));
  
  let ques = form.get('question')
  let ans = form.get('answer')
  let option1 = form.get('option1')
  let option2 = form.get('option2')
  let option3 = form.get('option3')
  
  if(ques === "" || ans === "" || option1 === "" || option2 === "" || option3 === ""){
    let popUp = document.getElementById('showPopUp')
    popUp.innerHTML = "Fields Empty"
    if(!popUp.style.animation){
      
      popUp.style.animation = "cssAnimation 3s"
      popUp.style.animationDelay = "50ms"
    // popUp.style.opacity = 0;
    }

    else{
      let newNode = popUp.cloneNode(true)
      popUp.parentNode.replaceChild(newNode, popUp)
    }
  }

  else{
    var request = new XMLHttpRequest();
    var tempQuestions = {
      test_id: test_id,
      details: ques,
      answer: ans,
      option1: option1,
      option2: option2,
      option3: option3
    };
    newQuestions.push(tempQuestions)
    var data = JSON.stringify(tempQuestions)
    request.onreadystatechange = function(){
      if (this.readyState === 4 && this.status === 200) {
        document.getElementsByClassName('host-question')[0].style.display = "none"
        document.getElementsByClassName('add-answers')[0].style.display = "none"
        document.getElementsByClassName('done-btn')[0].style.display = "none"

        let wrapper = document.createElement('div')
        wrapper.setAttribute('class','question-wrapper')
        let ques = document.createElement('div')
        ques.setAttribute('class','question-added clearfix')
        let span = document.createElement('span')
        span.innerHTML = "Question " + newQuestions.length
        let a = document.createElement('a')
        a.setAttribute("id", newQuestions.length)
        a.setAttribute("onclick", "updateQuestion(this.id)")
        a.innerHTML = "VIEW"
        ques.appendChild(span)
        ques.appendChild(a)
        wrapper.appendChild(ques)
        let form = document.getElementById('form-element')
        form.insertBefore(wrapper, document.getElementsByClassName('add-question-btn')[0])

        // add question tab for editing

        let hostQuestion = document.createElement("div")
        hostQuestion.setAttribute("class","host-question")
        hostQuestion.style.display = "none"

        let heading = document.createElement("h3")
        heading.innerHTML = "Question"
        let textArea = document.createElement("textarea")
        textArea.setAttribute("id","question")
        textArea.setAttribute("name","question")
        textArea.value = newQuestions[newQuestions.length - 1].details
        hostQuestion.appendChild(heading)
        hostQuestion.appendChild(textArea)
        let refNode = document.getElementsByClassName('question-wrapper')[newQuestions.length - 1]
        refNode.parentElement.insertBefore(hostQuestion, refNode.nextSibling)

        //add answers tab for editing

        let addAnswers = document.createElement("div")
        addAnswers.setAttribute("class","add-answers")
        addAnswers.style.display = "none"

        //For correct answer
        let div1 = document.createElement("div")
        let input1 = document.createElement("input")
        input1.setAttribute("type","text")
        input1.setAttribute("id","correctAnswer")
        input1.setAttribute("name","answer")
        input1.value = newQuestions[newQuestions.length - 1].answer
        div1.appendChild(input1)


        //For option 1
        let div2 = document.createElement("div")
        let input2 = document.createElement("input")
        input2.setAttribute("type","text")
        input2.setAttribute("id","option1")
        input2.setAttribute("name","option1")
        input2.value = newQuestions[newQuestions.length - 1].option1
        div2.appendChild(input2)


        //For option 2
        let div3 = document.createElement("div")
        let input3 = document.createElement("input")
        input3.setAttribute("type","text")
        input3.setAttribute("id","option2")
        input3.setAttribute("name","option2")
        input3.value = newQuestions[newQuestions.length - 1].option2
        div3.appendChild(input3)


        //For option 3
        let div4 = document.createElement("div")
        let input4 = document.createElement("input")
        input4.setAttribute("type","text")
        input4.setAttribute("id","option3")
        input4.setAttribute("name","option3")
        input4.value = newQuestions[newQuestions.length - 1].option3
        div4.appendChild(input4)

        addAnswers.appendChild(div1)
        addAnswers.appendChild(div2)
        addAnswers.appendChild(div3)
        addAnswers.appendChild(div4)

        let newRefNode = document.getElementsByClassName('host-question')[newQuestions.length]
        newRefNode.parentNode.insertBefore(addAnswers, newRefNode.nextSibling)

      }
    }
    request.open('POST','/save-question',true)
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(data)
  }
}

function addQuestion(){

  if(document.getElementsByClassName('testname')[0].value === ""){
    let popUp = document.getElementById('showPopUp')
    popUp.innerHTML = "Please enter a test name"
    if(!popUp.style.animation){
      
      popUp.style.animation = "cssAnimation 3s"
      popUp.style.animationDelay = "50ms"
    // popUp.style.opacity = 0;
    }

    else{
      let newNode = popUp.cloneNode(true)
      popUp.parentNode.replaceChild(newNode, popUp)
    }
  }

  else{
    if(test_id === ""){
      let testBar = document.getElementsByClassName('testname')[0]
      testname = testBar.value
      testBar.disabled = true
      var request = new XMLHttpRequest();
      var data = JSON.stringify({
        testname: testname,
        questions: questions
      })
      request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(this.response)
          test_id = data.test_id
          console.log(test_id)
        }
      }
      request.open('POST','/add-question',true)
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(data)
 
    }

    document.getElementsByClassName('host-question')[0].style.display = "block"
    document.getElementsByClassName('add-answers')[0].style.display = "flex"
    document.getElementsByClassName('done-btn')[0].style.display = "block"
    // console.log('display')
  }

}

function updateQuestion(id){

 //display block

  let question = document.getElementsByClassName('host-question')[id - 1]
  let answers = document.getElementsByClassName('add-answers')[id - 1]

  if(!question.style.display && !answers.style.display){
    question.style.display = "block"
    answers.style.display = "flex"
  }

  else if(question.style.display === "none"){
    question.style.display = "block"
    answers.style.display = "flex"
  }

  else{
    question.style.display = "none"
    answers.style.display = "none"
  }

}

function setZero(){
  score = 0;
  index = 0;
  return true;
}

function updateTestDetails(){
  var req = new XMLHttpRequest()
  req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      var thisTest = JSON.parse(this.response)
      document.getElementsByClassName('testname')[0].value = thisTest.testname
      for(let i = 0;i < thisTest.questions.length; i++){
        // console.log('executed')
        let wrapper = document.createElement("div")
        wrapper.setAttribute("class","question-wrapper")

        let questionAdded = document.createElement("div")
        questionAdded.setAttribute("class","question-added clearfix")

        let span = document.createElement("span")
        span.innerHTML = "Question " + (i + 1)

        let a = document.createElement("a")
        a.innerHTML = "EDIT"
        a.setAttribute("id", i + 1)
        a.setAttribute("onclick","updateQuestion(this.id)")


        questionAdded.appendChild(span)
        questionAdded.appendChild(a)
        wrapper.appendChild(questionAdded)

        //question block

        let hostQuestion = document.createElement("div")
        hostQuestion.setAttribute("class","host-question")

        let h3 = document.createElement("h3")
        h3.innerHTML = "Question"

        let textarea = document.createElement("textarea")
        textarea.setAttribute("class","question")
        textarea.setAttribute("name","question")
        textarea.value = thisTest.questions[i].details

        hostQuestion.appendChild(h3)
        hostQuestion.appendChild(textarea)

        //answers block

        let addAnswers = document.createElement("div")
        addAnswers.setAttribute("class","add-answers")

        let div1 = document.createElement("div")
        let input1 = document.createElement("input")
        input1.setAttribute("class","correctAnswer")
        input1.setAttribute("type","text")
        input1.setAttribute("name","answer")
        input1.value = thisTest.questions[i].answer
        div1.appendChild(input1)

        let div2 = document.createElement("div")
        let input2 = document.createElement("input")
        input2.setAttribute("class","option1")
        input2.setAttribute("type","text")
        input2.setAttribute("name","answer")
        input2.value = thisTest.questions[i].option1
        div2.appendChild(input2)

        let div3 = document.createElement("div")
        let input3 = document.createElement("input")
        input3.setAttribute("class","option2")
        input3.setAttribute("type","text")
        input3.setAttribute("name","answer")
        input3.value = thisTest.questions[i].option2
        div3.appendChild(input3)

        let div4 = document.createElement("div")
        let input4 = document.createElement("input")
        input4.setAttribute("class","option3")
        input4.setAttribute("type","text")
        input4.setAttribute("name","answer")
        input4.value = thisTest.questions[i].option3
        div4.appendChild(input4)

        addAnswers.appendChild(div1)
        addAnswers.appendChild(div2)
        addAnswers.appendChild(div3)
        addAnswers.appendChild(div4)

        let form = document.getElementById('form-element')
        let ref = document.getElementsByClassName('add-question-btn')[0]
        form.insertBefore(wrapper, ref)
        form.insertBefore(hostQuestion, ref)
        form.insertBefore(addAnswers, ref)

      }
    }
  }

  req.open('POST','/fetch-test',true)
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify({
    testId: testId
  }))
}

function updateDetails(){
  let form = document.getElementById("form-element")
  let count = (form.children.length - 3) / 3
  let questions = []
  for(let i = 0;i < count; i++){

    let quesNumber = {}
    quesNumber.details = document.getElementsByClassName("question")[i].value
    quesNumber.answer = document.getElementsByClassName("correctAnswer")[i].value
    quesNumber.option1 = document.getElementsByClassName("option1")[i].value
    quesNumber.option2 = document.getElementsByClassName("option2")[i].value
    quesNumber.option3 = document.getElementsByClassName("option3")[i].value

    questions.push(quesNumber)

    document.getElementsByClassName("host-question")[i].style.display = "none"
    document.getElementsByClassName("add-answers")[i].style.display = "none"


  }
 
  let reqData = {}
  reqData.testname = document.getElementsByClassName("testname")[0].value
  reqData.questions = questions
  reqData.testId = testId
  var request = new XMLHttpRequest()
  request.onreadystatechange = function(){
    let popUp = document.getElementById("updatePopUp")
    popUp.innerHTML = "Test details updated"
    if(!popUp.style.animation){
      popUp.style.animation = "cssAnimation 3s"
      popUp.style.animationDelay = "50ms"
   
    }

    else{
      let newNode = popUp.cloneNode(true)
      popUp.parentNode.replaceChild(newNode, popUp)
    }
  }

  request.open("POST","/update-database",true)
  request.setRequestHeader('Content-Type', 'application/json')
  request.send(JSON.stringify(reqData))
  

}

function setAJAXRequest(method, url, data, header, callBack){
  var request = new XMLHttpRequest()

  if(callBack){
    request.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 400){
        callBack()
      }
    }
  }

  request.open(method, url, true)
  request.send((data) ? (JSON.stringify(data)) : undefined)
}
