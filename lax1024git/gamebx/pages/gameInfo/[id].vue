<template>
  <div>
    <div :data-isLoad="isShowLoad ? 't' : 'f'"
      class="w-full data-[isLoad=t]:bg-#002607 data-[isLoad=f]:bg-transparent pointer-events-none">
      <van-icon class="pointer-events-auto z-999 p-6px rounded-full bg-gradient-to-r bg-#00000066" name="wap-home"
        size="25" @click="backIndex" />
    </div>
    <iframe :src="url" v-if="url" frameborder="0" class="iframe" @load="isLoad()"></iframe>
    <iframe :srcdoc="srcDoc" v-else frameborder="0" class="iframe" @load="isLoad()"></iframe>

    <!-- <van-overlay :show="isShowLoad" class="center">
      <van-loading vertical>
        <template #icon>
          <van-icon name="star-o" size="30" />
        </template>
{{ $t("游戏跳转中，请稍后...") }}
</van-loading>
</van-overlay> -->

    <van-dialog v-model:show="backDialog" :title="$t('确认回到首页')" theme="round-button" show-cancel-button
      :confirm-button-text="$t('确认')" :cancel-button-text="$t('取消')" @confirm="confirmBack">
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { game_login_game_api } from "~/api";
const $router = useRouter();
const $route = useRoute();
const url: Ref<string | null> = ref(null);
const srcDoc: Ref<string> = ref("");
const { $t } = useNuxtApp();

const getUrl = async () => {
  const res = await game_login_game_api({
    gid: $route.params.id as string,
    platform: "1",
  });
  if (res?.code == 1) {
    if (res.data.startsWith("http")) {
      url.value = res.data;
    } else {
      srcDoc.value = res.data;
    }
  }
};
if (process.server) {
  await getUrl();
}
onActivated(() => {
  if (process.client) {
    getUrl();
  }
})

const isShowLoad: Ref<boolean> = ref(true)
const loadCount: Ref<number> = ref(0)
function isLoad() {
  loadCount.value++
  if (loadCount.value === 2) {
    isShowLoad.value = false
  }
}

// 回到首页
const backDialog: Ref<boolean> = ref(false)
function backIndex() {
  backDialog.value = true
}
function confirmBack() {
  $router.push("/")
}
</script>

<style scoped lang="less">
.iframe {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>