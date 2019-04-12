<el-form ref="form2" :model="checkResultData" disabled size="mini" label-width="200px">
        <el-form-item label="最近一次短信发送时间">
          <el-input v-model="checkResultData.lastSendTime" />
        </el-form-item>
        <el-form-item label="最近一次号码推送时间">
          <el-input v-model="checkResultData.lastPushTime" />
        </el-form-item>
        <el-form-item label="当天发送成功号码数量">
          <el-input v-model="checkResultData.sendSuccessCount" />
        </el-form-item>
        <el-form-item label="当天发送失败号码数量">
          <el-input v-model="checkResultData.sendFailCount" />
        </el-form-item>
        <el-form-item label="当天提交成功号码数量">
          <el-input v-model="checkResultData.submitSuccessCount" />
        </el-form-item>
        <el-form-item label="当天提交失败号码数量">
          <el-input v-model="checkResultData.submitFailCount" />
        </el-form-item>
        <el-form-item label="当天超出日发送量号码数量">
          <el-input v-model="checkResultData.overDayCount" />
        </el-form-item>
        <el-form-item label="当天超出月发送量数量">
          <el-input v-model="checkResultData.overMonthCount" />
        </el-form-item>
        <div slot="footer" class="dialog-footer">
          <el-button @click="tcDialogVisible = false">取消</el-button>
          <el-button type="primary">保存</el-button>
        </div>
      </el-form>