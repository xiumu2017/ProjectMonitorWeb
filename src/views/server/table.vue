<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container">
      <el-select v-model="pageQuery.type" class="filter-item" placeholder="请选择类别" filterable clearable>
        <el-option v-for="item in typeArr" :key="item.code" :value="item.code" :label="item.name" />
      </el-select>
      <el-select v-model="pageQuery.city" class="filter-item" placeholder="请选择城市" filterable clearable>
        <el-option v-for="item in cityArr" :key="item" :value="item" :label="item" />
      </el-select>
      <el-input v-model="pageQuery.name" placeholder="请输入项目名称" style="width: 200px;" class="filter-item" />
      <el-select v-model="pageQuery.enable" class="filter-item" placeholder="启用/禁用" clearable>
        <el-option key="1" value="1" label="启用" />
        <el-option key="0" value="0" label="禁用" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh" @click="pageQuery = {}">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" @click="excelExport">导出</el-button>
    </div>

    <!-- table
      @row-dblclick="handleEdit"
      @row-contextmenu="deleteProject" -->

    <el-table
      v-loading="listLoading"
      :data="list"
      style="margin-top: 20px"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="内网IP" width="80">
        <template slot-scope="scope">
          {{ scope.row.ipAddr }}
        </template>
      </el-table-column>
      <el-table-column label="公网IP" width="80">
        <template slot-scope="scope">
          {{ scope.row.ipAddrPublic }}
        </template>
      </el-table-column>
      <el-table-column label="域名" width="80">
        <template slot-scope="scope">
          {{ scope.row.domainAddr }}
        </template>
      </el-table-column>
      <el-table-column label="端口" width="80">
        <template slot-scope="scope">
          {{ scope.row.port }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="80">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="密码" width="80">
        <template slot-scope="scope">
          {{ scope.row.password }}
          <a :href="scope.row.url" class="el-icon-share" target="_blank" style="color: #409EFF">link</a>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="90" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            @change="changeEnable(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.serverType }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.serverStatus }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getPage, del, update, getServerTypeList, connect, excelExport } from '@/api/server'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      serverTypeArr: [],
      list: null,
      listLoading: true,
      pageQuery: {},
      loading: null
    }
  },
  created() {
    getServerTypeList().then(res => {
      this.serverTypeArr = res.data
    })
  },
  methods: {
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    closeLoading() {
      this.loading.close()
    },
    fetchData() {
      this.listLoading = true
      getPage(this.pageQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    changeEnable(row) {
      const param = { 'id': row.id, 'enable': row.enable }
      update(param).then(res => {
        if (res.code === 200) {
          this.fetchData()
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    },
    serverTest() {
      this.openLoading()
      connect(this.serverFormData).then(res => {
        this.closeLoading()
        if (res.code === 200) {
          Message({
            message: res.msg + res.data,
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    },
    deleteProject(row, c, e) {
      event.preventDefault()
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading()
        del({ 'id': row.id }).then(res => {
          this.closeLoading()
          if (res.code === 200) {
            this.fetchData()
            Message({
              message: res.msg,
              type: 'success',
              duration: 3 * 1000
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    excelExport() {
      this.openLoading()
      excelExport(this.pageQuery).then(res => {
        this.closeLoading()
      })
    }
  }
}
</script>
