var db = require('../db.js');

save_user_information = (data) => new Promise((resolve, reject)=>{
  db.query('INSERT INTO lottery_information SET ?', data, function (err,results, fields){

    if(err){
      reject('could not insert into lottery information');
    }
    resolve('Successful');
  });
})

get_total_amount = (data) => new Promise((resolve, reject)=>{
  db.query('SELECT sum(amount) as total_amount from lottery_information', data, function (err,results, fields){

    if(err){
      reject('Could not get total amount');
    }
    resolve(results);
  });
})

get_list_of_participants = (data) => new Promise((resolve,reject)=>{
  db.query('SELECT email FROM lottery_information',null,function(err,results,fields){
    if(err){
      reject('could not fetch list of participants');
    }
    resolve(results);
  });
});

delete_users = (data) => new Promise((resolve,reject)=>{
  db.query('delete from  where ID > 0', null, function(err,results,fields){
    if(err){
      reject("could not delete all users");
    }
    resolve("Success Lottery Reset : All users deleted");

  });
});

module.exports = {
  save_user_information,
  get_list_of_participants,
  delete_users
}
