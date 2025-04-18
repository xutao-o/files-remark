const vscode = require('vscode');
const $config = require('./config.js');

// @ts-ignore
vscode.FileDecoration.validate = (d) => {
    if (d.badge && d.badge.length !== 1 && d.badge.length !== 2) {
        //throw new Error(`The 'badge'-property must be undefined or a short character`);
    }
    if (!d.color && !d.badge && !d.tooltip) {
        throw new Error(`The decoration is empty`);
    }
};

class MyFileDecorationProvider {
	constructor(INFO) {
		this.remark = INFO.remark;
		this.path = INFO.path;
		this.time = INFO.time;
	}

	provideFileDecoration(uri, token) {
		// 项目路径
		const projectPath = $config.projectPathFull;

		// 创建一个文件装饰对象
		// console.log(uri);
		let relativePath = uri.fsPath.replace(projectPath, '').replace(/\\/g, '/');
		// console.log(relativePath, this.path);
		if (relativePath == this.path) {
			// console.log(relativePath, this.path, this.text, '--------------------------------------------');
			let option = {
				badge: this.remark,
				tooltip: `
\r\n📝备注: ${this.remark}
🕑时间: ${this.time}`,
			};
			return option;
		}
		return null;
	}
}
function RenderNote(context, INFO) {
	// 注册文件装饰提供者
	const fileDecorationProvider = new MyFileDecorationProvider(INFO);
	const registration = vscode.window.registerFileDecorationProvider(fileDecorationProvider);
	context.subscriptions.push(registration);

	// 当文件资源视图可见时，触发更新
	vscode.window.onDidChangeVisibleTextEditors(() => {});

	// 返回对象，方便后续操作
	return registration;
}
module.exports = RenderNote;

