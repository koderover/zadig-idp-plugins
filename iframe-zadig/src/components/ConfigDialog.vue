<template>
  <el-dialog
    title="Iframe 配置"
    :visible.sync="dialogVisible"
    width="650px"
    :close-on-click-modal="false"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 基础配置 -->
      <el-tab-pane label="基础配置" name="basic">
        <el-form
          :model="form"
          :rules="rules"
          ref="configForm"
          label-width="100px"
          label-position="left"
          size="small"
        >
          <el-form-item label="URL" prop="url">
            <el-input
              v-model="form.url"
              placeholder="请输入 iframe 地址，例如：https://example.com"
            />
          </el-form-item>

          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题" />
          </el-form-item>

          <el-form-item label="名称">
            <el-input
              v-model="form.name"
              placeholder="iframe 名称，用于 target 等"
            />
          </el-form-item>

          <el-form-item label="加载方式">
            <el-select
              v-model="form.loading"
              style="width: 100%"
              placeholder="选择加载方式"
            >
              <el-option label="立即加载" value="eager"></el-option>
              <el-option label="延迟加载（lazy）" value="lazy"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Referrer 策略">
            <el-select
              v-model="form.referrerpolicy"
              style="width: 100%"
              placeholder="选择 Referrer 策略"
            >
              <el-option label="默认" value=""></el-option>
              <el-option
                label="no-referrer（不发送）"
                value="no-referrer"
              ></el-option>
              <el-option
                label="no-referrer-when-downgrade"
                value="no-referrer-when-downgrade"
              ></el-option>
              <el-option label="origin（仅源）" value="origin"></el-option>
              <el-option
                label="same-origin（同源）"
                value="same-origin"
              ></el-option>
              <el-option
                label="strict-origin"
                value="strict-origin"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 权限控制 -->
      <el-tab-pane label="权限控制" name="permissions">
        <el-form :model="form" label-width="100px" size="small">
          <el-form-item label="权限列表">
            <el-checkbox-group v-model="form.permissions">
              <el-checkbox label="fullscreen">全屏</el-checkbox>
              <el-checkbox label="autoplay">自动播放</el-checkbox>
              <el-checkbox label="camera">摄像头</el-checkbox>
              <el-checkbox label="microphone">麦克风</el-checkbox>
              <el-checkbox label="geolocation">定位</el-checkbox>
              <el-checkbox label="clipboard-read">读取剪贴板</el-checkbox>
              <el-checkbox label="clipboard-write">写入剪贴板</el-checkbox>
              <el-checkbox label="accelerometer">加速计</el-checkbox>
              <el-checkbox label="gyroscope">陀螺仪</el-checkbox>
              <el-checkbox label="payment">支付</el-checkbox>
              <el-checkbox label="usb">USB</el-checkbox>
              <el-checkbox label="vr">VR</el-checkbox>
              <el-checkbox label="xr-spatial-tracking">Web XR</el-checkbox>
            </el-checkbox-group>
            <div class="form-hint">控制 iframe 可以使用的浏览器功能</div>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 安全沙盒 -->
      <el-tab-pane label="安全沙盒" name="sandbox">
        <el-form :model="form" label-width="150px" size="small">
          <el-form-item label="启用沙盒">
            <el-switch v-model="form.sandboxEnabled"></el-switch>
            <div class="form-hint">启用沙盒后，iframe 默认权限最小化</div>
          </el-form-item>

          <el-form-item label="Sandbox 权限" v-if="form.sandboxEnabled">
            <el-checkbox-group v-model="form.sandboxPermissions">
              <el-checkbox label="allow-scripts">允许脚本</el-checkbox>
              <el-checkbox label="allow-same-origin">同源处理</el-checkbox>
              <el-checkbox label="allow-forms">允许表单</el-checkbox>
              <el-checkbox label="allow-popups">允许弹窗</el-checkbox>
              <el-checkbox label="allow-popups-to-escape-sandbox"
                >弹窗可离开沙盒</el-checkbox
              >
              <el-checkbox label="allow-top-navigation-by-user-activation"
                >用户操作跳转顶层</el-checkbox
              >
              <el-checkbox label="allow-modals">允许模态框</el-checkbox>
              <el-checkbox label="allow-downloads">允许下载</el-checkbox>
              <el-checkbox label="allow-pointer-lock">指针锁定</el-checkbox>
              <el-checkbox label="allow-orientation-lock"
                >屏幕方向锁定</el-checkbox
              >
              <el-checkbox label="allow-presentation">演示 API</el-checkbox>
              <el-checkbox label="allow-storage-access-by-user-activation"
                >用户操作访问存储</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSave" size="small"
        >保存</el-button
      >
      <el-button @click="handleCancel" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'IframeZadigConfigDialog',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      activeTab: 'basic',
      form: {
        // 基础配置
        url: '',
        title: '',
        name: '',
        loading: 'lazy',
        referrerpolicy: 'no-referrer-when-downgrade',

        // 权限控制
        permissions: ['fullscreen', 'clipboard-read', 'clipboard-write'],

        // 安全沙盒
        sandboxEnabled: false,
        sandboxPermissions: ['allow-scripts', 'allow-same-origin']
      },
      rules: {
        url: [
          { required: true, message: '请输入 iframe 地址', trigger: 'blur' },
          { type: 'url', message: '请输入有效的 URL', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.loadConfig()
      }
    }
  },

  methods: {
    loadConfig() {
      // 处理旧格式的 allow 字符串转换为 permissions 数组
      let permissions = ['fullscreen', 'clipboard-read', 'clipboard-write']

      if (this.config.permissions && Array.isArray(this.config.permissions)) {
        permissions = this.config.permissions
      }

      this.form = {
        // 基础配置
        url: this.config.url || '',
        title: this.config.title || '',
        name: this.config.name || '',
        loading: this.config.loading || 'lazy',
        referrerpolicy: this.config.referrerpolicy || 'no-referrer-when-downgrade',
        // 权限控制
        permissions: permissions,
        // 安全沙盒
        sandboxEnabled: this.config.sandboxEnabled || false,
        sandboxPermissions: this.config.sandboxPermissions || ['allow-scripts', 'allow-same-origin'],
      }
    },

    handleSave() {
      this.$refs.configForm.validate((valid) => {
        if (valid) {
          // 构建完整配置
          const config = {
            // 基础配置
            url: this.form.url,
            title: this.form.title,
            name: this.form.name,
            loading: this.form.loading,
            referrerpolicy: this.form.referrerpolicy,

            // 权限控制
            permissions: this.form.permissions,

            // 安全沙盒
            sandboxEnabled: this.form.sandboxEnabled,
            sandboxPermissions: this.form.sandboxPermissions
          }

          this.$emit('save', config)
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },

    handleCancel() {
      this.$refs.configForm.resetFields()
      this.loadConfig()
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.form-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.5;
}

.el-checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px 8px;
}

.el-checkbox-group .el-checkbox {
  margin-right: 0;
  margin-bottom: 0;
}

.el-tabs {
  max-height: 500px;
  overflow-y: auto;
}
</style>