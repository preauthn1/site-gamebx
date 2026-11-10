<template>
  <div class="header-wapper">
    <div class="container header-content">
      <FSvg name="menu" class="menu-icon" @click="showMenu" />
      <img :src="system?.site?.website_mobile_logo" class="logo">
      <template v-if="loginStatus">
        <img src="@/assets/images/user.png" class="user-icon">

        <span class="price flex">
          {{ system?.data.monetary_type }}
          <van-loading v-if="isLoad" color="#0cb646" size="20" />
          <p v-else>{{ $numInit(userInfo?.balance) }}</p>
        </span>
        <van-button round size="small" class="btn" @click="$router.push('/selectionOfRechargeChannels')">{{ $t("充值")
          }}</van-button>
      </template>
      <template v-else>
        <van-button round size="small" class="btn btn-reg" @click="$router.push('/register')">{{ $t("注册")
          }}</van-button>
        <van-button round size="small" class="btn" @click="$router.push('/login')">{{ $t("登录") }}</van-button>
      </template>
    </div>
  </div>
  <Menu ref="menuRef" />
</template>

<script setup>
import { toRef } from "vue"

const loginStatus = useLoginStatus();
const userInfo = useUserInfo();
const system = useSystem();
const menuRef = ref();
const showMenu = () => {
  menuRef.value.show();
};

const props = defineProps({ loadBalance: { type: Boolean, default: true } })
const isLoad = toRef(props, "loadBalance");
</script>

<style scoped lang="less" src="@/assets/css/header.less"></style>