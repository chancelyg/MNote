using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FNote.Utils {
    /// <summary>
    /// SQL语句
    /// 作者：Chancel.Yang
    /// </summary>
    public class SQLText {
        private SQLText() {
        }


        #region 建表
        private const string CreateTNOTE = "CREATE TABLE 't_note_title' (" +
            "'id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
            "'n_title' TEXT NOT NULL," +
            "'n_length' INTEGER NOT NULL," + 
            "'create_time' TEXT NOT NULL," +
            "'update_time' TEXT" +
            ");";

        private const string CreateTNOTECONTENT = "CREATE TABLE 't_note_content'(" +
            "'id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
            "'n_title_id' INTEGER NOT NULL," +
            "'n_content' TEXT(100)," +
            "CONSTRAINT 'fk_n_title_id_n_note_title' FOREIGN KEY('n_title_id') REFERENCES 't_note_title' ('id')" + 
            ");";
        #endregion

        public static List<string> GetCreateTableSQL() {
            var sqlList = new List<string>();
            sqlList.Add(CreateTNOTE);
            sqlList.Add(CreateTNOTECONTENT);
            return sqlList;
        }
    }
}
