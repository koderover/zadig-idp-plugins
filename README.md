# Zadig IDP 插件集合

这是一个为 Zadig 平台的 IDP 插件集合，提供各种开发协作工具的集成功能。

## 插件列表

### GitLab MR 插件
- **路径**: `gitlab-mr-plugin/`
- **功能**: 查看和管理分配给用户的 GitLab Merge Request
- **特性**:
  - 查看分配给我的 GitLab Merge Request
  - 按状态和范围筛选
  - 分页浏览和实时刷新
  - 一键跳转到 GitLab 详情页

## 开发指南
具体插件的开发流程请参阅不同插件的文档

### 环境要求

- Node.js v20.x 或更高版本
- Yarn v4.x 或更高版本

### 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/koderover/zadig-idp-plugins
   cd zadig-idp-plugins
   ```

2. **进入具体插件目录**
   ```bash
   cd gitlab-mr-plugin
   ```

3. **安装依赖**
   ```bash
   yarn install
   ```

4. **开发模式**
   ```bash
   yarn run dev
   ```

5. **构建生产版本**
   ```bash
   yarn run build
   ```

## 许可证

本项目采用 Apache-2.0 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 支持

如果您在使用过程中遇到问题，请：

1. 查看相关插件的 README 文档
2. 检查 Issues 是否有类似问题
3. 创建新的 Issue 描述你的问题

