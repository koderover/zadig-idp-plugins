<template>
  <el-table
    :data="data"
    :loading="loading"
    @row-click="handleRowClick"
    style="width: 100%"
    stripe
  >
    <el-table-column prop="title" label="标题" min-width="300">
      <template slot-scope="scope">
        <div class="mr-title">
          <span class="mr-iid">#{{ scope.row.iid }}</span>
          <span class="title-text">{{ scope.row.title }}</span>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="源分支">
      <template slot-scope="scope">
        <span class="branch-name">{{ scope.row.source_branch }}</span>
      </template>
    </el-table-column>
    <el-table-column label="目标分支">
      <template slot-scope="scope">
        <span class="branch-name">{{ scope.row.target_branch }}</span>
      </template>
    </el-table-column>

    <el-table-column label="作者">
      <template slot-scope="scope">
        <div class="author-info">
          <img
            v-if="scope.row.author.avatar_url"
            :src="scope.row.author.avatar_url"
            class="author-avatar"
            :alt="scope.row.author.name"
          />
          <span class="author-name">{{ scope.row.author.name }}</span>
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="state" label="状态" width="100">
      <template slot-scope="scope">
        <el-tag :type="getStateType(scope.row.state)" size="small">
          {{ getStateText(scope.row.state) }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="创建时间" width="160">
      <template slot-scope="scope">
        {{ formatDate(scope.row.created_at) }}
      </template>
    </el-table-column>

    <el-table-column label="更新时间" width="160">
      <template slot-scope="scope">
        {{ formatDate(scope.row.updated_at) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'MRTable',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleRowClick (row) {
      this.$emit('row-click', row)
    },

    formatDate (dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleString('zh-CN')
    },

    getStateText (state) {
      const stateMap = {
        opened: '已打开',
        closed: '已关闭',
        merged: '已合并'
      }
      return stateMap[state] || state
    },

    getStateType (state) {
      const typeMap = {
        opened: 'primary',
        closed: 'info',
        merged: 'success'
      }
      return typeMap[state] || 'default'
    }
  }
}
</script>

<style scoped>
.mr-title {
  font-size: 14px;
}

.mr-iid {
  color: #0066ff;
  font-size: 14px;
  font-weight: 400;
  margin-right: 8px;
}

.branch-name {
  font-size: 14px;
  font-weight: 400;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.author-name {
  font-size: 13px;
}

.mr-meta {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}

.project-name {
  color: #1890ff;
}

.mr-id {
  color: #999;
}
</style>

<style>
.el-table {
  cursor: pointer;
}

.el-table__row:hover {
  background-color: #f5f7fa;
}
</style>
