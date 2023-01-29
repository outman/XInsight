<template>
  <div class="p-3 bg-light">
    <div class="row gy-2 gx-3 align-items-center">
      <div class="col-auto">
        <label class="visually-hidden" for="path">path</label>
        <input
          type="text"
          class="form-control"
          id="path"
          v-model="search.uri"
          placeholder="path"
        />
      </div>
      <div class="col-auto">
        <label class="visually-hidden" for="sn">server name</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            id="sn"
            v-model="search.domain"
            placeholder="server name"
          />
        </div>
      </div>
      <div class="col-auto">
        <label class="visually-hidden" for="wallTime">Wall Time</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="search.min_cost"
            id="wallTime"
            placeholder="> min wt"
          />
        </div>
      </div>
      <div class="col-auto">
        <button type="submit" @click="onClickSearch" class="btn btn-primary">
          Search
        </button>
        <button type="submit" @click="onClickReset" class="btn btn-light" style="margin-left: 8px;">
          Reset
        </button>
      </div>
    </div>
  </div>
  <div class="p-3 bg-light mt-2">
    <table class="table table-sm table-hover table-sortable">
      <thead>
        <tr>
          <th style="width: 80px">#</th>
          <th>Path</th>
          <th style="width: 360px">SN</th>
          <th style="width: 180px">RT</th>
          <th style="width: 100px">
            <button v-if="search.sort === -1" type="button" class="btn btn-primary"
                    @click="handleSort(1)"
                    style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
              WT
              <sort-down></sort-down>
            </button>
            <button v-else-if="search.sort === 1" type="button" class="btn btn-primary"
                    @click="handleSort(-1)"
                    style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
              WT
              <sort-up></sort-up>
            </button>
            <button v-else type="button" class="btn btn-primary"
                    @click="handleSort(-1)"
                    style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
              WT
              <sort></sort>
            </button>
          </th>
          <th style="width: 100px">MU</th>
          <th style="width: 100px">CPU</th>
          <th style="width: 100px">PMU</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in result.data">
          <td>{{ (search.pagination.page - 1) * 20 + index + 1 }}</td>
          <td>
            {{
              item.url
            }}
          </td>
          <td>{{ item.server_name }}</td>
          <td>{{ transferTime(item.request_time) }}</td>
          <td>
            <router-link :to="{ name: 'flame', query: { id: item._id.$oid } }" target="_blank">{{
              transferUnit(item.wt, 1000)
            }}</router-link>
          </td>
          <td>
            <router-link :to="{ name: 'flame', query: { id: item._id.$oid } }" target="_blank">{{
              transferUnit(item.mu, 1024)
            }}</router-link>
          </td>
          <td>
            {{
                transferUnit(item.cpu, 1000)
              }}
          </td>
          <td>
            {{
              transferUnit(item.pmu, 1024)
            }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="toast-container position-fixed top-50 end-0 p-3">
      <div
        ref="liveToast"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="me-auto">Warning</strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body">Something was broken, please reload page.</div>
      </div>
    </div>
  </div>
  <div class="mt-2">
    <Pagination
      :page="search.pagination.page"
      :total="search.pagination.total"
      :next-page="search.pagination.nextPage"
      :previous-page-page="search.pagination.previousPage"
      :pages="search.pagination.pages"
      @click-current="onClickCurrent"
      @click-next="onClickNext"
      @click-previous="onClickPrevious"
    ></Pagination>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import Pagination from "@/components/Pagination.vue";
import { xhprofFetchList } from "@/api/xhprof";
import { toastShowWarning, transferUnit } from "@/api/util";
import {useLoading} from 'vue-loading-overlay'
import SortUp from "@/components/icons/IconSortUp.vue";
import SortDown from "@/components/icons/IconSortDown.vue";
import Sort from "@/components/icons/IconSort.vue";

const $loading = useLoading({
  loader: 'bars',
  color: '#712cf9',
  container: null,
  canCancel: false
})
const liveToast = ref(null);

const search = reactive({
  uri: "",
  domain: "",
  min_cost: "",
  max_cost: "",
  sort: 0,
  pagination: {
    page: 1,
    currentPage: 1,
    previousPage: 1,
    nextPage: 1,
    total: 1,
    pages: [],
  },
});

let result = reactive({
  data: []
});

const handleSort = (sort) => {
  search.sort = sort
  fetchIndex(search)
}

let formatPagination = (pagination) => {
  search.pagination.page = pagination.currentPage
  search.pagination.currentPage = pagination.currentPage
  search.pagination.previousPage = pagination.previousPage
  search.pagination.nextPage = pagination.nextPage
  search.pagination.total = pagination.total
  search.pagination.pages = pagination.pages
}

let fetchIndex = (search) => {
  let loader = $loading.show()
  xhprofFetchList({
    uri: search.uri,
    domain: search.domain,
    minCost: search.min_cost,
    maxCost: search.max_cost,
    sort: search.sort,
    page: search.pagination.page,
  }).then(
    (resp) => {
      if (resp.statusCode === 200) {
        result.data = resp.data.data;
        formatPagination(resp.data.pagination)
        return;
      }
      toastShowWarning(liveToast.value);
      console.log(resp);
    },
    (error) => {
      toastShowWarning(liveToast.value);
      console.log(error);
    }
  ).finally(() => {
      loader.hide()
  })
};

const onClickReset = () => {
  search.uri = ''
  search.domain = ''
  search.min_cost = ''
  search.max_cost = ''
  search.sort = 0
  search.pagination.page = 1
  search.pagination.currentPage = 1
  search.pagination.previousPage = 1
  search.pagination.nextPage = 1
  search.pagination.total = 1
  search.pagination.pages = []
  fetchIndex(search)
}

onMounted(() => {
  fetchIndex(search);
});

let onClickCurrent = (page) => {
  search.pagination.page = page;
  fetchIndex(search);
};

let onClickNext = () => {
  let next = search.pagination.page + 1;
  if (next > search.pagination.total) {
    search.pagination.page = search.pagination.total;
  } else {
    search.pagination.page = next;
  }
  fetchIndex(search);
};

let onClickPrevious = () => {
  let previous = search.pagination.page - 1;
  if (previous < 1) {
    search.pagination.page = 1;
  } else {
    search.pagination.page = previous;
  }
  fetchIndex(search);
};

let onClickSearch = () => {
  fetchIndex(search)
};

// timestamp to date
let transferTime = (time) => {
  let date = new Date(time * 1000);
  return `${date.toLocaleString()}`;
};
</script>
