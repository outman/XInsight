<template>
  <nav aria-label="Pagination">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: disabledPrevious }">
        <span class="page-link" @click="emit('clickPrevious')" aria-label="Previous" >
          <span aria-hidden="true">&laquo;</span>
        </span>
      </li>
      <li class="page-item" v-for="p in pages">
        <span v-if="p !== '...'" class="page-link" @click="emit('clickCurrent', p)" :class="{ active: p == props.page }" >{{p}}</span>
        <span v-else class="page-link" disabled>{{p}}</span>
      </li>
      <li class="page-item" :class="{ disabled: disabledNext }">
        <span class="page-link" @click="emit('clickNext')" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  page: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  nextPage: {
    type: Number,
    required: true
  },
  previousPage: {
    type: Number,
    required: true
  },
  pages: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['clickPrevious', 'clickNext', 'clickCurrent'])

const disabledPrevious = computed({
  get() {
    if (props.page <= 1) {
      return true
    }
    return false
  }
})

const disabledNext = computed({
  get() {
    if (props.page >= props.total) {
      return true
    }
    return false
  }
})
</script>

<style scoped>
span.page-link:hover {
  cursor: pointer;
}
</style>
