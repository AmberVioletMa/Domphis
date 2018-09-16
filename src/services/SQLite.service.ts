import { Injectable} from "@angular/core";
import { SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class SQLiteService {
  db: SQLiteObject = null;

  constructor() {}

  setDatabase(db: SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  createTable(){
    let sql = 'CREATE TABLE IF NOT EXISTS Dispositivos(id INTEGER PRIMARY KEY AUTOINCREMENT, TITLE TEXT, IMG TEXT, KEYID TEXT, TOPICID TEXT)';
    return this.db.executeSql(sql, []);
  }

  getAll(){
    let sql = 'SELECT * FROM Dispositivos';
    return this.db.executeSql(sql, [])
    .then(response => {
      let Dispositivos = [];
      for (let index = 0; index < response.rows.length; index++) {
        Dispositivos.push( response.rows.item(index) );
      }
      return Promise.resolve( Dispositivos );
    })
    .catch(error => Promise.reject(error));
  }

  create(TITULO,IMG,KEYID,TOPICID){
    let sql = 'INSERT INTO Dispositivos(TITLE, IMG, KEYID, TOPICID) VALUES(?,?,?,?)';
    return this.db.executeSql(sql, [TITULO, IMG, KEYID, TOPICID]);
  }

  update(TITULO,IMG,KEYID,TOPICID,id){
    let sql = 'UPDATE Dispositivos SET TITLE=?, IMG=?, KEYID=?, TOPICID=? WHERE id=?';
    return this.db.executeSql(sql, [TITULO, IMG, KEYID, TOPICID, id]);
  }

  delete(id){
    let sql = 'DELETE FROM Dispositivos WHERE id=?';
    return this.db.executeSql(sql, [id]);
  }

}
