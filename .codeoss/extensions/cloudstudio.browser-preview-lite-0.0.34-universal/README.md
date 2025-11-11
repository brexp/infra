# 预览插件简介

用户可以通过使用预览插件打开正确的浏览器端口做快速预览，即可以在 IDE 页面开启内置的的浏览器预览窗口，进行编码预览和调试。此版本通过简化 `preview.yml` 文件的配置和运行，以及增加端口自动扫描识别，提供了更便于预览调试的编码体验。

## 本地调试

安装依赖

```sh
yarn
```

有可能会提示证书过期 `certificate has expired` 可以手动忽略

```sh
yarn config set strict-ssl false
```

## 预览插件功能点介绍

### 功能点一：通过模板自动打开预览窗口

![HGnVwq.png](https://s4.ax1x.com/2022/02/09/HGnVwq.png)

点击 Dashboard 中提供的环境模板，进入工作空间的编辑页面自动打开预览窗口；

### 功能点二：重启运行预览窗口

![HYwzNV.png](https://s4.ax1x.com/2022/02/10/HYwzNV.png)

点击"文件"中的下拉选项“配置预览文件 preview.yml” ，即可重新运行 `preview.yml` 文件窗口，点击右上角的“重启”按钮，即可重启预览页面；

### 功能点三：命令行启动预览窗口

![HYwxA0.png](https://s4.ax1x.com/2022/02/10/HYwxA0.png)

快捷键`Command + Shift + P` 或 `Ctrl + Shift + P`，打开命令面板，打开命令输入框，输入命令行 `preview.start` 即可重新打开预览窗口；

### 功能点四：端口中进程的快捷操作

![HGnkOs.png](https://s4.ax1x.com/2022/02/09/HGnkOs.png)

对于“端口”中所展示的启动端口进程，将鼠标移入该进程，即可点击右侧显示的按钮进行“复制地址到剪贴板”、“打开外部浏览器”、“打开内置预览窗口”的快捷操作；

### 配置文件模板及参数含义

```yml
# .vscode/preview.yml
autoOpen: true # 打开工作空间时是否自动开启所有应用的预览
apps:
  - port: 3000 # 应用的端口
    run: yarn start # 应用的启动命令
    root: ./app # 应用的启动目录
    name: my-first-app # 应用名称
    description: 我的第一个 App。 # 应用描述
    autoOpen: true # 打开工作空间时是否自动开启预览（优先级高于根级 autoOpen）
```
