importClass('android.database.sqlite.SQLiteDatabase');
auto.waitFor();
console.show();
var db_name="tiku.db"
var tiku_url='https://ghproxy.com/https://raw.githubusercontent.com/mondayfirst/XXQG_TiKu/main/%E9%A2%98%E5%BA%93_%E6%8E%92%E5%BA%8F%E7%89%88.json';

var db = SQLiteDatabase.openOrCreateDatabase(files.cwd() + "/" + db_name,null);
if(!db) {
    console.log("无法打开数据库:" + db_name);
    exit;
}
db.execSQL(
        "CREATE TABLE IF NOT EXISTS " +
          "tiku" +
          "(" +
          "`question` varchar, " +
          "`answer` varchar" +
          ")"
      );

var cu = db.rawQuery("select count(*) from tiku",  null);
var db_count=0;
if (cu.moveToFirst()) {
    db_count = cu.getString(0);
    cu.close();
}

console.info("当前数据库记录数:" + db_count);


function get_tiku_by_http(link) {
  // 通过gitee的原始数据保存题库

  let req = http.get(link);
  
  // 更新题库时若获取不到，则文件名+1
  if (req.statusCode != 200) {
    log(req.statusCode);  
    throw "网络原因未获取到题库，请尝试切换流量或者更换114DNS，退出脚本";
    return false;
  }
  return JSON.stringify(req.body.json());
}

var json_count=0;
var json_tiku = get_tiku_by_http(tiku_url);
//json_tiku = files.read(files.cwd()+"/tiku.json");
if(json_tiku) {

    
    JSON.parse(json_tiku,function(key, value) {
    if(key!="")
        json_count++;
    });
    console.info("JSON题库记录数:" + json_count);


    if(db_count != json_count && json_count > 0) {
        if(db_count !=0 ) {
            db.execSQL("DROP TABLE tiku");
            db.execSQL("vacuum");
            db.execSQL(
                    "CREATE TABLE IF NOT EXISTS " +
                      "tiku" +
                      "(" +
                      "`question` varchar, " +
                      "`answer` varchar" +
                      ")"
                  );
            //db.execSQL("delete from tiku");      
            //db.execSQL("vacuum");
        }
        db_count=0;
        db.beginTransaction();
        JSON.parse(json_tiku,function(key, value) {
            if(key!=""){
                var question=key;
                var answer=value;                
                var sqlStr = "INSERT INTO " +
                    "tiku(question, answer) " + 
                    "values('" + 
                    question + "', '" +
                    answer + "') " ;
                db.execSQL(sqlStr);
                db_count ++;
                
            }
        })
        db.setTransactionSuccessful();
        db.endTransaction();
        console.info("题库已更新，重新生成题库记录数:"+ db_count);
        db.close();
        
        
    }
    else if(db_count == json_count){
        console.info("记录数无变化，题库未更新");
    }
    else {
        console.info("未获取到有效题库记录");
    }

}
console.info("10s后自动关闭提示窗口");
sleep(10000);
console.hide();
