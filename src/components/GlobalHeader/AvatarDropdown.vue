<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar icon="user" size="large" class="antd-pro-global-header-index-avatar"/>
      <span>{{ currentUser.name }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
<!--        <a-menu-item v-if="menu" key="center" @click="handleToCenter">-->
<!--          <a-icon type="user"/>-->
<!--          {{ $t('menu.account.center') }}-->
<!--        </a-menu-item>-->
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <a-icon type="setting"/>
          密码设置
        </a-menu-item>
        <a-menu-divider v-if="menu"/>
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout"/>
          {{ $t('menu.account.logout') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }"/>
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import DeviceEdit from '@/views/demo/components/DeviceEdit'
import ChangePassword from '@/components/ChangePassword/ChangePassword'
import { MODAL_SIZE } from '@/config/uiConfig'

export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleToCenter() {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings() {
      this.$dialog(
        ChangePassword,
        {
          userInfo: this.$store.getters.userInfo,
          on: {
            ok: () => {
              this.$notification.success({
                message: '成功',
                description: '保存成功'
              })
              this.$refs.table.refresh(true);
            },
            cancel () {},
            close () {}
          }
        },
        {
          title: '密码设置',
          width: MODAL_SIZE.MIDDLE,
          centered: true,
          maskClosable: false
        }
      );
    },
    handleLogout(e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        },
        onCancel() {
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }

  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
