<template>
  <div class="page tabbar-page">
    <Header :loadBalance="loadBalance" />
    <div class="container">
      <!-- banner -->
      <van-swipe ref="bannerSwiper" class="my-swipe" :autoplay="3000" v-if="bannerList?.mobile.length">
        <van-swipe-item v-for="item, index in bannerList?.mobile" :key="index">
          <FImg :src="item.img" class="banner" fit="cover" @click="jumpTo(item)" />
        </van-swipe-item>
        <template #indicator="{ active, total }">
          <div class="absolute inset-x-0 bottom-5px center space-x-6px">
            <div v-for="(el, idx) in total" :key=idx :data-active="active === idx ? 't' : 'f'"
              class="size-10px cursor-pointer drop-shadow-2xl data-[active=t]:bg-green-6 rounded-full bg-white"
              @click="clickSwipe(idx)">
            </div>
          </div>
        </template>
      </van-swipe>
      <!-- 图片公告 -->
      <div v-if="false" class="mt-10px h-120px center justify-between gap-2% overflow-x-scroll ">
        <div v-for="(el, idx) in noticePicList" :key="idx"
          class="overflow-hidden center rounded bg-amber w-49% h-full flex-none"
          @click="el.jump_url ? $router.push(el.jump_url) : ''">
          <van-image :src="el.photo" :data-odd="idx % 2 ? 't' : 'f'" class="size-full data-[odd=t]:bg-yellow center">
          </van-image>
        </div>
      </div>
      <!-- 公告 -->
      <van-notice-bar color="var(--text-color5)" background="transparent" class="notice" v-if="noticeList?.length">
        <template #left-icon>
          <img src="@/assets/images/notice-icon.png" class="notice-icon">
        </template>
        <div class="bar-wapper">
          <div class="bat-item" v-for="item in noticeList" :key="item.id">{{ item.content }}</div>
        </div>

      </van-notice-bar>
      <div v-else style="height: 16px;"></div>

      <!-- 搜索 -->
      <van-search :placeholder="$t('请输入搜索关键词')" readonly @click="$router.push('/searchGame')" />

      <!-- topList -->
      <TopListSwipe :dataList="fakeDataList"></TopListSwipe>

      <!-- 游戏 -->
      <van-tabs class="van-tab-btn" scrollspy swipe-threshold :before-change="changeTabs">
        <van-tab v-for="item, index in typeList" :key="index">
          <!-- 游戏分类 -->
          <template #title>
            <img :src="item.icon" class="tab-icon">
            <img src="@/assets/images/hot-icon.png" class="hot-icon" v-if="index == 0">
            <span>{{ $t(item.name) }}</span>
          </template>
          <!-- 游戏列表 -->
          <template #default>
            <HomeCard class="mt-2" :title="gameList[index].name" subtitle="游戏" :num="gameList[index].total"
              @next="next(gameSwiper?.[index])" @pre="pre(gameSwiper?.[index])" :iconSrc="gameList[index].icon"
              @tabAll="$router.push(`/gameList/${gameList[index].type}/0/0`)">
              <div :ref="el => gameListRefs[index] = el">
                <van-swipe class="game-swipe" :show-indicators="false" ref="gameSwiper">
                  <van-swipe-item v-for="list, idx in initGameList(gameList[index].game)" :key="idx">
                    <GameList :list="list" class="game-list" />
                  </van-swipe-item>
                </van-swipe>
              </div>
            </HomeCard>
          </template>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 三方厂商 -->
    <HomeCard @next="swiperNext" title="游戏提供商" @pre="swiperPre" :iconSrc="$require('make-icon.png')">
      <swiper-container ref="makeSwiper" :speed="300" :loop="false" class="make-swiper" slidesPerView="auto"
        spaceBetween="8" v-if="thirdList">
        <swiper-slide class="make-slide" v-for="(item, index) in thirdList" :key="index"
          @click="$router.push(`/gameList/0/${item.tc_id}/0?third_name=${item.tc_name}`)">
          <img :src="item.icon" class="make-item">
        </swiper-slide>
      </swiper-container>
    </HomeCard>

    <ServiceFloatBox />

    <Footer />
    <noticePop />
    <!-- 安装弹窗提示 -->
    <DownTip />
  </div>
</template>

<script setup lang="ts">
import type {
  Mobile,
  BannerIndexApiType,
  GameIndex2ApiType,
  noticeListApiType,
  gameThirdApiType,
  gameGet_typeApiType,
  GameType,
  swiperRefType,
  fakeDataListApiType
} from "~/types";
import type { SwipeInstance } from "vant";
import {
  bannerIndexApi,
  noticeListApi,
  gameThirdApi,
  gameGet_typeApi_v2,
  getWsToken,
  fakeDataListApi
} from "@/api";


const loginStatus = useLoginStatus();

import { game_user_transout_api } from "@/api/cybSports";

const $router = useRouter();
const userInfo = useUserInfo();
const loadBalance: Ref<boolean> = ref(true)
const nowPagePath = ref("/")


