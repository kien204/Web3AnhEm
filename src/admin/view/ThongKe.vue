<script setup>
import { ref } from "vue";

const listType = ref(["siêu nhân", "Cổ tích", "biến hình"])

const readData = ref({
  labels: ["01/03", "02/03", "03/03", "04/03", "05/03"],
  datasets: [
    {
      label: "Lượt đọc",
      data: [320, 450, 370, 500, 620],
      fill: false,
      borderColor: "#42A5F5",
      tension: 0.4,
    },
  ],
});

const popularStories = ref({
  labels: listType,
  datasets: [
    {
      label: "Lượt đọc",
      data: [5200, 4300, 3900, 3100, 2700],
      backgroundColor: "#FFA726",
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
</script>

<template>
  <div class="p-5">
    <h2 class="text-lg font-bold">Tổng số truyện theo từng thể loại</h2>
    <Chart type="bar" :data="popularStories" :options="chartOptions" class="w-full h-64" />

    <h2 class="text-lg font-bold mt-5">Số lượt đọc theo ngày</h2>
    <Chart type="line" :data="readData" :options="chartOptions" class="w-full h-64" />

    <h2 class="text-lg font-bold mt-5">Truyện phổ biến nhất</h2>
    <Chart type="bar" :data="popularStories" :options="chartOptions" class="w-full h-64" />
  </div>
</template>
