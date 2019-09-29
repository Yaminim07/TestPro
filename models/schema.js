const mongoose = require('mongoose')
const schema = mongoose.Schema;

const question = new schema({
  details: String,
  answer: String,
  option1: String,
  option2: String,
  option3: String
});


const test = new schema({
  testname: String,
  host_id: String,
  questions: [question]
});

const performance = new schema({
  testname: String,
  username: String,
  score: Number
});

const Performance = mongoose.model('performance',performance)

const Test = mongoose.model('test',test)

module.exports = {
  Test: Test,
  Performance: Performance
};

