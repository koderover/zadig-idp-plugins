# GitLab MR 插件使用说明

## 插件上传和安装

### 1. 准备插件文件

确保你有插件的主文件：`plugin.js`

### 2. 在 Zadig 系统中上传插件

1. 进入 Zadig 系统设置 → 插件管理页面
2. 点击"新建插件"
3. 填写插件信息：
   - **插件名称**: GitLab MR 查看器
   - **插件类型**: 导航功能页
   - **路由路径**: `/gitlab-mr` 
   - **插件描述**: 查看分配给我的 GitLab Merge Request
   - **插件状态**: 启用
4. 上传 `plugin.js` 文件
5. 点击"创建插件"

### 3. 访问插件

创建成功后，插件会出现在系统菜单中，点击即可访问：
`http://你的 Zadig 地址/v1/plugin/gitlab-mr`

## 初次使用配置

### 1. 获取 GitLab Access Token

#### GitLab.com 用户：
1. 访问 https://gitlab.com/-/profile/personal_access_tokens
2. 点击"Create personal access token"
3. 填写信息：
   - **Token name**: zadig-plugin
   - **Expiration date**: 设置过期时间（建议1年）
   - **Scopes**: 选择 `api` 和 `read_user`
4. 点击 "Create personal access token"
5. 复制生成的 Token（注意：只显示一次）

#### 私有 GitLab 实例用户

1. 访问 `你的 GitLab 地址/-/profile/personal_access_tokens`
2. 按照上述步骤创建 Token

### 2. 配置插件

1. 打开 GitLab MR 插件页面
2. 点击右上角"配置"按钮
3. 填写配置信息：
   - **GitLab URL**: 
     - GitLab.com 用户填写: `https://gitlab.com`
     - 私有实例用户填写: `https://你的 GitLab 域名`
   - **Access Token**: 粘贴刚才创建的 Token
4. 点击"测试连接"验证配置
5. 测试成功后点击"保存"

## 功能使用

### 查看 Merge Request 列表

配置完成后，插件会自动显示：
- 分配给你的 MR
- 按更新时间倒序排列
- 显示标题、分支、作者、状态、时间等信息

### 筛选功能

使用顶部的筛选器：

**按状态筛选：**
- 已打开：正在进行的 MR
- 已关闭：被关闭但未合并的 MR  
- 已合并：已成功合并的 MR
- 全部：所有状态的 MR

**按范围筛选：**
- 分配给我：你被指定为审查者的 MR
- 我创建的：你创建的 MR
- 全部：所有相关的 MR

### 查看 MR 详情

点击任意 MR 行会在新窗口中打开 GitLab 的 MR 详情页面。

### 刷新数据

点击右上角"刷新"按钮获取最新的MR数据。

## FAQ

### Q: 提示"连接失败"怎么办？

A: 检查以下几点：
1. GitLab URL 是否正确
2. Access Token 是否有效
3. Token 权限是否包含 `api` 和 `read_user`
4. 网络是否能访问 GitLab

### Q: 显示"暂无 Merge Request"

可能的原因：
1. 确实没有分配给你的 MR
2. 筛选条件限制，尝试选择"全部"
3. Token 权限不足，无法读取 MR 数据

### Q: 如何清除配置？

A: 在配置对话框中点击"清除配置"按钮，这会删除所有保存的 GitLab 信息。

### Q: 插件安全性如何？

A: 
- 所有配置信息仅保存在浏览器本地存储中
- 不会发送到 Zadig 服务器
- Token 仅用于与 GitLab API 通信

### Q: 支持哪些GitLab版本？

A: 支持 GitLab v13.0 及以上版本，包括：
- GitLab.com
- GitLab CE/EE 自托管实例

## 技术支持

如果遇到问题，请检查：
1. 浏览器控制台是否有错误信息
2. GitLab API 是否正常工作
3. Token 权限和有效期

需要帮助时，请提供：
- 错误信息截图
- GitLab 版本信息
- 浏览器版本信息