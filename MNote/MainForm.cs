using Chromium;
using Chromium.Remote;
using Chromium.Remote.Event;
using FNote.CSharpJS;
using FNote.Models;
using FNote.Utils;
using MNote.Entity;
using NetDimension.NanUI;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace FNote {
    public partial class MainForm : Formium {

        NoteUtils noteUtils = new NoteUtils();

        private List<NoteContentHistory> noteContentHistoryList;


        public MainForm() : base("http://local.fnote/FNEdit/index.html") {
            InitializeComponent();
            InitJsObject();
            LoadHandler.OnLoadStart += LoadHandler_OnLoadStart;
        }
        private void LoadHandler_OnLoadStart(object sender, Chromium.Event.CfxOnLoadStartEventArgs e) {

#if DEBUG
            Chromium.ShowDevTools();
            nfyMain.Visible = false;
#endif
        }
        #region CSharp和JavaScript的交互

        private void InitJsObject() {

            var noteUtilsJsObj = GlobalObject.AddObject("NoteUtils");

            var hideWinFormCsFunc = noteUtilsJsObj.AddFunction("HideWinForm");
            hideWinFormCsFunc.Execute += HideWinFormCsFunc_Execute;

            var getTitleFormCSFunc = noteUtilsJsObj.AddFunction("GetTitle");
            getTitleFormCSFunc.Execute += GetTitleFormCSFunc_Execute;

            var setNoteToFormCSFunc = noteUtilsJsObj.AddFunction("SaveNewNote");
            setNoteToFormCSFunc.Execute += SetNoteToFormCSFunc_Execute;

            var getNoteContentFormCSFunc = noteUtilsJsObj.AddFunction("GetNoteContent");
            getNoteContentFormCSFunc.Execute += GetNoteContentFormCSFunc_Execute;

            var setNoteContentFormCSFunc = noteUtilsJsObj.AddFunction("SetNoteContent");
            setNoteContentFormCSFunc.Execute += SetNoteContentFormCSFunc_Execute;

            var SetHistoryNoteContentFormCSFunc = noteUtilsJsObj.AddFunction("SetHistoryNoteContent");
            SetHistoryNoteContentFormCSFunc.Execute += SetHistoryNoteContentFormCSFunc_Execute;

            var UpdateNoteTitleFormCSFunc = noteUtilsJsObj.AddFunction("UpdateNoteTitle");
            UpdateNoteTitleFormCSFunc.Execute += UpdateNoteTitleFormCSFunc_Execute;

            var DeleteNoteTitleFormCSFunc = noteUtilsJsObj.AddFunction("DeleteNoteTitle");
            DeleteNoteTitleFormCSFunc.Execute += DeleteNoteTitleFormCSFunc_Execute;

            var GetNoteContentHistoryFormCSFunc = noteUtilsJsObj.AddFunction("GetNoteContentHistory");
            GetNoteContentHistoryFormCSFunc.Execute += GetNoteContentHistoryFormCSFunc_Execute;

            var GetHistoryContentFormCSFunc = noteUtilsJsObj.AddFunction("GetHistoryContent");
            GetHistoryContentFormCSFunc.Execute += GetHistoryContentFormCSFunc_Execute;
            
            var CloseFormCSFunc = noteUtilsJsObj.AddFunction("Close");
            CloseFormCSFunc.Execute += CloseFormCSFunc_Execute;

            var SelectDataPathFormCSFunc = noteUtilsJsObj.AddFunction("SelectDataPath");
            SelectDataPathFormCSFunc.Execute += SelectDataPathFormCSFunc_Execute;

            var GetConfigFormCSFunc = noteUtilsJsObj.AddFunction("GetConfig");
            GetConfigFormCSFunc.Execute += GetConfigFormCSFunc_Execute;

            var SetConfigFormCSFunc = noteUtilsJsObj.AddFunction("SetConfig");
            SetConfigFormCSFunc.Execute += SetConfigFormCSFunc_Execute;


        }

        private void SetConfigFormCSFunc_Execute(object sender, CfrV8HandlerExecuteEventArgs e) {
            EvaluateJavascript("app.GetConfig()", (value, exception) =>
            {
                if (value.IsString) {
                    // Get value from Javascript.
                    var jsValue = value.StringValue;
                    CommonUtils.ConfigInstance = JsonConvert.DeserializeObject<FConfig>(jsValue);
                }
            });
        }

        private void GetConfigFormCSFunc_Execute(object sender, CfrV8HandlerExecuteEventArgs e) {
            var config = JsonConvert.SerializeObject(CommonUtils.ConfigInstance);
            var jsObjectAccessor = new CfrV8Accessor();
            var jsObject = CfrV8Value.CreateObject(jsObjectAccessor);
            jsObject.SetValue("config", config, CfxV8PropertyAttribute.DontDelete);
            e.SetReturnValue(jsObject);
        }

        private void SelectDataPathFormCSFunc_Execute(object sender, CfrV8HandlerExecuteEventArgs e) {
            FolderBrowserDialog path = new FolderBrowserDialog();
            path.ShowDialog();
            if(path.SelectedPath != "" && path.SelectedPath != null) {
                // 移动数据库文件

                // 连接数据库
                // 返回成功标志给前端
            }
        }

        private void GetHistoryContentFormCSFunc_Execute(object sender, CfrV8HandlerExecuteEventArgs e) {
            var htime = e.Arguments.FirstOrDefault(p => p.IsString).ToString();
            foreach(var item in noteContentHistoryList){
                if(item != null && item.create_time.Equals(htime)){
                    var jsObjectAccessor = new CfrV8Accessor();
                    var jsObject = CfrV8Value.CreateObject(jsObjectAccessor);
                    jsObject.SetValue("n_content", item.n_content, CfxV8PropertyAttribute.DontDelete);
                    e.SetReturnValue(jsObject);
                    break;
                }
            }

        }

        private void GetNoteContentHistoryFormCSFunc_Execute(object sender, CfrV8HandlerExecuteEventArgs e) {
            var noteID = e.Arguments.FirstOrDefault(p => p.IsString).ToString();
            noteContentHistoryList = noteUtils.GetHistoryNoteContent(Convert.ToInt32(noteID));
            if (noteContentHistoryList != null && noteContentHistoryList.Count > 0) {
                var jsObjectAccessor = new CfrV8Accessor();
                var jsObject = CfrV8Value.CreateObject(jsObjectAccessor);
                var noteListArray = CfrV8Value.CreateArray(noteContentHistoryList.Count);
                int i = 0;
                foreach (var note in noteContentHistoryList) {
                    noteListArray.SetValue(i, note.create_time);
                    i++;
                }
                jsObject.SetValue("historyArray", noteListArray, CfxV8PropertyAttribute.DontDelete);
                e.SetReturnValue(jsObject);
            }
        }

        private void CloseFormCSFunc_Execute(object sender, CfrV8HandlerExecuteEventArgs e) {
            var config = CommonUtils.ConfigInstance;
            if(config.is_shutdown_software){
                Application.Exit();
            }
            this.Hide();
        }

        private void HideWinFormCsFunc_Execute(object sender, Chromium.Remote.Event.CfrV8HandlerExecuteEventArgs e) {
            this.Hide();
        }

        private void DeleteNoteTitleFormCSFunc_Execute(object sender, Chromium.Remote.Event.CfrV8HandlerExecuteEventArgs e) {
            var noteID = e.Arguments.FirstOrDefault(p => p.IsString).ToString();
            noteUtils.DeleteTitle(Convert.ToInt32(noteID));
        }

        private void UpdateNoteTitleFormCSFunc_Execute(object sender, Chromium.Remote.Event.CfrV8HandlerExecuteEventArgs e) {
            var array = e.Arguments.ToArray();
            var noteID = array.GetValue(0).ToString();
            var noteTitle = array.GetValue(1).ToString();
            noteUtils.UpdateNoteTitle(Convert.ToInt32(noteID), noteTitle);
        }

        private void SetHistoryNoteContentFormCSFunc_Execute(object sender, CfrV8HandlerExecuteEventArgs e) {
            var array = e.Arguments.ToArray();
            var noteID = array.GetValue(0).ToString();
            var htmlContent = array.GetValue(1).ToString();
            noteUtils.SetHistoryNoteContent(Convert.ToInt32(noteID), htmlContent);
        }


        private void SetNoteContentFormCSFunc_Execute(object sender, Chromium.Remote.Event.CfrV8HandlerExecuteEventArgs e) {
            //var content = e.Arguments.FirstOrDefault(p => p.IsString);
            var array = e.Arguments.ToArray();
            var noteID = array.GetValue(0).ToString();
            var htmlContent = array.GetValue(1).ToString();
            var contentLength = htmlContent.Length;
            noteUtils.SetNoteContent(Convert.ToInt32(noteID), htmlContent, Convert.ToInt32(contentLength));
        }

        private void GetNoteContentFormCSFunc_Execute(object sender, Chromium.Remote.Event.CfrV8HandlerExecuteEventArgs e) {
            var noteID = e.Arguments.FirstOrDefault(p => p.IsString).ToString();
            var noteContent = noteUtils.GetNoteContent(Convert.ToInt32(noteID));
            var jsObjectAccessor = new CfrV8Accessor();
            var jsObject = CfrV8Value.CreateObject(jsObjectAccessor);
            if (noteContent == null) {
                return;
            }
            jsObject.SetValue("id", noteContent.id, CfxV8PropertyAttribute.DontDelete);
            jsObject.SetValue("n_content", noteContent.n_content, CfxV8PropertyAttribute.DontDelete);
            e.SetReturnValue(jsObject);
        }

        private void GetTitleFormCSFunc_Execute(object sender, Chromium.Remote.Event.CfrV8HandlerExecuteEventArgs e) {
            var noteList = noteUtils.GetNotesTitle();
            var jsObjectAccessor = new CfrV8Accessor();
            var jsObject = CfrV8Value.CreateObject(jsObjectAccessor);
            var noteListArray = CfrV8Value.CreateArray(noteList.Count);
            int i = 0;
            foreach (var note in noteList) {
                //jsObject.SetValue(note.id.ToString(), CfrV8Value.CreateString(note.n_title), CfxV8PropertyAttribute.ReadOnly);
                var jsArray = CfrV8Value.CreateArray(5);
                jsArray.SetValue("id", note.id, CfxV8PropertyAttribute.DontDelete);
                jsArray.SetValue("n_title", note.n_title, CfxV8PropertyAttribute.DontDelete);
                jsArray.SetValue("n_length", note.n_length, CfxV8PropertyAttribute.DontDelete);
                jsArray.SetValue("create_time", note.create_time, CfxV8PropertyAttribute.DontDelete);
                jsArray.SetValue("update_time", note.update_time, CfxV8PropertyAttribute.DontDelete);
                noteListArray.SetValue(i, jsArray);
                i++;
            }
            jsObject.SetValue("noteArray", noteListArray, CfxV8PropertyAttribute.DontDelete);
            e.SetReturnValue(jsObject);
        }

        private void SetNoteToFormCSFunc_Execute(object sender, Chromium.Remote.Event.CfrV8HandlerExecuteEventArgs e) {
            var noteTitle = e.Arguments.FirstOrDefault(p => p.IsString);
            string noteID = noteUtils.CreateTitle(noteTitle.ToString());
            e.SetReturnValue(noteID);
        }
        #endregion

        private void MainForm_FormClosing(object sender, FormClosingEventArgs e) {
            ExecuteJavascript("SetNoteContent()");
        }


        #region 全局热键注册

#if !DEBUG
        private const int WM_HOTKEY = 0x312; //窗口消息-热键
        private const int WM_CREATE = 0x1; //窗口消息-创建
        private const int WM_DESTROY = 0x2; //窗口消息-销毁
        private const int AppShow = 0x3572; //S的热键
        private const int AppSwith = 0x102; //D的热键
        private bool isShow = true;
        protected override void WndProc(ref Message m) {
            base.WndProc(ref m);
            switch (m.Msg) {
                case WM_HOTKEY: //窗口消息-热键ID
                    switch (m.WParam.ToInt32()) {
                        case AppShow: //热键ID
                            if (!isShow) {
                                if (this.WindowState == FormWindowState.Minimized) {
                                    this.WindowState = FormWindowState.Maximized;
                                }
                                this.Show();
                                isShow = true;
                            } else {
                                this.Hide();
                                isShow = false;
                            }
                            break;
                        case AppSwith:
                            MessageBox.Show("测试");
                            break;
                        default:
                            break;
                    }
                    break;
                case WM_CREATE: //窗口消息-创建
                    AppHotKey.RegKey(Handle, AppShow, AppHotKey.KeyModifiers.Ctrl | AppHotKey.KeyModifiers.Alt, Keys.S);
                    break;
                case WM_DESTROY: //窗口消息-销毁
                    AppHotKey.UnRegKey(Handle, AppShow); //销毁热键
                    break;
                default:
                    break;
            }
        }
#endif
        #endregion

        private void nfyMain_Click(object sender, EventArgs e) {
            this.Activate();
            this.Show();
        }

        private void tsmItemExit_Click(object sender, EventArgs e) {
            // 强制中止消息，保留托管线程（笔记保存完成后托管线程会自动退出）
            Application.Exit();
        }
    }
}
