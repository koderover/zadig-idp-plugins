<template>
  <div class="gitlab-mr-plugin">
    <div class="plugin-header">
      <h2>GitLab Merge Requests</h2>
      <div class="header-actions">
        <el-button size="small" icon="el-icon-setting" @click="showTokenDialog = true">
          配置
        </el-button>
        <el-button size="small" icon="el-icon-refresh" @click="handleRefresh" :loading="loading">
          刷新
        </el-button>
      </div>
    </div>

    <!-- 配置对话框 -->
    <ConfigDialog
      :visible.sync="showTokenDialog"
      :gitlab-url.sync="gitlabUrl"
      :gitlab-token.sync="gitlabToken"
      @save="saveConfig"
      @test="testConnection"
      @clear="clearConfig"
    />

    <!-- 未配置提示 -->
    <div v-if="!isConfigured" class="config-prompt">
      <p class="config-prompt-title">需要配置 GitLab 信息</p>
      <p class="config-prompt-desc">请先配置 GitLab URL 和 Access Token 才能查看 Merge Request</p>
      <el-button
        type="primary"
        @click="showTokenDialog = true"
        size="small"
      >
        立即配置
      </el-button>
    </div>

    <!-- 主要内容 -->
    <div v-else>
      <!-- 筛选器 -->
      <FilterBar
        :state-options="stateOptions"
        :scope-options="scopeOptions"
        :filter-state.sync="filterState"
        :filter-scope.sync="filterScope"
        @change="handleFilterChange"
      />

      <!-- 错误提示 -->
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        style="margin-bottom: 16px"
      />

      <!-- MR 表格 -->
      <MRTable
        :data="mergeRequests"
        :loading="loading"
        @row-click="openMR"
      />

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="total > pageSize">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, total"
          small
        />
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && mergeRequests.length === 0" class="empty-state">
        <i class="el-icon-document"></i>
        <p>暂无 Merge Request</p>
      </div>
    </div>
  </div>
</template>

<script>
import ConfigDialog from './ConfigDialog.vue'
import FilterBar from './FilterBar.vue'
import MRTable from './MRTable.vue'

