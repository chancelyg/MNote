using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FNote.Models {
    [SugarTable("t_note_title")]
    public class NoteTitle {
        [SugarColumn(IsPrimaryKey = true, IsIdentity = true, ColumnName = "id")]
        public int id {
            get; set;
        }
        public string n_title {
            get; set;
        }

        public int? n_length {
            get;set;
        }

        public string create_time {
            get; set;
        }
        public string update_time {
            get; set;
        }

    }
}
