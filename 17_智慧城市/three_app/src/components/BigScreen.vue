<template>
  <div id="big-screen">
    <div class="header">定兴县智慧城市管理平台</div>
    <div class="main">
      <div class="left">
        <div class="city-event" v-for="item in props.dataInfo" :key="item">
          <h3>
            <span>{{ item.name }}</span>
          </h3>
          <h1>
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>{{ toFixInt(item.number) }} ({{ item.unit }}) </span>
          </h1>
          <div class="footer-border"></div>
        </div>
      </div>
      <div class="right">
        <div class="city-event list">
          <h3>事件列表</h3>
          <ul>
            <li
              v-for="(item, i) in props.eventList"
              :key="item"
              :class="{ active: currentActive == i }"
              @click="toggleEvent(i)"
            >
              <h1>
                <div>
                  <img :src="imgs[item.name]" alt="" class="icon" />

                  <span>{{ item.name }}</span>
                </div>
                <span class="time">{{ item.time }}</span>
              </h1>
              <p>{{ item.type }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import eventBus from '@/utils/eventBus'
import { defineProps, ref } from 'vue'
const props = defineProps(['dataInfo', 'eventList'])
const imgs = {
  电力: require('@/assets/bg/dianli.svg'),
  火警: require('@/assets/bg/fire.svg'),
  治安: require('@/assets/bg/jingcha.svg')
}

const toFixInt = (num) => {
  return num.toFixed(0)
}
const currentActive = ref(null)
eventBus.on('spriteClick', (data) => {
  console.log(54, data)
  currentActive.value = data.index
})
const toggleEvent = (i) => {
  currentActive.value = i
  eventBus.emit('eventToggle', i)
}
</script>

<style lang="scss" scoped>
#big-screen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;

  left: 0;
  top: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.header {
  /* width: 1920px;
        height: 100px; */

  width: 19.2rem;
  height: 1rem;
  background-image: url("@/assets/bg/title.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  color: rgb(226, 226, 255);
  font-size: 0.4rem;
}

.main {
  flex: 1;
  width: 19.2rem;
  display: flex;
  justify-content: space-between;
}

.left {
  width: 4rem;
  /* background-color: rgb(255,255,255,0.5); */
  background-image: url("@/assets/bg/line_img.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0;
}

.right {
  width: 4rem;
  /* background-color: rgb(255,255,255,0.5); */
  background-image: url("@/assets/bg/line_img.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0;
}

.city-event {
  position: relative;
  width: 3.5rem;
  /* height: 3rem; */
  margin-bottom: 0.5rem;
  background-image: url("@/assets/bg/bg_img03.png");
  background-repeat: repeat;
}

.city-event::before {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.city-event::after {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  right: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}
.footer-border {
  position: absolute;
  bottom: 0;
  bottom: 0;
  width: 3.5rem;
  height: 0.4rem;
}
.footer-border::before {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0;
  top: 0;
  border-bottom: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.footer-border::after {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  right: 0;
  top: 0;
  border-bottom: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.icon {
  width: 40px;
  height: 40px;
}

h1 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 0.3rem 0.3rem;
  justify-content: space-between;
  font-size: 0.3rem;
}
h3 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0.3rem 0.3rem;
}

h1 > div {
  display: flex;
  align-items: center;
}
h1 span.time {
  font-size: 0.2rem;
  font-weight: normal;
}

.city-event li > p {
  color: #eee;
  padding: 0rem 0.3rem 0.3rem;
}
.list h1 {
  padding: 0.1rem 0.3rem;
}
.city-event.list ul {
  pointer-events: auto;
  cursor: pointer;
}

.city-event li.active h1 {
  color: red;
}
.city-event li.active p {
  color: red;
}

ul,
li {
  list-style: none;
}
</style>
