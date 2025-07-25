<template>
  <div class="app-container">
    <el-tabs tab-position="left">
      <!-- 基本设置 Tab Pane -->
      <el-tab-pane label="账号信息">
        <div class="w-full">
          <el-card>
            <!-- 头像和昵称部分 -->
            <div class="relative w-100px h-100px flex-center">
              <el-avatar :src="userProfile.avatar" :size="100" />
              <el-button
                type="info"
                class="absolute bottom-0 right-0 cursor-pointer"
                circle
                :icon="Camera"
                size="small"
                @click="triggerFileUpload"
              />
              <input ref="fileInput" type="file" style="display: none" @change="handleFileChange" />
            </div>
            <div class="mt-5">
              {{ userProfile.nickname }}
              <el-icon
                class="align-middle cursor-pointer"
                @click="handleOpenDialog(DialogType.ACCOUNT)"
              >
                <Edit />
              </el-icon>
            </div>
            <!-- 用户信息描述 -->
            <el-descriptions :column="1" class="mt-10">
              <!-- 用户名 -->
              <el-descriptions-item>
                <template #label>
                  <el-icon class="align-middle"><User /></el-icon>
                  用户名
                </template>
                {{ userProfile.username }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <el-icon class="align-middle"><Phone /></el-icon>
                  手机号码
                </template>
                {{ userProfile.mobile }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <el-icon class="align-middle"><Message /></el-icon>
                  邮箱
                </template>
                {{ userProfile.email }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="i-svg:role" />
                  角色
                </template>
                {{ userProfile.type === 1 ? "超级管理员" : "管理员" }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template #label>
                  <el-icon class="align-middle"><Timer /></el-icon>
                  创建日期
                </template>
                {{ dayjs(+userProfile.createdAt * 1000).format("YYYY/MM/DD HH:mm:ss") }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 安全设置  -->
      <el-tab-pane label="安全设置">
        <el-card>
          <!-- 账户密码 -->
          <el-row>
            <el-col :span="16">
              <div class="font-bold">账户密码</div>
              <div class="text-14px mt-2">
                修改密码
                <el-button
                  type="primary"
                  plain
                  size="small"
                  class="ml-5"
                  @click="() => handleOpenDialog(DialogType.PASSWORD)"
                >
                  修改
                </el-button>
              </div>
            </el-col>
          </el-row>
          <!-- 绑定手机 -->
          <div class="mt-5">
            <div class="font-bold">绑定手机</div>
            <div class="text-14px mt-2">
              <span v-if="userProfile.mobile">已绑定手机号：{{ userProfile.mobile }}</span>
              <span v-else>未绑定手机</span>
              <el-button
                v-if="userProfile.mobile"
                type="primary"
                plain
                size="small"
                class="ml-5"
                @click="() => handleOpenDialog(DialogType.MOBILE)"
              >
                更换
              </el-button>
              <el-button
                v-else
                type="primary"
                plain
                size="small"
                class="ml-5"
                @click="() => handleOpenDialog(DialogType.MOBILE)"
              >
                绑定
              </el-button>
            </div>
          </div>
          <!-- 绑定邮箱 -->
          <div class="mt-5">
            <div class="font-bold">绑定邮箱</div>
            <div class="text-14px mt-2">
              <span v-if="userProfile.email">已绑定邮箱：{{ userProfile.email }}</span>
              <span v-else>未绑定邮箱</span>
              <el-button
                v-if="userProfile.email"
                type="primary"
                plain
                size="small"
                class="ml-5"
                @click="() => handleOpenDialog(DialogType.EMAIL)"
              >
                更换
              </el-button>
              <el-button
                v-else
                type="primary"
                plain
                size="small"
                class="ml-5"
                @click="() => handleOpenDialog(DialogType.EMAIL)"
              >
                绑定
              </el-button>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 弹窗 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" :width="500">
      <!-- 账号资料 -->
      <el-form
        v-if="dialog.type === DialogType.ACCOUNT"
        ref="userProfileFormRef"
        :model="userProfileForm"
        :label-width="100"
      >
        <el-form-item label="昵称">
          <el-input v-model="userProfileForm.nickname" />
        </el-form-item>
      </el-form>

      <!-- 修改密码 -->
      <el-form
        v-if="dialog.type === DialogType.PASSWORD"
        ref="passwordChangeFormRef"
        :model="passwordChangeForm"
        :rules="passwordChangeRules"
        :label-width="100"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordChangeForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordChangeForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordChangeForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <!-- 绑定手机 -->
      <el-form
        v-else-if="dialog.type === DialogType.MOBILE"
        ref="mobileBindingFormRef"
        :model="mobileUpdateForm"
        :rules="mobileBindingRules"
        :label-width="100"
      >
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="mobileUpdateForm.mobile" style="width: 250px" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="mobileUpdateForm.code" style="width: 250px">
            <template #append>
              <el-button class="ml-5" :disabled="mobileCountdown > 0" @click="handleSendMobileCode">
                {{ mobileCountdown > 0 ? `${mobileCountdown}s后重新发送` : "发送验证码" }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <!-- 绑定邮箱 -->
      <el-form
        v-else-if="dialog.type === DialogType.EMAIL"
        ref="emailBindingFormRef"
        :model="emailUpdateForm"
        :rules="emailBindingRules"
        :label-width="100"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="emailUpdateForm.email" style="width: 250px" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="emailUpdateForm.code" style="width: 250px">
            <template #append>
              <el-button class="ml-5" :disabled="emailCountdown > 0" @click="handleSendEmailCode">
                {{ emailCountdown > 0 ? `${emailCountdown}s后重新发送` : "发送验证码" }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog.visible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import * as _ from "lodash-es";

import { Camera } from "@element-plus/icons-vue";
import UserAPI, {
  EmailUpdateForm,
  MobileUpdateForm,
  PasswordChangeForm,
  UserInfoResult,
  UserProfileForm,
} from "../../api/system/user";

const userProfile = ref<UserInfoResult>({
  id: "",
  username: "",
  nickname: "",
  type: 1,
  avatar: "",
  mobile: "",
  email: "",
  createdAt: "",
});

const enum DialogType {
  ACCOUNT = "account",
  PASSWORD = "password",
  MOBILE = "mobile",
  EMAIL = "email",
}

const dialog = reactive({
  visible: false,
  title: "",
  type: "" as DialogType, // 修改账号资料,修改密码、绑定手机、绑定邮箱
});

const userProfileForm = reactive<UserProfileForm>({});
const passwordChangeForm = reactive<PasswordChangeForm>({});
const mobileUpdateForm = reactive<MobileUpdateForm>({});
const emailUpdateForm = reactive<EmailUpdateForm>({});

const mobileCountdown = ref(0);
const mobileTimer = ref();

const emailCountdown = ref(0);
const emailTimer = ref();

// 修改密码校验规则
const passwordChangeRules = {
  oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "请再次输入新密码", trigger: "blur" }],
};

// 手机号校验规则
const mobileBindingRules = {
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

// 邮箱校验规则
const emailBindingRules = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

/**
 * 打开弹窗
 * @param type 弹窗类型 ACCOUNT: 账号资料 PASSWORD: 修改密码 MOBILE: 绑定手机 EMAIL: 绑定邮箱
 */
const handleOpenDialog = (type: DialogType) => {
  dialog.type = type;
  dialog.visible = true;
  switch (type) {
    case DialogType.ACCOUNT:
      dialog.title = "账号资料";
      break;
    case DialogType.PASSWORD:
      dialog.title = "修改密码";
      break;
    case DialogType.MOBILE:
      dialog.title = "绑定手机";
      break;
    case DialogType.EMAIL:
      dialog.title = "绑定邮箱";
      break;
  }
};

/**
 * 发送手机验证码
 */
function handleSendMobileCode() {
  if (!mobileUpdateForm.mobile) {
    ElMessage.error("请输入手机号");
    return;
  }
  // 验证手机号格式
  const reg = /^1[3-9]\d{9}$/;
  if (!reg.test(mobileUpdateForm.mobile)) {
    ElMessage.error("手机号格式不正确");
    return;
  }
  ElMessage.success("功能待开发～");
  // 发送短信验证码
  // UserAPI.sendMobileCode(mobileUpdateForm.mobile).then(() => {
  //   ElMessage.success("验证码发送成功");

  //   // 倒计时 60s 重新发送
  //   mobileCountdown.value = 60;
  //   mobileTimer.value = setInterval(() => {
  //     if (mobileCountdown.value > 0) {
  //       mobileCountdown.value -= 1;
  //     } else {
  //       clearInterval(mobileTimer.value!);
  //     }
  //   }, 1000);
  // });
}

/**
 * 发送邮箱验证码
 */
function handleSendEmailCode() {
  if (!emailUpdateForm.email) {
    ElMessage.error("请输入邮箱");
    return;
  }
  // 验证邮箱格式
  const reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
  if (!reg.test(emailUpdateForm.email)) {
    ElMessage.error("邮箱格式不正确");
    return;
  }

  ElMessage.success("功能待开发～");
  // 发送邮箱验证码
  // UserAPI.sendEmailCode(emailUpdateForm.email).then(() => {
  //   ElMessage.success("验证码发送成功");
  //   // 倒计时 60s 重新发送
  //   emailCountdown.value = 60;
  //   emailTimer.value = setInterval(() => {
  //     if (emailCountdown.value > 0) {
  //       emailCountdown.value -= 1;
  //     } else {
  //       clearInterval(emailTimer.value!);
  //     }
  //   }, 1000);
  // });
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  ElMessage.success("功能待开发～");
  if (dialog.type === DialogType.ACCOUNT) {
    // UserAPI.updateProfile(userProfileForm).then(() => {
    //   ElMessage.success("账号资料修改成功");
    //   dialog.visible = false;
    //   loadUserProfile();
    // });
  } else if (dialog.type === DialogType.PASSWORD) {
    // if (passwordChangeForm.newPassword !== passwordChangeForm.confirmPassword) {
    //   ElMessage.error("两次输入的密码不一致");
    //   return;
    // }
    // UserAPI.changePassword(passwordChangeForm).then(() => {
    //   ElMessage.success("密码修改成功");
    //   dialog.visible = false;
    // });
  } else if (dialog.type === DialogType.MOBILE) {
    // UserAPI.bindOrChangeMobile(mobileUpdateForm).then(() => {
    //   ElMessage.success("手机号绑定成功");
    //   dialog.visible = false;
    //   loadUserProfile();
    // });
  } else if (dialog.type === DialogType.EMAIL) {
    // UserAPI.bindOrChangeEmail(emailUpdateForm).then(() => {
    //   ElMessage.success("邮箱绑定成功");
    //   dialog.visible = false;
    //   loadUserProfile();
    // });
  }
};

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  console.log("file-------", file);
  if (file) {
    // 调用文件上传API
    try {
      // const data = await FileAPI.uploadFile(file);
      // // 更新用户头像
      // userProfile.value.avatar = data.url;
      // 更新用户信息
      // await UserAPI.updateProfile({
      //   avatar: data.url,
      // });
      ElMessage.success("功能待开发～");
    } catch (error) {
      console.error("头像上传失败：" + error);
      ElMessage.error("头像上传失败");
    }
  }
};

/** 加载用户信息 */
const loadUserProfile = async () => {
  // const data = await UserAPI.getProfile();
  const data = await UserAPI.info();
  userProfile.value = data;
  userProfile.value.avatar =
    "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif";
};

onMounted(async () => {
  if (mobileTimer.value) {
    clearInterval(mobileTimer.value);
  }
  if (emailTimer.value) {
    clearInterval(emailTimer.value);
  }
  await loadUserProfile();
});
</script>

<style lang="scss" scoped>
/** 关闭tag标签  */
.app-container {
  /* 50px = navbar = 50px */
  height: calc(100vh - 50px);
  background: var(--el-fill-color-blank);
}

/** 开启tag标签  */
.hasTagsView {
  .app-container {
    /* 84px = navbar + tags-view = 50px + 34px */
    height: calc(100vh - 84px);
  }
}
</style>
