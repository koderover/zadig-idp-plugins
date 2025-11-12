
// Import Vue components
import MainPage from './components/GitLabMRMain.vue'

// Fallback ZadigPlugin class for development
const ZadigPlugin = window.ZadigPlugin || class ZadigPlugin {
  constructor(manifest) {
    this.manifest = manifest
    this.id = manifest.id
    this.name = manifest.name
    this.version = manifest.version
    
    this.type = manifest.type
    this._mounted = false
    this.api = null
  }

  onCreate() {}
  onMount() {}
  onUnmount() {}
  onDestroy() {}

  _create(api) {
    this.api = api
    this.onCreate()
  }

  _mount() {
    this._mounted = true
    this.onMount()
  }

  _unmount() {
    this._mounted = false
    this.onUnmount()
  }

  _destroy() {
    this.onDestroy()
  }

  registerRoute(routeConfig) {
    if (this.api && this.api.registerRoute) {
      return this.api.registerRoute(routeConfig)
    }
    console.log(`[${this.name}] Register route:`, routeConfig)
  }

  getState() {
    return {
      id: this.id,
      name: this.name,
      mounted: this._mounted
    }
  }
}

// Gitlab Mr Plugin Plugin Class
class GitlabMrPlugin extends ZadigPlugin {
  constructor (manifest) {
    super(manifest || GitlabMrPlugin.defaultManifest)
    this.storage = null
  }

  onCreate () {
    console.log(`${this.name} plugin created`)
  }

  onMount () {
    console.log(`${this.name} plugin mounted`)

    // Get plugin storage
    this.storage = this.getPluginStorage()

    // Create component with storage and API
    const self = this
    const WrappedComponent = {
      name: 'PluginWrapper',
      render (h) {
        return h(MainPage, {
          props: {
            storage: self.storage,
            pluginAPI: self.api
          }
        })
      }
    }

    // Register main route
    this.registerRoute({
      path: '/',
      component: WrappedComponent,
      meta: {
        title: 'Gitlab Mr Plugin'
      }
    })
  }

  onUnmount () {
    console.log(`${this.name} plugin unmounted`)
  }

  onDestroy () {
    console.log(`${this.name} plugin destroyed`)
  }

  // Simple storage implementation
  getPluginStorage () {
    if (this.api && this.api.getStorage) {
      return this.api.getStorage()
    }

    // localStorage fallback
    return {
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
      }
    }
  }
}

// Plugin manifest
const manifest = {
  identifier: 'gitlab-mr-plugin', // 唯一标识符，用于插件匹配
  name: 'Gitlab Mr Plugin',
  version: '1.0.0',
  description: 'A Zadig plugin: gitlab-mr-plugin',
  author: 'Zadig Team',
  type: 'page',
  entry: './index.js',
  icon: '',
  route: '&#x2F;gitlab-mr-plugin',
  permissions: [
    // 在这里添加需要的权限
  ]
}

// Set default manifest
GitlabMrPlugin.defaultManifest = manifest

// Register plugin class (not instance) - following gitlab-mr-plugin pattern
const registrarName = '__zadig_plugin_gitlab-mr-plugin'.replace(/-/g, '_')
if (window[registrarName]) {
  window[registrarName].register(GitlabMrPlugin)
}

export default GitlabMrPlugin

