const mongoose = require('mongoose')
const schema = mongoose.Schema;

const hosts = new schema({
  email: String
});

// hosts.methods.checkHostList =  (email) => {
//   this.findOne({
//     email: email
//   }).then((user) => {
//     if(user)
//     return true
//     return false
//   })
// }

const hostList = mongoose.model('hosts',hosts)

module.exports = hostList;

