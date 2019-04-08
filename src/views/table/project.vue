<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container">
      <el-select v-model="listQuery.city" class="filter-item" placeholder="请选择城市" filterable clearable>
        <el-option v-for="item in cityArr" :key="item" :value="item" :label="item" />
      </el-select>
      <el-input v-model="listQuery.name" placeholder="请输入项目名称" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="城市" width="100">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" width="450">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="100" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            @change="changeEnable(row)"/>
        </template>
      </el-table-column>
      <el-table-column label="Mas类型" width="200">
        <template slot-scope="scope">
          {{ scope.row.masType }}
        </template>
      </el-table-column>
      <el-table-column label="监控方式" width="100">
        <template slot-scope="scope">
          {{ scope.row.monitorType }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="500">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="success" size="mini" @click="handleServerEdit(row)">Server</el-button>
          <el-button type="danger" size="mini" @click="handleDbEdit(row)">DB</el-button>
          <el-button type="danger" size="mini" @click="handleDbEdit(row)">运行查看</el-button>
          <el-button size="mini">客户信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  edit dialog  -->
    <el-dialog :visible.sync="dialogFormVisible" title="项目信息维护">
      <el-form ref="dataForm" :rules="rules" :model="projectData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="城市" prop="city">
          <el-select v-model="projectData.city" class="filter-item" placeholder="Please select" filterable clearable>
            <el-option v-for="item in cityArr" :key="item" :value="item" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectData.name" />
        </el-form-item>
        <el-form-item label="访问地址" prop="url">
          <el-input v-model="projectData.url" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="projectData.userName" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="projectData.password" />
        </el-form-item>
        <el-form-item label="MAS类型">
          <el-select v-model="projectData.masType" class="filter-item" placeholder="Please select">
            <el-option v-for="(item) in masTypeArr" :key="item.code" :value="item.code" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="监控方式">
          <el-select v-model="projectData.monitorType" class="filter-item" placeholder="Please select">
            <el-option key="1" value="DB" label="数据库直连" />
            <el-option key="2" value="WEB" label="Web接口调用" />
            <el-option key="3" value="OTHER" label="其它" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-rate v-model="projectData.level" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="projectData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit()">保存</el-button>
      </div>
    </el-dialog>

    <!-- server dialog -->
    <el-dialog :visible.sync="serverDialogVisible" title="服务器信息">
      <el-form ref="serverForm" :rules="rules" :model="serverFormData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="IP" prop="ip">
          <el-input v-model="serverFormData.ip" />
        </el-form-item>
        <el-form-item label="PORT" prop="port">
          <el-input v-model="serverFormData.port" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="serverFormData.userName" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="serverFormData.password" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="serverFormData.status" class="filter-item" placeholder="Please select">
            <el-option key="0" value="0" label="启用" />
            <el-option key="1" value="1" label="停用" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="serverFormData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="serverDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitServerEdit()">保存</el-button>
        <el-button type="primary" @click="serverTest">连接测试</el-button>
      </div>
    </el-dialog>
    <!-- db dialog -->
    <el-dialog :visible.sync="dbDialogVisible" title="数据库信息">
      <el-form ref="dbForm" :rules="rules" :model="dbFormData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="IP" prop="ip">
          <el-input v-model="dbFormData.ip" />
        </el-form-item>
        <el-form-item label="PORT" prop="port">
          <el-input v-model="dbFormData.port" />
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="dbFormData.url" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="dbFormData.userName" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dbFormData.password" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dbFormData.status" class="filter-item" placeholder="Please select">
            <el-option key="0" value="0" label="启用" />
            <el-option key="1" value="1" label="停用" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="dbFormData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dbDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDbEdit()">保存</el-button>
        <el-button type="primary" @click="submitEdit()">连接测试</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import { getList, getMasTypeList, saveProject, changeEnable, saveDb, saveServer, getServer, getDb } from '@/api/project'

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
      masTypeArr: [],
      cityArr: ['合肥', '宿州', '阜阳', '马鞍山', '宣城', '池州', '安庆', '六安', '滁州', '铜陵', '亳州', '淮南', '淮北', '黄山'],
      list: null,
      listLoading: true,
      listQuery: {},
      dialogFormVisible: false,
      serverDialogVisible: false,
      dbDialogVisible: false,
      serverFormData: {},
      dbFormData: {},
      projectData: {},
      currentId: null
    }
  },
  created() {
    this.fetchData()
    getMasTypeList().then(response => {
      this.masTypeArr = response.data
      console.log(this.masTypeArr)
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data
        this.list.forEach(item => {
          this.masTypeArr.forEach(type => {
            if (type && type.code === item.masType) {
              item.masType = type.name
            }
          })
        })
        this.listLoading = false
      })
    },
    handleEdit(row) {
      this.projectData = row
      this.dialogFormVisible = true
    },
    handleServerEdit(row) {
      this.currentId = row.id
      this.serverDialogVisible = true
      if (row.serverId) {
        getServer({ 'id': row.serverId }).then(res => {
          if (res.code === 200) {
            this.serverFormData = res.data
          }
        })
      }
    },
    handleDbEdit(row) {
      this.currentId = row.id
      this.dbDialogVisible = true
      if (row.dbId) {
        getDb({ 'id': row.dbId }).then(res => {
          if (res.code === 200) {
            this.dbFormData = res.data
          }
        })
      }
    },
    submitEdit() {
      const param = Object.assign(this.projectData, {})
      console.log(param)
      saveProject(param).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.fetchData()
          this.dialogFormVisible = false
          Message({
            message: response.msg,
            type: 'success',
            duration: 5 * 1000
          })
        } else {
          MessageBox({
            message: response.msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
    },
    changeEnable(row) {
      changeEnable({ 'id': row.id, 'enable': row.enable }).then(res => {
        if (res.code === 200) {
          this.fetchData()
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    submitDbEdit() {
      saveDb(Object.assign({}, this.dbFormData, { 'projectId': this.currentId })).then(res => {
        if (res.code === 200) {
          this.dbDialogVisible = false
          this.fetchData()
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    submitServerEdit() {
      const param = Object.assign({ 'projectId': this.currentId }, this.serverFormData)
      console.log(param)
      saveServer(param).then(res => {
        if (res.code === 200) {
          this.serverDialogVisible = false
          this.fetchData()
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    serverTest() {
      console.log('serverTest')
      Message({
        message: 'serverTest',
        type: 'success',
        duration: 3 * 1000
      })
    }
  }
}
</script>