export default {
  name: 'GitLabMRMain',
  components: {
    ConfigDialog,
    FilterBar,
    MRTable
  },
  props: {
    storage: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      // GitLab 配置
      gitlabToken: '',
      gitlabUrl: '',
      showTokenDialog: false,

      // MR 数据
      mergeRequests: [],
      loading: false,
      error: null,

      // 分页
      currentPage: 1,
      pageSize: 20,
      total: 0,

      // 筛选
      filterState: 'opened',
      filterScope: 'assigned_to_me'
    }
  },

  computed: {
    isConfigured () {
      return this.gitlabToken && this.gitlabUrl
    },

    stateOptions () {
      return [
        { label: '已打开', value: 'opened' },
        { label: '已关闭', value: 'closed' },
        { label: '已合并', value: 'merged' },
        { label: '全部', value: 'all' }
      ]
    },

    scopeOptions () {
      return [
        { label: '分配给我', value: 'assigned_to_me' },
        { label: '我创建的', value: 'created_by_me' },
        { label: '全部', value: 'all' }
      ]
    }
  },

  mounted () {
    this.loadConfig()
    if (this.isConfigured) {
      this.fetchMergeRequests()
    }
  },

  methods: {
    // 加载配置
    loadConfig () {
      if (!this.storage) {
        console.error('Storage not available in loadConfig')
        return
      }
      this.gitlabToken = this.storage.get('gitlab_token') || ''
      this.gitlabUrl = this.storage.get('gitlab_url') || 'https://gitlab.com'
    },

    // 保存配置
    saveConfig () {
      if (!this.storage) {
        console.error('Storage not available in saveConfig')
        this.$message.error('存储服务不可用')
        return
      }

      if (!this.gitlabToken || !this.gitlabUrl) {
        this.$message.error('请填写完整的 GitLab 配置')
        return
      }

      this.storage.set('gitlab_token', this.gitlabToken)
      this.storage.set('gitlab_url', this.gitlabUrl)
      this.showTokenDialog = false
      this.$message.success('配置已保存')
      this.fetchMergeRequests()
    },

    // 清除配置
    clearConfig () {
      if (!this.storage) {
        console.error('Storage not available in clearConfig')
        this.$message.error('存储服务不可用')
        return
      }

      this.$confirm('确定要清除 GitLab 配置吗？', '确认', {
        type: 'warning'
      }).then(() => {
        this.storage.remove('gitlab_token')
        this.storage.remove('gitlab_url')
        this.gitlabToken = ''
        this.gitlabUrl = ''
        this.mergeRequests = []
        this.$message.success('配置已清除')
      }).catch(() => {
        // 用户取消操作
      })
    },

    // 获取 Merge Requests
    async fetchMergeRequests () {
      if (!this.isConfigured) {
        this.showTokenDialog = true
        return
      }

      this.loading = true
      this.error = null

      try {
        const params = new URLSearchParams({
          state: this.filterState === 'all' ? undefined : this.filterState,
          scope: this.filterScope === 'all' ? undefined : this.filterScope,
          page: this.currentPage,
          per_page: this.pageSize,
          sort: 'desc'
        })

        // 移除未定义的参数
        Array.from(params.entries()).forEach(([key, value]) => {
          if (value === 'undefined' || value === undefined) {
            params.delete(key)
          }
        })

        const response = await fetch(`${this.gitlabUrl}/api/v4/merge_requests?${params}`, {
          headers: {
            Authorization: `Bearer ${this.gitlabToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Token 无效或已过期')
          } else if (response.status === 403) {
            throw new Error('Token 权限不足，需要 api 和 read_user 权限')
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
        }

        const data = await response.json()
        this.mergeRequests = data

        // 从响应头获取总数
        const totalHeader = response.headers.get('X-Total')
        this.total = totalHeader ? parseInt(totalHeader) : data.length
      } catch (error) {
        console.error('获取 MR 失败:', error)
        this.error = error.message
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          this.$message.error('网络连接失败，请检查 GitLab URL 是否正确')
        } else {
          this.$message.error(`获取Merge Request失败: ${error.message}`)
        }
      } finally {
        this.loading = false
      }
    },

    // 刷新数据
    handleRefresh () {
      this.currentPage = 1
      this.fetchMergeRequests()
    },

    // 筛选变化
    handleFilterChange () {
      this.currentPage = 1
      this.fetchMergeRequests()
    },

    // 分页变化
    handlePageChange (page) {
      this.currentPage = page
      this.fetchMergeRequests()
    },

    // 打开MR详情
    openMR (mr) {
      window.open(mr.web_url, '_blank')
    },

    // 测试连接
    async testConnection () {
      if (!this.gitlabToken || !this.gitlabUrl) {
        this.$message.error('请填写完整的 GitLab 配置')
        return
      }

      const loading = this.$loading({
        text: '正在测试连接...'
      })

      try {
        const response = await fetch(`${this.gitlabUrl}/api/v4/user`, {
          headers: {
            Authorization: `Bearer ${this.gitlabToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Token 无效或已过期')
          } else if (response.status === 403) {
            throw new Error('Token 权限不足，需要 api 和 read_user 权限')
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
        }

        const user = await response.json()
        this.$message.success(`连接成功！当前用户: ${user.name} (@${user.username})`)
      } catch (error) {
        console.error('连接测试失败:', error)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          this.$message.error('网络连接失败，请检查 GitLab URL 是否正确')
        } else {
          this.$message.error(`连接失败: ${error.message}`)
        }
      } finally {
        loading.close()
      }
    }
  }
}
</script>

<style scoped>
.gitlab-mr-plugin {
  padding: 20px;
  background: #fff;
  height: 100%;
  font-size: 14px;
}

.plugin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.plugin-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.config-prompt {
  text-align: center;
  padding: 40px 20px;
}

.config-prompt-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.config-prompt-desc {
  font-size: 14px;
  color: #666;
}

.pagination-wrapper {
  margin-top: 16px;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gitlab-mr-plugin {
    padding: 12px;
  }

  .plugin-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
