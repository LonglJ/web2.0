var mysql = require ('mysql');

var db_config = {
  host : '127.0.0.1',
  user : 'root';
  password: 'password',
  database : 'webapp'
}

var connection;

function handDisssconnect(){
  connection = mysql.createConnection(db_config);
  connection.connect(function err){
    if(err){
      console.log('error connecting to the db : ',err);
      setTimout(handleDisconnect,2000);
    }
  });
  connectio.on('error',function(err)(
    if(err.code === 'PROTOCOL_CONNECTION_LOST'){
      handleDisconnect();
    }else{
      throw err;
    }
  });
}

handleDisconnect();
