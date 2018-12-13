using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;

namespace FNote.Utils {
    class DBUtils {

        private DBUtils() {
        }
        private static string sqlConnectStr = "Data Source=" + AppDomain.CurrentDomain.BaseDirectory + @"DataBase\NoteDB.db";

        private static SqlSugar.SqlSugarClient dbInstances;



        /// <summary>
        /// 获取数据库连接实例
        /// </summary>
        public static SqlSugar.SqlSugarClient GetDbInstances {
            get {

                return dbInstances = new SqlSugar.SqlSugarClient(new SqlSugar.ConnectionConfig() {
                        ConnectionString = sqlConnectStr, 
                        DbType = SqlSugar.DbType.Sqlite, 
                        IsAutoCloseConnection = true
                    }); 
            }
        }
    }
}
