using FNote.Models;
using FNote.Utils;
using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace FNote.CSharpJS {
    /// <summary>
    /// 笔记工具类
    /// </summary>
    public class NoteUtils {

        private SqlSugar.SqlSugarClient db;

        internal NoteUtils() {
            db = DBUtils.GetDbInstances;

        }


        internal List<NoteTitle> GetNotesTitle() {
            var NotesTitle = db.Queryable<NoteTitle>().ToList();
            return NotesTitle;
        }

        internal string CreateTitle(string noteTiltle) {
            NoteTitle noteTitle = new NoteTitle();
            noteTitle.n_title = noteTiltle;
            noteTitle.n_length = 0;
            noteTitle.create_time = DateTime.Now.ToString();
            db.Insertable(noteTitle).ExecuteCommand();
            var noteID = db.Queryable<NoteTitle>().Max(nt => nt.id);
            NoteContent noteContent = new NoteContent();
            noteContent.n_title_id = noteID;
            db.Insertable(noteContent).ExecuteCommand();
            return noteID.ToString();
        }

        internal void DeleteTitle(int id) {
            var noteTitleList = db.Queryable<NoteTitle>().Where(nt => nt.id == id).ToList();
            if (noteTitleList.Count > 0) {
                var noteTitle = noteTitleList[0];
                db.Deleteable(noteTitle).ExecuteCommand();
            }
        }


        internal void UpdateNoteTitle(int id, string title) {
            var noteTitleList = db.Queryable<NoteTitle>().Where(nt => nt.id == id).ToList();
            if (noteTitleList.Count > 0) {
                var noteTitle = noteTitleList[0];
                noteTitle.n_title = title;
                db.Updateable(noteTitle).ExecuteCommand();
            }
        }


        internal NoteContent GetNoteContent(int id) {
            var noteContentList = db.Queryable<NoteContent>().Where(it => it.n_title_id == id).ToList();
            return noteContentList.Count > 0 ? noteContentList[0] : null;
        }

        internal async void SetNoteContent(int noteID, string content,int length) {
            var noteContentList = db.Queryable<NoteContent>().Where(nc => nc.n_title_id == noteID).ToList();
            if (noteContentList.Count > 0) {
                var noteContent = noteContentList[0];
                noteContent.n_content = content;
                await db.Updateable(noteContent).ExecuteCommandAsync();
                var noteTitles = db.Queryable<NoteTitle>().Where(nt => nt.id == noteID).ToList();
                if (noteTitles.Count > 0) {
                    var noteTitle = noteTitles[0];
                    noteTitle.n_length = length;
                    db.Updateable(noteTitle).ExecuteCommand();
                }
            }
        }
        internal async void SetHistoryNoteContent(int noteID, string content) {
            // 比较历史中是否存在此文本了
            byte[] result = Encoding.Default.GetBytes(content);    
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] output = md5.ComputeHash(result);
            var contentMD5 = BitConverter.ToString(output).Replace("-", "");
            var noteContentList = db.Queryable<NoteContentHistory>().Where(nc => nc.n_title_id == noteID && nc.n_md5.Equals(contentMD5)).ToList();
            if(noteContentList.Count > 0){
                return;
            }
            // 新增历史
            NoteContentHistory noteContent = new NoteContentHistory();
            noteContent.n_title_id = noteID;
            noteContent.n_content = content;
            noteContent.n_md5 = contentMD5;
            noteContent.create_time = DateTime.Now.ToString();
            await db.Insertable(noteContent).ExecuteCommandAsync();
        }

        internal List<NoteContentHistory> GetHistoryNoteContent(int id) {
            var noteTitleList = db.Queryable<NoteContentHistory>().Where(nt => nt.n_title_id == id).OrderBy(nt => nt.create_time, OrderByType.Desc).ToList();
            return noteTitleList;
        }
    }
}
