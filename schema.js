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


const Test = mongoose.model('test',test)

module.exports = {
  Test: Test
};

