using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FNote.Utils {
    public class IOEUtils {
        public static async void SaveBackupDB() {
            await Task.Run(() => {
                var currentDBPath = AppDomain.CurrentDomain.BaseDirectory + @"DataBase\\NoteDB.db";
                if (File.Exists(currentDBPath)) {
                    // 判断备份文件夹是否存在
                    var backupFolderPath = AppDomain.CurrentDomain.BaseDirectory + @"backupData";
                    if (!Directory.Exists(backupFolderPath)) {
                        Directory.CreateDirectory(backupFolderPath);
                    }
                    // 判断备份文件数量
                    var files = Directory.GetFiles(backupFolderPath, "*.db");
                    if (files.Length > 5) {
                        foreach (var fileName in files) {
                            FileInfo file = new FileInfo(fileName);
                            if (file.Name.Split('.').Length > 0) {
                                string createDate = file.Name.Split('.')[0];
                                DateTime createDT = DateTime.ParseExact(createDate, "yyyyMMdd", System.Globalization.CultureInfo.CurrentCulture);
                                DateTime beforeBy5day = DateTime.Now.AddDays(-5);
                                if (DateTime.Compare(createDT, beforeBy5day) <= 0)
                                    file.Delete();
                            }
                        }
                    }
                }
                string currentDate = DateTime.Now.ToString("yyyyMMdd");
                var backupFileing = AppDomain.CurrentDomain.BaseDirectory + @"backupData\" + currentDate + ".db";
                if (!File.Exists(backupFileing)) {
                    File.Copy(currentDBPath, backupFileing);
                }

        });
        }
    }
}
