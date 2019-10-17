<template>
  <div class="app-container">
    <el-button round size="large" @click="showAdd">+</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="序号" width="100">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.startTime }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="事件" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.events }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" fullscreen>
      <el-form :label-width="100" v-model="formData">
        <el-form-item label="时间区间">
          <el-date-picker
            v-model="rangValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"/>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-picker v-model="formData.startTime" placeholder="开始时间" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-time-picker v-model="formData.endTime" placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="累计耗时">{{ formData.duration }}</el-form-item>
        <el-form-item label="事件类型">
          <el-select v-model="formData.type" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="事件详情">
          <el-input v-model="formData.events" type="textarea"/>
        </el-form-item>
      </el-form>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="doAdd">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getList, doAdd, getTypeList } from '@/api/myday'

export default {
  data() {
    return {
      list: null,
      formData: {},
      dialogVisible: false,
      types: [{ id: '1', name: '11' }],
      rangValue: []
    }
  },
  created() {
    getTypeList().then(res => {
      console.log(res)
      if (res.code === 200) {
        this.types = res.data
      }
    })
    // this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.items
        this.listLoading = false
      })
    },
    showAdd() {
      this.dialogVisible = true
    },
    doAdd() {
      console.log(this.formData)
      this.formData.startTime = this.dateFormatter(this.formData.startTime)
      this.formData.endTime = this.dateFormatter(this.formData.endTime)
      console.log('......')
      console.log(this.formData)
      doAdd(this.formData).then(res => {
        console.log(res)
      })
      this.dialogVisible = false
    },
    dateFormatter(x) {
      let date
      if (x instanceof Date) {
        date = x
      } else {
        date = new Date(x)
      }
      return date.getFullYear() + '-' +
        date.getMonth() + '-' +
        date.getDate() + ' ' +
        date.getHours() + ':' +
        date.getMinutes() + ':' +
        date.getSeconds()
    }
  }
}
</script>
