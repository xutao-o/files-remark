# 📝Files Remark - 给目录文件设置备注
安装地址： [VS Code插件安装（Files Remark）](https://marketplace.visualstudio.com/items?itemName=qiuqiu-xt.files-remark)<br>
![](https://resource-wangsu.helplook.net/docker_production/kn8ndd/article/9yEr5dyH/6800fb2186301.png)

## 📖 使用方法
在目录右键给📄文件及📁文件夹设置 `备注`

![](https://resource-wangsu.helplook.net/docker_production/kn8ndd/article/9yEr5dyH/6800fb2976a69.png)
<br>
✨ 备注展示无字符长度限制。<br>
✨ 支持快捷键 `ctrl + M` 快捷添加备注。<br>
✨ 支持 `文件` `文件夹` 重命名后`同步备注`<br>
✨ 支持 `文件` `文件夹` 移动位置后`同步备注`

## 💀 注意事项
- 使用 `windows 文件管理器` / `mac 访达`（而非 VSCode）进行文件移动，这种情况下 VSCode 事件无法捕捉到，会导致备注失效。`请请尽量在 vscode 内操作文件。`

## 🔎 已知问题

- 如果文件夹内的文件包含未提交的文件 或其中有文件存在错误（git）vscode 会提示 `包含强调项` ，由于该提示权限较高，无法更改。

## 💾 数据

- 备注的数据存储在`/.vscode/file-remark.json` 中
- 手动更改 `file-remark.json` 需重启 vscode 才能生效

## 🐣 其他
- 项目由 [SuperFileNotes](https://github.com/sunweixin8/SuperFileNotes) 项目更改完成
- 个人官网（了解我的更多项目）：[www.xqiu.net](https://www.xqiu.net/)
- 独立项目-小秋AI: [www.xqai.net](https://www.xqai.net/)
- 扩展推荐： [CSS FlexCode](https://marketplace.visualstudio.com/items?itemName=qiuqiu-xt.css-flex)，一键生成Flex/Grid布局代码的插件