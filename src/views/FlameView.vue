<template>
<div class="container-fluid mt-3 main-chart gy-2" ref="main" v-cloak>
  <div>
    <h1>Wall Time</h1>
  </div>
  <div ref="chart" class="chart-area"></div>
  <div><h1>Memory Used</h1></div>
  <div ref="memory" class="chart-area"></div>
</div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {flamegraph} from "d3-flame-graph";
import {transferUnit} from '@/api/util'
import * as d3 from "d3";
import {xhprofFetchItem} from "@/api/xhprof";

// box
const main = ref(null)

// chart placeholder
const chart = ref(null)
const memory = ref(null)

const route = useRoute()

let wallTime = reactive({})
let memoryUsed = reactive({})


const labelWallTime = (d) => {
  return d.data.name + ' -> ' + transferUnit(d.data.value, 1000)
}
const labelMemoryUsed = (d) => {
  return d.data.name + ' -> ' + transferUnit(d.data.value, 1024)
}
const renderFlame = (selector, data, labelFunc) => {
  let flameWith = main.value.clientWidth - 40
  let flame = flamegraph()
  flame.width(flameWith)
      .cellHeight(24)
      .transitionDuration(10)
      .inverted(true)
      .label(labelFunc)
      .getName(labelFunc)
      .onHover(labelFunc)
      .onClick()

  d3.select(selector.value)
      .datum(data)
      .call(flame)
}
const fetchItem = (id) => {
  xhprofFetchItem({id:id})
      .then(response => {
        wallTime = response.data.profile.wt
        memoryUsed = response.data.profile.mu
      })
      .then(() => {
        renderFlame(chart, wallTime, labelWallTime)
        renderFlame(memory, memoryUsed, labelMemoryUsed)
      })
}

onMounted(() => {
  fetchItem(route.query.id)
})

</script>

<style scoped>
.main-chart {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.chart-area {
  border-left: 1px solid #712cf9;
}
</style>

<style>
g.fade {
  opacity: 0.5 !important;
}
</style>
