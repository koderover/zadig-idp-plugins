/**
 * GitLab Merge Request 插件
 * 显示分配给当前用户的 GitLab Merge Request
 */

// 导入Vue组件
import GitLabMRMain from './components/GitLabMRMain.vue'

// 模拟 ZadigPlugin 基类（编译时使用）
// 实际运行时会从全局变量获取
const ZadigPlugin = window.ZadigPlugin || class ZadigPlugin {
  constructor (manifest) {
    this.manifest = manifest
    this.id = manifest.id
    this.name = manifest.name
    this.version = manifest.version
    this.type = manifest.type
    this._mounted = false
    this._destroyed = false
    this.api = null
  }

  // 生命周期方法
  onCreate () {}
  onMount () {}
  onUnmount () {}
  onDestroy () {}
  onUpdate (manifest) {}

  // 内部方法
  _create (api) {
    this.api = api
    this.onCreate()
  }

  _mount () {
    this._mounted = true
    this.onMount()
  }

  _unmount () {
    this._mounted = false
    this.onUnmount()
  }

  _destroy () {
    this._destroyed = true
    this.onDestroy()
  }

  // API 方法
  registerRoute (routeConfig) {
    if (this.api && this.api.registerRoute) {
      return this.api.registerRoute(routeConfig)
    }
    console.log(`[${this.name}] 注册路由:`, routeConfig)
  }

  registerComponent (name, component) {
    if (this.api && this.api.registerComponent) {
      return this.api.registerComponent(name, component, this.id)
    }
    console.log(`[${this.name}] 注册组件:`, name)
  }

  getState () {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      type: this.type,
      mounted: this._mounted,
      destroyed: this._destroyed
    }
  }

  hasPermission (permission) {
    return this.manifest.permissions && this.manifest.permissions.includes(permission)
  }

  on () {}
  off () {}
  emit () {}
}

// GitLab MR 插件主类
class GitLabMRPlugin extends ZadigPlugin {
  constructor (manifest) {
    // 如果没有传入 manifest，使用默认的
    super(manifest || GitLabMRPlugin.defaultManifest)

    // 插件内部状态
    this.storage = null
  }

  onCreate () {
    console.log(`${this.name} plugin created`)
  }

  onMount () {
    console.log(`${this.name} plugin mounted`)

    // 获取插件存储
    this.storage = this.getPluginStorage()

    // 初始化存储
    this.initStorage()

    // 创建带有存储的组件
    const self = this
    const componentId = `GitLabWrapper_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const WrappedComponent = {
      name: `GitLabMRWrapper_${componentId}`,
      _pluginId: this.id,
      _componentId: componentId,
      render (h) {
        console.log(`[GitLab] Rendering component: ${componentId}`)
        return h(GitLabMRMain, {
          props: {
            storage: self.storage
          }
        })
      },
      created () {
        console.log(`[GitLab] Component created: ${componentId}`)
      },
      mounted () {
        console.log(`[GitLab] Component mounted: ${componentId}`)
      }
    }

    console.log(`[GitLab] Created wrapper component with ID: ${componentId}`)

    // 保存组件供外部使用
    this.component = WrappedComponent

    // 注册主页面路由
    this.registerRoute({
      path: '/',
      component: WrappedComponent,
      meta: {
        title: 'GitLab Merge Requests',
        icon: 'el-icon-s-cooperation'
      }
    })
  }

  onUnmount () {
    console.log(`${this.name} plugin unmounted`)
  }

  onDestroy () {
    console.log(`${this.name} plugin destroyed`)

    // 清理存储的数据（可选）
    if (this.storage) {
      // 可以在这里清理一些临时数据
    }
  }

  // 获取存储对象
  getPluginStorage () {
    // 优先使用真实的API
    if (this.api && this.api.getStorage) {
      return this.api.getStorage()
    }

    // 如果没有真实API，返回基于localStorage的模拟存储
    return {
      data: {},
      get (key) {
        try {
          const item = localStorage.getItem(`plugin_${key}`)
          return item ? JSON.parse(item) : undefined
        } catch {
          return undefined
        }
      },
      set (key, value) {
        try {
          localStorage.setItem(`plugin_${key}`, JSON.stringify(value))
          return true
        } catch {
          return false
        }
      },
      remove (key) {
        try {
          localStorage.removeItem(`plugin_${key}`)
          return true
        } catch {
          return false
        }
      }
    }
  }

  // 初始化存储
  initStorage () {
    if (this.storage) {
      const savedConfig = this.storage.get('config')

      if (!savedConfig) {
        // 设置默认配置
        this.storage.set('config', {
          gitlabUrl: 'https://gitlab.com',
          autoRefresh: true,
          pageSize: 20
        })
      }
    }
  }

  // 获取配置
  getConfig () {
    if (this.storage) {
      return this.storage.get('config') || {}
    }
    return {}
  }

  // 保存配置
  saveConfig (config) {
    if (this.storage) {
      this.storage.set('config', config)
    }
  }

  // 提供组件获取方法
  getComponent () {
    return this.component
  }
}

// 插件配置清单
const manifest = {
  identifier: 'gitlab-mr-plugin', // 唯一标识符，用于插件匹配
  name: 'GitLab MR查看器',
  version: '1.0.0',
  description: '查看分配给我的GitLab Merge Request',
  author: 'Zadig Team',
  type: 'page',
  entry: './index.js',
  icon: 'el-icon-s-cooperation',
  route: '/gitlab-mr',
  permissions: [
    'api.external.gitlab'
  ]
}

// 设置默认 manifest 作为静态属性
GitLabMRPlugin.defaultManifest = manifest

// 注册插件类（不是实例）
if (window.__zadig_plugin_gitlab_mr_plugin) {
  window.__zadig_plugin_gitlab_mr_plugin.register(GitLabMRPlugin)
}

// 导出插件类（用于开发）
export default GitLabMRPlugin
