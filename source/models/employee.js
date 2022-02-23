var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    name: String,
    mobile: String
  });

var employee = mongoose.model('employee', employeeSchema);

module.exports = employee;