namespace FNote {
    partial class MainForm {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing) {
            if (disposing && (components != null)) {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要修改
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent() {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            this.nfyMain = new System.Windows.Forms.NotifyIcon(this.components);
            this.cmsMainNFY = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.tsmItemExit = new System.Windows.Forms.ToolStripMenuItem();
            this.cmsMainNFY.SuspendLayout();
            this.SuspendLayout();
            // 
            // nfyMain
            // 
            this.nfyMain.ContextMenuStrip = this.cmsMainNFY;
            this.nfyMain.Icon = ((System.Drawing.Icon)(resources.GetObject("nfyMain.Icon")));
            this.nfyMain.Text = "FNote";
            this.nfyMain.Visible = true;
            this.nfyMain.Click += new System.EventHandler(this.nfyMain_Click);
            // 
            // cmsMainNFY
            // 
            this.cmsMainNFY.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsmItemExit});
            this.cmsMainNFY.Name = "cmsMainNFY";
            this.cmsMainNFY.Size = new System.Drawing.Size(101, 26);
            // 
            // tsmItemExit
            // 
            this.tsmItemExit.Name = "tsmItemExit";
            this.tsmItemExit.Size = new System.Drawing.Size(100, 22);
            this.tsmItemExit.Text = "退出";
            this.tsmItemExit.Click += new System.EventHandler(this.tsmItemExit_Click);
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1278, 638);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "MainForm";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.MainForm_FormClosing);
            this.cmsMainNFY.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        protected System.Windows.Forms.NotifyIcon nfyMain;
        private System.Windows.Forms.ContextMenuStrip cmsMainNFY;
        private System.Windows.Forms.ToolStripMenuItem tsmItemExit;
    }
}

