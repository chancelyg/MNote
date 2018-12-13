using MNote.Entity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using static System.Net.Mime.MediaTypeNames;

namespace FNote.Utils {
    public class CommonUtils {

        #region xml文件读写
        /// <summary>
        /// config file
        /// </summary>
        private static XmlDocument defaultConfigXml = null;

        /// <summary>
        /// 读取默认配置文件的节点值
        /// </summary>
        /// <param name="isReload"></param>
        /// <param name="keys"></param>
        /// <returns></returns>
        public static string getValueByConfigXml(bool isReload = false, params string[] keys) {
            if (defaultConfigXml == null || isReload) {
                defaultConfigXml = new XmlDocument();
                defaultConfigXml.Load(AppDomain.CurrentDomain.BaseDirectory + "config.xml");
            }
            XmlNode xn = defaultConfigXml.SelectSingleNode("root");
            foreach (var key in keys) {
                xn = xn.SelectSingleNode(key);
            }
            return xn.InnerText;

        }

        /// <summary>
        /// 设置默认配置文件节点值
        /// </summary>
        /// <param name="key">key</param>
        /// <param name="value">value</param>
        /// <returns>is success</returns>
        public static bool SetValueByConfigXml(string value, params string[] keys) {
            try {
                if (defaultConfigXml == null) {
                    defaultConfigXml = new XmlDocument();
                }
                defaultConfigXml.Load(AppDomain.CurrentDomain.BaseDirectory + "/config.xml");
                XmlNode xn = defaultConfigXml.SelectSingleNode("root");
                foreach (var key in keys) {
                    xn = xn.SelectSingleNode(key);
                }
                xn.InnerText = value;
                defaultConfigXml.Save(AppDomain.CurrentDomain.BaseDirectory + "/config.xml");
                // 重新读取配置
                defaultConfigXml = new XmlDocument();
                defaultConfigXml.Load(AppDomain.CurrentDomain.BaseDirectory + "/config.xml");
                return true;
            } catch {
                return false;

            }
        }

        /// <summary>
        /// 读取其他xml文件的节点值
        /// </summary>
        /// <param name="xmlPath">xml文件的路径</param>
        /// <param name="attribute">节点属性名称（默认Null即为读取属性值）</param>
        /// <param name="keys">节点名称集合</param>
        /// <returns></returns>
        public static string GetValueByXml(string xmlPath, string attribute = null, params string[] keys) {
            var xml = new XmlDocument();
            try {
                xml.Load(xmlPath);
            } catch {
                return null;
            }
            XmlNode xn = xml.SelectSingleNode(keys[0]);
            foreach (var key in keys) {
                if (key.Equals(keys[0])) {
                    continue;
                }
                xn = xn.SelectSingleNode(key);
            }
            var result = attribute == null ? xn.InnerText : xn.Attributes[attribute].Value;
            return result;
        }
        #endregion


        private static FConfig fConfig;
        /// <summary>
        /// 获取配置实例
        /// </summary>
        public static FConfig ConfigInstance {
            get {
                if (fConfig == null) {
                    var sourceContent = File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "/FConfig.json");
                    fConfig = JsonConvert.DeserializeObject<FConfig>(sourceContent);
                }
                return fConfig;
            }
            set{
                fConfig = value;
                fConfig.SaveConfig();
            }
        }
    }
}
