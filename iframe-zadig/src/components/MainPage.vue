<template>
  <div class="iframe-plugin">
    <!-- 配置按钮 -->
    <div v-if="hasConfig" class="config-button-wrapper">
      <el-button
        type="primary"
        icon="el-icon-setting"
        circle
        size="small"
        @click="openConfigDialog"
        title="配置 Iframe"
      ></el-button>
    </div>

    <!-- iframe 内容 -->
    <iframe
      v-if="hasConfig"
      class="iframe-content"
      :src="iframeConfig.url"
      :title="iframeConfig.title"
      :name="iframeConfig.name"
      :allow="iframeConfig.permissions.join(' ')"
      :sandbox="iframeConfig.sandboxEnabled ? iframeConfig.sandboxPermissions.join(' ') : null"
      :referrerpolicy="iframeConfig.referrerpolicy"
      :loading="iframeConfig.loading"
      frameborder="0"
    ></iframe>

    <!-- 空状态提示 -->
    <div v-else class="empty-state">
      <p>正在加载配置...</p>
    </div>

    <!-- 配置对话框 -->
    <ConfigDialog
      :visible.sync="showConfigDialog"
      :config="iframeConfig"
      @save="handleConfigSave"
    />
  </div>
</template>

<script>
import ConfigDialog from './ConfigDialog.vue'

export default {
  name: 'IframeZadigMainPage',
  components: {
    ConfigDialog
  },

  props: {
    context: {
      type: Object,
      default: () => ({})
    },
    storage: {
      type: Object,
      default: null
    },
    pluginAPI: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      showConfigDialog: false,
      hasConfig: false,
      iframeConfig: {
        // 基础配置
        url: '',
        title: '',
        name: '',
        loading: 'lazy',
        referrerpolicy: 'no-referrer-when-downgrade',
        // 权限和安全
        permissions: [],
        sandboxEnabled: false,
        sandboxPermissions: []
      }
    }
  },

  mounted() {
    this.initPlugin()
  },

  methods: {
    initPlugin() {
      // 从 storage 读取 iframe 配置
      if (this.storage) {
        const savedConfig = this.storage.get('iframeConfig')
        if (savedConfig && savedConfig.url) {
          // 有配置，加载配置
          this.iframeConfig = savedConfig
          this.hasConfig = true
        } else {
          // 无配置，弹出配置对话框
          this.showConfigDialog = true
        }
      } else {
        // 没有 storage，弹出配置对话框
        this.showConfigDialog = true
      }
    },

    handleConfigSave(newConfig) {
      this.iframeConfig = newConfig
      this.hasConfig = true
      if (this.storage) {
        this.storage.set('iframeConfig', newConfig)
      }
      this.showConfigDialog = false
      this.$message.success('配置已保存！')
    },

    openConfigDialog() {
      this.showConfigDialog = true
    }
  }
}
</script>

<style scoped>
.iframe-plugin {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.config-button-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1000;
}

.iframe-content {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #909399;
  font-size: 14px;
}
</style>
