using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FNote.Models {
    [SugarTable("t_note_content")]
    public class NoteContent {
        [SugarColumn(IsPrimaryKey = true, IsIdentity = true, ColumnName = "id")]
        public int id{
            get;set;
        }

        public int n_title_id{
            get;set;
        }

        public string n_content{
            get;set;
        }
    }
}
