const vscode = require('vscode');
const RenderNote = require('./utils/setNote.js');
const delNote = require('./utils/delNote.js');
const writeFile = require('./utils/writeFile.js');
const historyNote = require('./utils/historyNote.js');
const $config = require('./utils/config.js');

function alertAndCopy(message) {
	vscode.window.showInformationMessage(message, { modal: true });
}

async function activate(context) {
	// 存储对象列表
	let disposedObj = {};
	// 项目路径
	const projectPath = $config.projectPathFull;

	// 打开项目，读取历史
	try {
		let historyObj = await historyNote();
        for(let key in historyObj){
            let registration = RenderNote(context, {...historyObj[key], path: key});
            disposedObj[key] = {
                path: key,
                registration: registration,
                ...historyObj[key]
            };
        }
		// console.log(historyObj);
	} catch (error) {
		console.log('文件备注插件:恢复备注时出现了异常', error);
	}

	// 注册命令 'addRemark'
	let addRemark = vscode.commands.registerCommand('addRemark', async (uri) => {
		console.clear();
		// 获取当前活动的文本编辑器,如果有文本编辑器，获取其 URI;（快捷键触发）
		const activeEditor = vscode.window.activeTextEditor;
		if (!uri && activeEditor) {
			uri = activeEditor.document.uri;
		}

		// 如果没有选择文件或文件夹，显示错误信息
		if (!uri || !uri.fsPath) {
			return;
		}

		// 获取当前点击的绝对路径
		// const absolutePath = uri.fsPath;
		// 获取当前点击的相对路径
		const relativePath = vscode.workspace.asRelativePath(uri.fsPath);
		// console.table({
		// 	项目路径: projectPath,
		// 	当前点击的绝对路径: absolutePath,
		// 	当前点击的相对路径: relativePath,
		// });
		if (projectPath == relativePath) {
			vscode.window.showInformationMessage('不能在根目录备注');
			return;
		}

		// 显示输入框，等待用户输入
		const userInput = await vscode.window.showInputBox({
			placeHolder: `给【${relativePath}】输入备注...`,
			prompt: '请输入:',
			value: disposedObj[relativePath] ? disposedObj[relativePath].remark : "", // 初始值为空
		});

		// 检查用户是否输入了内容
		if (userInput == undefined) {
			// 用户取消了输入
			console.log('文件备注插件:用户取消了输入');
			// vscode.window.showInformationMessage('取消输入');
			return;
		}

		let createTime = new Date().toLocaleString().substring(2);
		let INFO = {
			remark: userInput,
			path: relativePath,
			time: createTime,
		};
		//设置单条
        disposedObj[relativePath] && disposedObj[relativePath].registration && disposedObj[relativePath].registration.dispose();
		let registration = RenderNote(context, INFO);
		// 存储
		writeFile(INFO);
        disposedObj[relativePath] = {
            path: relativePath,
            registration: registration,
            ...INFO
        }
	});
	// 注册命令 'delRemark'
	let delRemark = vscode.commands.registerCommand('delRemark', async (uri) => {
		// 如果没有选择文件或文件夹，显示错误信息
		if (!uri || !uri.fsPath) {
			return;
		}

		// // 获取文件信息
		// const fileInfo = await vscode.workspace.fs.stat(uri);
		// const fileInfoTypeName = fileInfo.type ==1?'文件':'文件夹';

		// 获取当前点击的绝对路径
		// const absolutePath = uri.fsPath;
		// 获取当前点击的相对路径
		const relativePath = vscode.workspace.asRelativePath(uri.fsPath);
		// console.table({
		// 	项目路径: projectPath,
		// 	当前点击的绝对路径: absolutePath,
		// 	当前点击的相对路径: relativePath,
		// });
		if (projectPath == relativePath) {
			vscode.window.showInformationMessage('不能在根目录备注');
			return;
		}

		// 弹出确认框
		const response = await vscode.window.showInformationMessage(`确定要删除【${relativePath}】的备注?`, { modal: true }, '确定');
		if (response === '确定') {
			delNote(relativePath, disposedObj);
			// vscode.window.showInformationMessage('已清除');
		}
	});
	// 注册文件重命名事件监听器
	const renameFilesDisposable = vscode.workspace.onDidRenameFiles((event) => {
		// 处理文件重命名事件
		const renamedFiles = event.files;

		renamedFiles.forEach(async (x) => {
			let newPath = x.newUri.fsPath.replace(projectPath, '').replace(/\\/g, '/');
			let oldPath = x.oldUri.fsPath.replace(projectPath, '').replace(/\\/g, '/');
			console.log('监听到了移动', { newPath, oldPath });

			let fileStat = await vscode.workspace.fs.stat(x.newUri);
			let isDir = fileStat.type === vscode.FileType.Directory;
			console.log('是否是文件夹', isDir);

			if (isDir) {
				let historyObj = await historyNote();
                // console.log(historyObj)
                for(let key in historyObj){
                    if (key.indexOf(oldPath) == 0) {
                        let x = historyObj[key];
                        let newNoteInfo = {
							remark: x.remark,
							path: key.replace(oldPath, newPath),
							time: x.time,
						};
						//设置新的
						let registration = RenderNote(context, newNoteInfo);
						await writeFile(newNoteInfo);
                        disposedObj[newPath] = {
                            path: newPath,
                            registration: registration,
                            ...newNoteInfo
                        }
						// 删除老的
						await delNote(key, disposedObj);
                    }
                }
			} else {
                let oldObj = disposedObj[oldPath]
                // console.log(oldObj)
                let newNoteInfo = {
                    remark: oldObj.remark,
                    path: newPath,
                    time: oldObj.time,
                };
                //设置新的
                let registration = RenderNote(context, newNoteInfo);
                await writeFile(newNoteInfo);
                disposedObj[newPath] = {
                    path: newPath,
                    registration: registration,
                    ...newNoteInfo
                }
				// 删除老的
				await delNote(oldPath, disposedObj);
			}
		});
	});

	// 将命令注册到上下文中
	context.subscriptions.push(addRemark, delRemark, renameFilesDisposable);
}

//当你的扩展被停用时，这个方法被调用
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
