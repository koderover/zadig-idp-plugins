# Iframe Zadig 插件

这是一个用于 Zadig 平台的 Iframe 嵌入插件，允许用户在 Zadig 中嵌入任意外部网页，并提供完整的 iframe 配置选项。

## 功能特性

- 嵌入任意外部网页（支持跨域）
- 完整的 iframe 配置选项
  - 基础配置：URL、标题、名称、加载方式、Referrer 策略
  - 权限控制：浏览器功能权限（全屏、摄像头、麦克风、定位等）
  - 安全沙盒：沙盒权限配置
- 配置本地化存储，自动记忆用户设置
- 响应式设计，自动适应容器大小
- 安全可控，支持细粒度的权限管理

## 快速开始

### 安装依赖

版本要求：

- Yarn 版本：v4.x 以上
- NodeJS 版本：v20.x 以上

```bash
# 全局安装 zadig-plugin-cli
yarn global add zadig-plugin-cli-dev
# 验证安装
zadig-plugin --version
zadig-plugin --help
# 安装依赖
yarn install
```

### 开发模式

```bash
zadig-plugin dev
```

### 构建生产版本

```bash
zadig-plugin build
```

构建完成后，会在`dist`目录生成`plugin.js`文件。

## 项目结构

```
iframe-zadig/
├── src/
│   ├── components/
│   │   ├── MainPage.vue      # 主组件（iframe 显示）
│   │   └── ConfigDialog.vue  # 配置对话框（三个配置标签页）
│   └── index.js              # 插件入口文件
├── dist/                     # 构建输出目录
├── package.json              # 项目配置
├── webpack.config.js         # Webpack 生产配置
├── webpack.dev.js            # Webpack 开发配置
└── README.md                 # 说明文档
```

## 在 Zadig 中使用

1. 构建插件：`zadig-plugin build`
2. 在 Zadig 系统设置 → 插件管理中新建插件
3. 上传 `dist/plugin.js` 文件
4. 配置插件信息并启用
5. 首次打开插件会自动弹出配置对话框

## 插件配置

插件提供三个配置标签页：

### 1. 基础配置

- **URL**（必填）：要嵌入的网页地址，例如 `https://example.com`
- **标题**（必填）：iframe 的标题属性
- **名称**（可选）：iframe 的 name 属性，用于 `target` 等场景
- **加载方式**：
  - `lazy`（默认）：延迟加载，性能优化
  - `eager`：立即加载
- **Referrer 策略**：控制请求头的 Referer 信息
  - `no-referrer-when-downgrade`（默认）
  - `no-referrer`：不发送 Referer
  - `origin`：仅发送源
  - `same-origin`：仅同源发送
  - `strict-origin`：严格源策略

### 2. 权限控制

通过 `allow` 属性控制 iframe 可以使用的浏览器功能：

- ✅ **全屏**（fullscreen）
- ✅ **自动播放**（autoplay）
- ✅ **摄像头**（camera）
- ✅ **麦克风**（microphone）
- ✅ **定位**（geolocation）
- ✅ **读取剪贴板**（clipboard-read）
- ✅ **写入剪贴板**（clipboard-write）
- ✅ **加速计**（accelerometer）
- ✅ **陀螺仪**（gyroscope）
- ✅ **支付**（payment）
- ✅ **USB**
- ✅ **VR**
- ✅ **Web XR**（xr-spatial-tracking）

### 3. 安全沙盒

启用沙盒后，iframe 默认权限最小化，需要显式授权：

- **allow-scripts**：允许执行脚本
- **allow-same-origin**：允许同源处理
- **allow-forms**：允许提交表单
- **allow-popups**：允许弹出窗口
- **allow-popups-to-escape-sandbox**：弹窗可以离开沙盒
- **allow-top-navigation-by-user-activation**：用户操作时可跳转顶层
- **allow-modals**：允许模态框（alert、confirm 等）
- **allow-downloads**：允许下载文件
- **allow-pointer-lock**：允许指针锁定
- **allow-orientation-lock**：允许屏幕方向锁定
- **allow-presentation**：允许演示 API
- **allow-storage-access-by-user-activation**：用户操作时可访问存储

## 配置示例

### 嵌入第三方网站（无沙盒）

```javascript
{
  url: 'https://example.com',
  title: '示例网站',
  loading: 'lazy',
  referrerpolicy: 'no-referrer-when-downgrade',
  permissions: ['fullscreen', 'clipboard-read', 'clipboard-write'],
  sandboxEnabled: false
}
```

### 嵌入内部应用（启用沙盒）

```javascript
{
  url: 'https://internal-app.company.com',
  title: '内部应用',
  loading: 'lazy',
  referrerpolicy: 'same-origin',
  permissions: ['fullscreen'],
  sandboxEnabled: true,
  sandboxPermissions: ['allow-scripts', 'allow-same-origin', 'allow-forms']
}
```

## 开发指南


## 注意事项

1. **跨域限制**：某些网站可能设置了 `X-Frame-Options` 头，禁止被嵌入到 iframe 中
2. **HTTPS 要求**：从 HTTPS 页面嵌入 HTTP 页面可能被浏览器阻止
3. **权限配置**：过多的权限可能带来安全风险，建议按需配置
4. **沙盒使用**：启用沙盒会显著限制 iframe 的功能，请根据实际需求配置

## FAQ

### Q: 为什么 iframe 显示空白？

A: 检查以下几点：
- 目标网站是否设置了 `X-Frame-Options` 禁止嵌入
- 是否启用了沙盒但未配置 `allow-scripts` 权限
- URL 是否正确且可访问

### Q: 如何允许 iframe 内的脚本执行？

A: 确保沙盒已关闭，或在沙盒权限中勾选 `allow-scripts` 和 `allow-same-origin`

### Q: 配置保存在哪里？

A: 配置保存在浏览器的 localStorage 中，清除浏览器数据会丢失配置

## License

Apache-2.0
