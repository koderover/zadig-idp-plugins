<template>
  <el-dialog
    title="GitLab 配置"
    :visible.sync="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-position="left" label-width="120px">
      <el-form-item label="GitLab URL">
        <el-input
          v-model="form.gitlabUrl"
          placeholder="例如: https://gitlab.com 或 https://gitlab.example.com"
          size="small"
        />
      </el-form-item>

      <el-form-item label="Access Token">
        <el-input
          v-model="form.gitlabToken"
          type="password"
          placeholder="输入 GitLab Access Token"
          show-password
          size="small"
        />
        <div class="form-help">
          <p>Token需要以下权限:</p>
          <ul>
            <li>api - 访问 API</li>
            <li>read_user - 读取用户信息</li>
          </ul>
          <p>
            <a href="https://gitlab.com/-/profile/personal_access_tokens" target="_blank">
              在 GitLab.com 创建 Token
            </a>
          </p>
        </div>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClear" type="danger" plain>清除配置</el-button>
      <el-button size="small" @click="handleTest" :loading="testing">测试连接</el-button>
      <el-button size="small" type="primary" @click="handleSave">保存</el-button>
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ConfigDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    gitlabUrl: {
      type: String,
      default: ''
    },
    gitlabToken: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      testing: false,
      form: {
        gitlabUrl: '',
        gitlabToken: ''
      }
    }
  },

  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },

  watch: {
    visible (newVal) {
      if (newVal) {
        this.form.gitlabUrl = this.gitlabUrl
        this.form.gitlabToken = this.gitlabToken
      }
    }
  },

  methods: {
    handleSave () {
      this.$emit('update:gitlab-url', this.form.gitlabUrl)
      this.$emit('update:gitlab-token', this.form.gitlabToken)
      this.$emit('save')
    },

    handleTest () {
      this.$emit('update:gitlab-url', this.form.gitlabUrl)
      this.$emit('update:gitlab-token', this.form.gitlabToken)
      this.$emit('test')
    },

    handleClear () {
      this.$emit('clear')
    }
  }
}
</script>

<style scoped>
.form-help {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.form-help p {
  margin: 4px 0;
}

.form-help ul {
  margin: 4px 0;
  padding-left: 16px;
  list-style: disc;
}

.form-help li {
  margin: 2px 0;
}

.form-help a {
  color: #06f;
  text-decoration: none;
  font-size: 11px;
}

.form-help a:hover {
  text-decoration: underline;
}

.dialog-footer {
  text-align: right;
}

.dialog-footer .el-button + .el-button {
  margin-left: 10px;
}
</style>
</template>
