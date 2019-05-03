//___________________
//Dependencies
//___________________
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//___________________
//Set up Schema
//___________________
const thingsSchema = new Schema ({
  Things : String,
  checked: false
});

//___________________
//Set up Model
//___________________
const Things = mongoose.model('Things', thingsSchema);

//___________________
////Module Exports
//___________________
module.exports = Things;
