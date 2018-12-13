using SqlSugar;

namespace FNote.Models {
    /// <summary>
    /// 笔记内容历史表
    /// 作者：杨灿书（Chancel.Yang）
    /// </summary>
    [SugarTable("t_note_content_history")]
    class NoteContentHistory {
        [SugarColumn(IsPrimaryKey = true, IsIdentity = true, ColumnName = "id")]
        public int id {
            get; set;
        }

        public int n_title_id {
            get; set;
        }

        public string n_content {
            get; set;
        }

        public string n_md5 { get; set; }

        public string create_time {
            get; set;
        }
    }
}
