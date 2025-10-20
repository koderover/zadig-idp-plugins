# GitLab MR 查看插件

这是一个用于 Zadig 平台的 GitLab Merge Request 查看插件，可以显示分配给当前用户的 GitLab Merge Request。

## 功能

- 查看分配给我的 GitLab Merge Request
- 按状态筛选（已打开、已关闭、已合并）
- 按范围筛选（分配给我、我创建的）
- 分页浏览
- 实时刷新
- 一键跳转到 GitLab 详情页

## 快速开始

### 安装依赖
版本要求：
- Yarn 版本：v4.x 以上
- NodeJS 版本：v20.x 以上

```bash
yarn install
```

### 开发模式

```bash
yarn run dev
```

### 构建生产版本

```bash
yarn run build
```

构建完成后，会在`dist`目录生成`plugin.js`文件。

## 项目结构

```
gitlab-mr-plugin/
├── components/           # Vue 单文件组件
│   ├── GitLabMRMain.vue     # 主组件（包含 scoped 样式）
│   ├── ConfigDialog.vue     # 配置对话框（包含 scoped 样式）
│   ├── FilterBar.vue        # 筛选条件（包含 scoped 样式）
│   └── MRTable.vue          # MR 表格（包含 scoped 样式）
├── dist/               # 构建输出目录
├── index.js            # 插件入口文件
├── package.json        # 项目配置
├── webpack.config.js   # Webpack 配置
└── README.md          # 说明文档
```

## 在 Zadig 中使用

1. 构建插件：`yarn run build`
2. 在 Zadig 系统设置 → 插件管理中新建插件
3. 上传`dist/plugin.js`文件
4. 配置插件信息并启用
5. 在插件页面中配置 GitLab 连接信息

## 插件配置

插件会要求用户配置以下信息：

- **GitLab URL**: GitLab实例的URL地址（如 https://gitlab.com）
- **Access Token**: GitLab个人访问令牌，需要`api`和`read_user`权限

### 创建Access Token

1. 访问GitLab的个人访问令牌页面
   - GitLab.com: https://gitlab.com/-/profile/personal_access_tokens
   - 私有实例: https://your-gitlab-instance/-/profile/personal_access_tokens

2. 填写令牌信息：
   - **Token name**: zadig-plugin
   - **Expiration date**: 设置过期时间
   - **Scopes**: 选择`api`和`read_user`

3. 点击"Create personal access token"

4. 复制生成的 Token 到插件配置中
