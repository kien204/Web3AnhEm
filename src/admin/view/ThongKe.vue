<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import Chart from 'primevue/chart';
import { computed } from 'vue';

const toast = useToast();
const url = 'http://10.10.33.29:5041/api';
const listTotalType = ref([]);
const listTopView = ref([]);
const listToptypeView = ref([]);

onMounted(() => getAll());

// API Calls
const getAll = async () => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const [totalType, topView, topTypeView] = await Promise.all([
            axios.get(`${url}/ServiceStoty/get-statistic/total-type`, config),
            axios.get(`${url}/ServiceStoty/get-statistic/top-view`, config),
            axios.get(`${url}/ServiceStoty/get-statistic/top-type-view`, config)
        ]);

        listTotalType.value = totalType.data.data;
        listTopView.value = topView.data.data;
        listToptypeView.value = topTypeView.data.data;
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lấy dữ liệu', life: 3000 });
    }
};

const data1 = computed(() => ({
    labels: listTotalType.value.map((item) => item.genre),
    datasets: [
        {
            label: 'Số lượng',
            data: listTotalType.value.map((item) => item.storyCount),
            backgroundColor: '#42A5F5'
        },
        {
            label: 'Lượt đọc',
            data: listToptypeView.value.map((item) => item.totalViews),
            backgroundColor: '#EF5350'
        }
    ]
}));

const data2 = computed(() => ({
    labels: listTopView.value.map((item) => item.storyName),
    datasets: [
        {
            label: 'Lượt đọc',
            data: listTopView.value.map((item) => item.totalViews),
            backgroundColor: '#EF5350'
        }
    ]
}));


const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false
});
</script>

<template>
    <div class="p-5">
        <h2 class="text-lg font-bold">Tổng số truyện theo từng thể loại</h2>
        <Chart type="bar" :data="data1" :options="chartOptions" class="w-full h-64" />

        <h2 class="text-lg font-bold mt-5">Truyện phổ biến nhất</h2>
        <Chart type="bar" :data="data2" :options="chartOptions" class="w-full h-64" />
    </div>
</template>
