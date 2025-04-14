<script setup>
import axios from 'axios';
import { ref } from 'vue';

const token = JSON.parse(localStorage.getItem('token'));
const url = 'http://10.10.33.29:5041/api';

const expandedRows = ref([]);
const cmtList = ref([
    {
        commentID: 1,
        detailID: 16,
        commentText: 'truyen hay',
        ratting: 5,
        createdAt: '2025-03-24T15:28:06.484658',
        detailStory: null
    },
    {
        commentID: 2,
        detailID: 16,
        commentText: 'truyen hay',
        ratting: 5,
        createdAt: '2025-03-24T15:28:07.6026564',
        detailStory: null
    }
]);
const storyList = ref([
    {
        id: 1,
        storyCode: 'ST001',
        storyName: 'Truyện 1',
        storyAuthor: 'Tác giả 1',
        rating: 5
    },
    {
        id: 2,
        storyCode: 'ST002',
        storyName: 'Truyện 2',
        storyAuthor: 'Tác giả 2',
        rating: 4
    },
    {
        id: 3,
        storyCode: 'ST003',
        storyName: 'Truyện 3',
        storyAuthor: 'Tác giả 3',
        rating: 3
    },
    {
        id: 4,
        storyCode: 'ST004',
        storyName: 'Truyện 4',
        storyAuthor: 'Tác giả 4',
        rating: 2
    },
    {
        id: 5,
        storyCode: 'ST005',
        storyName: 'Truyện 5',
        storyAuthor: 'Tác giả 5',
        rating: 1
    }
]);
const rating = ref(0);

// Filters
const filtersStory = ref({
    global: { value: null, matchMode: 'contains' },
    storyName: { value: null, matchMode: 'startsWith' },
    storyCode: { value: null, matchMode: 'equals' }
});
const filterschapterter = ref({
    global: { value: null, matchMode: 'contains' },
    chapterterName: { value: null, matchMode: 'startsWith' },
    chapterterCode: { value: null, matchMode: 'equals' }
});

// onMounted(() => getAllStory());

// API Calls
const getAllStory = async () => {
    try {
        const [stories, comments] = await Promise.all([axios.get(`${url}/Story/getAll`), axios.get(`${url}/Comment/get-all-comment`)]);
        storyList.value = stories.data.data;
        cmtList.value = comments.data.data;

        console.log(cmtList.value);
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lấy dữ liệu', life: 3000 });
    }
};

const calculateRating = (id) => {
    const comments = cmtList.value.filter((cmt) => cmt.storyID === id);
    const totalRating = comments.reduce((acc, cmt) => acc + cmt.rating, 0);
    return totalRating / comments.length;
};
const getchaptertersForStory = (id) => cmtList.value.filter((cmt) => cmt.detailID === id);
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="Thêm truyện mới" icon="pi pi-plus" severity="success" class="mr-2" @click="dialogAddStory = true" />
                    <Button icon="pi pi-refresh" v-tooltip.top="'Làm mới'" rounded raised @click="getAllStory" />
                </template>
            </Toolbar>

            <DataTable
                :value="storyList"
                dataKey="storyCode"
                :paginator="true"
                :globalFilterFields="['storyName', 'storyCode']"
                :filters="filtersStory"
                :rows="10"
                v-model:expandedRows="expandedRows"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Hiển thị từ {first} đến {last} trong {totalRecords} câu truyện"
            >
                <template #header>
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filtersStory.global.value" placeholder="Nhập mã hoặc tên truyện" />
                    </IconField>
                </template>
                <Column expander style="width: 2rem" />
                <Column field="storyCode" header="Mã Truyện" />
                <Column field="storyName" header="Tên Truyện" />
                <Column field="storyAuthor" header="Tác Giả" />
                <Column field="rating" header="Reviews">
                    <template #body="slotProps">
                        <Rating :modelValue="calculateRating(slotProps.data.id)" readonly />
                    </template>
                </Column>

                <!-- template hiển thị các chương khi expandable -->
                <template #expansion="slotProps">
                    <div class="p-3">
                        <h5>Danh sách chương - {{ slotProps.data.storyName }}</h5>
                        <DataTable :value="getchaptertersForStory(slotProps.data.id)" responsiveLayout="scroll" :globalFilterFields="['sttName', 'detailID']" :filters="filterschapterter">
                            <template #header>
                                <IconField iconPosition="left">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filterschapterter.global.value" placeholder="Nhập mã hoặc tên chương" />
                                    <Button label="Thêm chương mới" icon="pi pi-plus" severity="success" class="ml-2" @click="codeChapterData(slotProps.data.id)" />
                                </IconField>
                            </template>

                            <Column :exportable="false" style="min-width: 8rem">
                                <template #body="slotProps">
                                    <Button icon="pi pi-eye" v-tooltip.top="'Xem trước'" outlined rounded class="mr-2" @click="goToStory(slotProps.data.detailID)" />
                                    <Button icon="pi pi-pencil" v-tooltip.top="'Sửa chương'" outlined rounded class="mr-2" @click="editChapterData(slotProps.data)" />
                                    <Button icon="pi pi-trash" v-tooltip.top="'Xóa chương'" outlined rounded severity="danger" @click="deleteChapterData(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>