<template>
  <div class="filter-bar">
    <div class="filter-group">
      <label class="filter-label">状态:</label>
      <el-select
        :value="filterState"
        @input="handleStateChange"
        size="small"
        style="width: 120px"
      >
        <el-option
          v-for="option in stateOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </div>

    <div class="filter-group">
      <label class="filter-label">范围:</label>
      <el-select
        :value="filterScope"
        @input="handleScopeChange"
        size="small"
        style="width: 140px"
      >
        <el-option
          v-for="option in scopeOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterBar',
  props: {
    stateOptions: {
      type: Array,
      default: () => []
    },
    scopeOptions: {
      type: Array,
      default: () => []
    },
    filterState: {
      type: String,
      default: 'opened'
    },
    filterScope: {
      type: String,
      default: 'assigned_to_me'
    }
  },

  methods: {
    handleStateChange (value) {
      this.$emit('update:filter-state', value)
      this.$emit('change')
    },

    handleScopeChange (value) {
      this.$emit('update:filter-scope', value)
      this.$emit('change')
    }
  }
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    justify-content: space-between;
  }

  .filter-bar .el-select {
    width: 100%;
  }
}
</style>
</template>