const onRouteChange = (to: any, from: any) => {
  console.log("Route is changing from:", from.fullPath, "to:", to.fullPath);
  nowPagePath.value = to.fullPath
  // 你可以在这里根据路由变化执行特定逻辑
};
$router.beforeEach(onRouteChange);

const thirdBalance = computed(() => {
  return userInfo.value && loginStatus && nowPagePath.value == "/" ? userInfo.value?.third_balance > 0 : false;
})


watch(
  thirdBalance,
  async (v) => {
    if (v) {
      loadBalance.value = true
      const res: any = await game_user_transout_api(0)
      if (res?.code == 1 && res?.balance != 0) {
        userInfo.value!.balance = res?.balance
      }
      loadBalance.value = false
    }
  },
  { immediate: true }
);

const initSocket = async () => {
  const response = await getWsToken()
  if (response?.code == 1) {
    const socketInfo = useSocketInfo()
    socketInfo.value = response.data
    const url = response.data.WebSocket;
    if (url != "") {
      useWebSocket.initWebSocket(0, url)
    }
  }
}

watch(
  loginStatus,
  async (v) => {
    if (v) {
      await initSocket()
    }
  },
  { immediate: true }
)


const changeTabs = (v: number) => {
  setTimeout(() => {
    scrollTo(v)

  }, 500)
  // $router.push({
  //   path: `/gameList/${typeList.value?.[v].id}/0/0`,
  // });
  return true;
};
const scrollTo = (key: number) => {
  gameListRefs.value[key].scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  setTimeout(() => {
    window.scrollBy({
      top: -140,
      left: 0,
      behavior: "smooth",
    })
  }, 0)
}

// 获取轮播图
const bannerList: Ref<BannerIndexApiType | null> = ref(null);
const getBanner = async () => {
  const res = await bannerIndexApi();
  if (res?.code == 1) {
    bannerList.value = res.data;
  }
};
const bannerSwiper: Ref<SwipeInstance | null> = ref(null)
const clickSwipe = (idx: number) => {
  bannerSwiper.value.swipeTo(idx)
}
const jumpTo = (el: Mobile) => {
  if (el.jump_url) {
    if (el.jump_url.startsWith("http")) {
      window.open(el.jump_url);
    } else {
      $router.push(el.jump_url)
    }
  }
}

// 获取跑马灯
const noticeList: Ref<noticeListApiType | null> = ref(null);
const getNoticeList = async () => {
  const res = await noticeListApi({ type: 1, show_loca: 1 });
  if (res?.code == 1) {
    noticeList.value = res.data;
  }
};
// 获取公告图
const noticePicList: Ref<noticeListApiType | null> = ref(null);
const getNoticePicList = async () => {
  const res = await noticeListApi({ type: 2, show_loca: 1 });
  if (res?.code == 1) {
    noticePicList.value = res.data;
  }
};

// 获取fakeDataList
const fakeDataList: Ref<fakeDataListApiType | null> = ref(null);
const getFakeDataList = async () => {
  const res = await fakeDataListApi();
  if (res?.code == 1) {
    fakeDataList.value = res.data;
  }
};

// 获取游戏
const gameList: Ref<GameIndex2ApiType | null> = ref(null);



// 格式化游戏
const initGameList = (list: GameType[], size: number = 6) => {
  const result: GameType[][] = [];
  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size));
  }
  return result;
};

// 获取三方
const thirdList: Ref<gameThirdApiType | null> = ref(null);
const getThirdList = async () => {
  const res = await gameThirdApi();
  if (res?.code == 1) {
    thirdList.value = res.data;
  }
};


const gameListRefs: any = ref([]);
// 获取游戏分类
const typeList: Ref<gameGet_typeApiType | null> = ref(null);
const getTypeList = async () => {
  const res = await gameGet_typeApi_v2({ nlimit: 999 });
  if (res?.code == 1) {
    typeList.value = res.data;
    gameList.value = res.data
    let cacheList: any = []
    if (res.data.length != 0) {
      res.data.forEach((item, index) => cacheList.push(`type_list_${index}`))
      gameListRefs.value = cacheList
    }
  }
};




// 操作swiper
const makeSwiper: Ref<swiperRefType | null> = ref(null);
const swiperNext = () => {
  makeSwiper.value && makeSwiper.value.swiper.slideNext();
};
const swiperPre = () => {
  makeSwiper.value && makeSwiper.value.swiper.slidePrev();
};
const gameSwiper: Ref<SwipeInstance[] | null> = ref(null);
const next = (swiper: SwipeInstance | undefined) => {
  swiper && swiper.next();
};
const pre = (swiper: SwipeInstance | undefined) => {
  swiper && swiper.prev();
};

await Promise.all([
  getNoticeList(),
  getNoticePicList(),
  getBanner(),
  getThirdList(),
  getTypeList(),
  getFakeDataList()
]).then(() => {
  loadBalance.value = false;
});
</script>
<style scoped lang="less" src="@/assets/css/index.less"></style>
