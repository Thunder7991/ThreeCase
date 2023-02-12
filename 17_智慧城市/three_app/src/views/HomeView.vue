<template>
  <div>
    <three-scene :event-list="eventList"></three-scene>
    <big-screen :data-Info="dataInfo" :event-list="eventList"></big-screen>
  </div>
</template>

<script setup>
import ThreeScene from '@/components/ThreeScene.vue'
import BigScreen from '@/components/BigScreen.vue'
import { onMounted, reactive, ref } from 'vue'
import { getSmartCityInfo, getSmartCityList } from '@/api/api'
import gsap from 'gsap'
const dataInfo = reactive({
  iot: { number: 0 },
  event: { number: 0 },
  power: { number: 0 },
  test: { number: 0 }
})

onMounted(() => {
  changeInfo()
  getEventList()
  setInterval(() => {
    changeInfo()
    getEventList()
  }, 8000)
})

const changeInfo = async () => {
  const res = await getSmartCityInfo()
  const data = res.data.data
  for (const key in dataInfo) {
    if (Object.hasOwnProperty.call(dataInfo, key)) {
      const element = dataInfo[key]
      element.name = data[key].name
      element.unit = data[key].unit
      gsap.to(element, {
        number: data[key].number,
        duration: 1
      })
    }
  }
}
const eventList = ref([])
const getEventList = async () => {
  const res = await getSmartCityList()
  const data = res.data.list
  eventList.value = data
}
</script>

<style lang="scss" scoped></style>
