using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MNote.Entity {
    public class FConfig {
        public FConfig() {

        }

        public void SaveConfig() {
            var jsonStr = JsonConvert.SerializeObject(this);
            var jsonPath = AppDomain.CurrentDomain.BaseDirectory + "/FConfig.json";
            if (File.Exists(jsonPath)) {
                File.Delete(jsonPath);
            }
            File.WriteAllText(jsonPath, jsonStr);
        }
        public int preview_speed { get; set; }

        public int auto_backup_day { get; set; }

        public string history_keyboard_shortcut { get; set; }

        public string data_backup_path { get; set; }

        public bool is_shutdown_software { get; set; }
    }


}
