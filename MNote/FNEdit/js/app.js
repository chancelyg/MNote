// 全局参数

var NoteList = new Array();
var mEditor;

/**
 * 当前笔记Modle
 * */
var tagModel = function () {
    var self = this;
    self.currentTagID = 0;
    self.currentTagName = null;
    self.currentTag = null;
}

/**
 * app设置参数
 * */
var appSetting = function () {
    var self = this;
    self.server_ip = "127.0.0.1";
    self.proview_speed = 1000;
}

var app = new Vue({
    el: "#app",
    data: {
        title: "Chancel",
        noteHistorys: [
        ],
    },
    mounted: function () {
        /// url:http://pandao.github.io/editor.md/examples/
        mEditor = editormd("editor-md", {
            width: "100%",
            height: "100%",
            syncScrolling: "single",
            path: "lib/",
            delay: appSetting.proview_speed,
            toolbarIcons: function () {
                // Or return editormd.toolbarModes[name]; // full, simple, mini
                // Using "||" set icons align right.
                return ["undo", "redo", "|", "bold", "del", "italic", "quote", "ucwords", "uppercase", "lowercase", "|", "list-ul", "list-ol", "hr",
                    "|", "link", "reference-link", "code", "code-block", "table", "datetime", "|", "watch", "preview", "search"]
            },
            onload: function () {
                var keyMap = {
                    "Ctrl-S": function (cm) {
                        app.SetNoteContent(true);
                        mdui.snackbar({
                            message: '笔记 ' + tagModel.currentTagName + ' 保存成功'
                        });
                    }
                };
                this.addKeyMap(keyMap);
                app.FirstGetNoteList();
            },
            onresize: function () {
                this.settings.width = "1200px";
                console.log("onresize =>", this.settings);
            },
            onfullscreen: function () {
                //$("header").css("display", "none");
                $("#editor-md").css("margin-top", "50px");
                var tagList = new mdui.Drawer("#main-drawer");
                tagList.close();
            },
            onfullscreenExit: function () {
                $("#editor-md").css("margin-top", "0px");
                $("header").css("display", "inherit");
                $("#editor-md").css("height", "100%");
                $("#editor-md").css("width", "100%");
            }
        });
    },
    methods: {
        /**
         * 首次获取笔记列表
         */
        FirstGetNoteList: function () {
            //  <li><a href="./ripple" class="mdui-list-item mdui-ripple ">涟漪动画效果</a></li>
            var NoteList = NoteUtils.GetTitle();
            if (NoteList.noteArray.length == 0) {
                mEditor.readOnly = true;
                return;
            }
            NoteList = NoteUtils.GetTitle();
            var firstNote = NoteList.noteArray.shift();
            //$("#dv-title .mdui-list").append('<a href="#" class="list-group-item active" noteid="' + firstNote.id + '" notetitle="' + firstNote.n_title + '"><span class="badge">' + firstNote.n_length + '</span>' + firstNote.n_title + '</a>')
            // <li class="mdui-list-item mdui-ripple"><i class="mdui-list-item mdui-rippl">【原创】文件同步系统（Syncthing）</i></li>
            $("#dv-title .mdui-list").append('<li class="mdui-list-item mdui-ripple mdui-list-item-active" noteid="' + firstNote.id + '">' + firstNote.n_title + '</li>');
            tagModel.currentTagID = firstNote.id;
            tagModel.currentTagName = firstNote.n_title;
            app.RefreshContentByCurrentID();
            $.each(NoteList.noteArray, function (index, note) {
                $("#dv-title .mdui-list").append('<li class="mdui-list-item mdui-ripple" noteid="' + note.id + '">' + note.n_title + '</li>');
            });
            app.AddClickToTitleView();
        },
        /**
         * 赋予列表点击事件
         */
        AddClickToTitleView: function () {
            // 选中样式：mdui-list-item-active
            $("#dv-title .mdui-list li").mousedown(function (event) {
                switch (event.button) {
                    case 0:
                        // 判断是否是重复点击同一笔记
                        if ($(this).attr("noteid") == tagModel.currentTagID) {
                            return;
                        }

                        // 点击之后先保存笔记
                        app.SetNoteContent();
                        $("[noteid='" + tagModel.currentTagID + "']").children(".badge").text(length);
                        mEditor.clear();

                        // 更换选中的笔记
                        var collectionA = $("#dv-title .mdui-list li");
                        $.each(collectionA, function () {
                            $(this).removeClass();
                            $(this).addClass("mdui-list-item mdui-ripple");
                            if (tagModel.currentTag == null) {
                                tagModel.currentTag = $(this);
                            }
                        });
                        tagModel.currentTag.removeClass("mdui-list-item-active");
                        $(this).addClass("mdui-list-item-active")
                        tagModel.currentTag = $(this);
                        tagModel.currentTagID = $(this).attr("noteid");
                        tagModel.currentTagName = $(this)[0].textContent;
                        app.RefreshContentByCurrentID();
                        break;
                    case 2:
                        var tagTitle = this.innerHTML;
                        var tagID = $(this).attr("noteid");
                        mdui.prompt("", "标签编辑",
                            function (value) {
                                NoteUtils.UpdateNoteTitle(tagID, value);
                                app.UpdateNoteListView();
                                mdui.snackbar({
                                    message: '更改成功标签名称成功'
                                });
                            },
                            function (value) {
                                mdui.confirm('确认删除！？', function () {
                                    NoteUtils.DeleteNoteTitle(tagID);
                                    app.UpdateNoteListView();
                                    mdui.snackbar({
                                        message: '删除成功'
                                    });
                                }, null, { confirmText: "确认", cancelText: "取消" });
                            }, { confirmText: "确认", cancelText: "删除", confirmOnEnter: true, defaultValue: tagTitle }
                        );
                        break;
                }
            });
        },
        /**
         * 保存笔记内容
         */
        SetNoteContent: function (obj) {
            var content = mEditor.getValue();
            if (obj) {
                console.log("保存历史文本");
                NoteUtils.SetHistoryNoteContent(tagModel.currentTagID.toString(), content.toString());
            }
            NoteUtils.SetNoteContent(tagModel.currentTagID.toString(), content.toString());
        },
        /**
         * 根据ID获取内容
         * */
        RefreshContentByCurrentID: function () {
            var note = NoteUtils.GetNoteContent(tagModel.currentTagID.toString());
            if (note != null) {
                //$("#editor textarea").val(note.n_content);
                mEditor.setValue(note.n_content);
            }
        },
        /**
         * 新建笔记
         */
        SaveNewNote: function () {
            var title = $("#dialog-new-note .mdui-dialog-content .mdui-textfield .mdui-textfield-input").val();
            if (title.length == 0) {
                mdui.snackbar({
                    message: '标题不可为空'
                });
                return;
            }
            // 保存现有的笔记
            app.SetNoteContent();
            tagModel.currentTagID = NoteUtils.SaveNewNote(title);
            // 更新笔记列表
            app.UpdateNoteListView();
            // 清空模态框的输入
            $("#dialog-new-note .mdui-dialog-content .mdui-textfield .mdui-textfield-input").val("");
        },
        /**
         * 更改笔记标题
         */
        EditNoteInfo: function () {
            var noteid = $('#dvEditNote').attr("noteid");
            var nodeTitle = $(".modal-body .input-group .update-title").val();
            NoteUtils.UpdateNoteTitle(noteid, nodeTitle);
            app.UpdateNoteListView();
            $('#dvEditNote').modal('hide');
            $(".modal-body .input-group .update-title").val("");
        },
        /**
         * 隐藏当前Winform
         */
        closeProgram: function () {
            NoteUtils.HideWinForm();
        },
        /**
         * 选中指定ID的Title
         * @param {any} noteID ID
         */
        SelectTitle: function () {
            var collectionA = $("#dv-title a");
            $.each(collectionA, function () {
                var aClass = $(this).attr("class");
                if (aClass === "list-group-item list-group-item-success") {
                    return true;
                }
                $(this).removeClass();
                $(this).addClass("list-group-item");

            });
            $("[noteid='" + noteid + "']").attr("class", "list-group-item active");
        },
        /**
         *  更新笔记列表
         */
        UpdateNoteListView: function () {
            $("#dv-title .mdui-list").empty();
            var NoteList = NoteUtils.GetTitle();
            if (NoteList.noteArray.length == 0) {
                mEditor.readOnly = true;
                return;
            }
            NoteList = NoteUtils.GetTitle();
            $.each(NoteList.noteArray, function (index, note) {
                if (tagModel.currentTagID == note.id) {
                    $("#dv-title .mdui-list").append('<li class="mdui-list-item mdui-ripple mdui-list-item-active" noteid="' + note.id + '">' + note.n_title + '</li>');
                    tagModel.currentTagName = note.n_title;
                    tagModel.currentTagID = note.id;
                    app.RefreshContentByCurrentID();
                    return true;
                }
                $("#dv-title .mdui-list").append('<li class="mdui-list-item mdui-ripple" noteid="' + note.id + '">' + note.n_title + '</li>');
            });
            app.AddClickToTitleView();
        },
        /**
         * 获取历史笔记时间
         */
        GetHistoryNote: function () {
            app.noteHistorys = null;
            var historys = NoteUtils.GetNoteContentHistory(tagModel.currentTagID.toString());
            if (historys != null) {
                app.noteHistorys = historys.historyArray;
            }
        },
        GetHistoryContent: function (event) {
            var htime = event.target.outerText;
            var note = NoteUtils.GetHistoryContent(htime);
            app.SetNoteContent(true);
            mdui.snackbar({
                message: '笔记 ' + tagModel.currentTagName + ' 自动保存成功'
            });
            mEditor.setValue(note.n_content);
            new mdui.Dialog("#dialog-history").close();
        },
        /**
         * 隐藏程序
         */
        Close: function () {
            NoteUtils.Close();
        },


    }
})

