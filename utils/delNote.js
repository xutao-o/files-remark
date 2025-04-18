const vscode = require('vscode');
const fs = require('fs');
const $config = require('./config.js');

/**
 * @param {*} delPath 需要删除备注的文件路径
 */
function delNote(delPath, disposedObj) {
	// 获取文件名
	const fileName = $config.jsonName;
	// 获取当前打开的工作区根目录
	const rootPath = $config.projectPathFull;

	// 拼接完整的文件路径
	const filePath = vscode.Uri.file(rootPath + '.vscode/' + fileName);

	let absolutePath = filePath.fsPath;
	let newContent = null;
	// 检查文件是否已存在
	if (!fs.existsSync(absolutePath)) {
		return;
	}
	// 文件已存在,写入新内容到文件
	// 读取old文件内容
	const fileContent = fs.readFileSync(absolutePath, 'utf-8');
	newContent = JSON.parse(fileContent);
    delete newContent[delPath]
	newContent = JSON.stringify(newContent);
	fs.writeFileSync(absolutePath, newContent);
    disposedObj[delPath] && disposedObj[delPath].registration && disposedObj[delPath].registration.dispose();
}
module.exports = delNote;
