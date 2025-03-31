<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const token = JSON.parse(localStorage.getItem('token'));
const url = 'http://10.15.105.114:5041/api';

const expandedRows = ref([]);
const cmtList = ref([]);
const storyList = ref([]);
const ratting = ref(0);
const toast = useToast();


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

onMounted(() => getAllStory());

// API Calls
const getAllStory = async () => {
    try {
        const [stories, comments] = await Promise.all([axios.get(`${url}/Story/getAll`), axios.get(`${url}/Comment/get-all-comment`)]);
        storyList.value = stories.data.data;
        cmtList.value = comments.data.data;

    } catch (e) {
        console.error(e);
        toast.add({severity: 'error',summary: 'Lỗi',detail: 'Không thể lấy dữ liệu',life: 3000});
    }
};

const calculateRating = (id) => {
    return id;
};
const getchaptertersForStory = (id) => cmtList.value.filter((cmt) => cmt.detailID === id);

const formatDate = (date) => {
  if (!date) return "N/A"; // Kiểm tra nếu giá trị rỗng
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

const showDialog = ref(false);
const showDialogEdit = ref(false);
const showDialogDelete = ref(false);
const payload = ref({
    id: null,
  ratting: null,
  comment: "",
});


const saveComment = async () => {
    payload.value.ratting < 1 ? (payload.value.ratting = 1) : '';
    if (!payload.value.comment.trim() || !payload.value.id) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không để chống ô comment', life: 2000 });
        return;
    }
    try {        
        let res = await axios.post(`${url}/Comment/insert-comment`, payload.value);        
        if (res) {
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đã thêm bình luận', life: 2000 });
        }
        getAllStory();
        resetpayload();
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: e.Message, life: 2000 });
        console.error('Lỗi khi lưu bình luận:', e);
    }
  showDialog.value = false; // Đóng Dialog sau khi gửi
};

const editComment = async (data) => {
    payload.value.id = data.commentID;
    payload.value.ratting = data.ratting;
    payload.value.comment = data.commentText;
    
    showDialogEdit.value = true;
};

const edittComment = async () => {
    payload.value.ratting < 1 ? (payload.value.ratting = 1) : '';
    if (!payload.value.comment.trim() || !payload.value.id) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không để chống ô comment', life: 2000 });
        return;
    }
    try {        
        let res = await axios.put(`${url}/Comment/update-comment`, payload.value, {
            headers: { Authorization: `Bearer ${token}` }
        });        
        if (res) {
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đã sửa bình luận', life: 2000 });
        }
        console.log(payload.value);
        getAllStory();
        resetpayload();
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: e.Message, life: 2000 });
        console.error('Lỗi khi lưu bình luận:', e);
    }
  showDialogEdit.value = false; // Đóng Dialog sau khi gửi
};

const deleteComment = async (data) => {
    payload.value.id = data.commentID;
    payload.value.ratting = data.ratting;
    payload.value.comment = data.commentText;
    showDialogDelete.value = true;
};
const deleteeComment = async () => {
    try {
        let res = await axios.delete(`${url}/Comment/delete-comment/${payload.value.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res) {
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa bình luận', life: 2000 });
        }
        getAllStory();
        resetpayload();
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: e.Message, life: 2000 });
        console.error('Lỗi khi xóa bình luận:', e);
    }
    showDialogDelete.value = false;
};

const resetpayload = () => {
    payload.value = {
        id: null,
        ratting: null,
        comment: "",
    };
};
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="Thêm bình luận mới" icon="pi pi-plus" severity="success" class="mr-2" @click="showDialog = true" />
                    <Button icon="pi pi-refresh" v-tooltip.top="'Làm mới'" rounded raised @click="getAllStory" />
                </template>
            </Toolbar>

            <DataTable
                :value="cmtList"
                dataKey="commentID"
                :paginator="true"
                :globalFilterFields="['commentText', 'ratting' ]"
                :filters="filtersStory"
                :rows="10"
                v-model:expandedRows="expandedRows"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Hiển thị từ {first} đến {last} trong {totalRecords} binhf luaanj"          >
                <template #header>
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filtersStory.global.value" placeholder="Nhập bình luận hoặc đánh giá" />
                    </IconField>
                </template>
                <Column field="commentID" header="Tác giả"><template #body="slotProps">Ẩn Danh {{slotProps.data.commentID}}</template></Column>
                <Column field="detailID" header="Mã chương" />
                <Column field="commentText" header="Bình luận" />
                <Column field="ratting" header="Đánh giá">
                    <template #body="slotProps">
                        <Rating :modelValue="calculateRating(slotProps.data.ratting)" readonly />
                    </template>
                </Column>
                <Column field="createdAt" header="Ngày bình luận">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.createdAt) }}
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" v-tooltip.top="'Sửa chương'" outlined rounded class="mr-2" @click="editComment(slotProps.data)" />
                        <Button icon="pi pi-trash" v-tooltip.top="'Xóa chương'" outlined rounded severity="danger" @click="deleteComment(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

    <!-- Dialog nhập bình luận -->
    <Dialog v-model:visible="showDialog" header="Thêm bình luận" :modal="true" :closable="true">
      <div class="flex flex-col gap-6 w-[300px]">
        <Rating v-model="payload.ratting"/>
        <InputText type="text" v-model="payload.id" class="flex-1" placeholder="Nhập mã chương" />
        <InputText type="text" v-model="payload.comment" class="flex-1" placeholder="Nhập bình luận" />
      </div>

      <!-- Footer của Dialog -->
      <template #footer>
        <Button label="Hủy" icon="pi pi-times" severity="secondary" @click="showDialog = false" />
        <Button label="Gửi" icon="pi pi-check" severity="info" @click="saveComment" />
      </template>
    </Dialog>
    
    <!-- Dialog suawr bình luận -->
    <Dialog v-model:visible="showDialogEdit" header="Sửa bình luận" :modal="true" :closable="true">
      <div class="flex flex-col gap-6 w-[300px]">
        <Rating v-model="payload.ratting"/>
        <InputText type="text" v-model="payload.id" class="flex-1" :placeholder="payload.id" />
        <InputText type="text" v-model="payload.comment" class="flex-1" :placeholder="payload.comment" />
      </div>

      <!-- Footer của Dialog -->
      <template #footer>
        <Button label="Hủy" icon="pi pi-times" severity="secondary" @click="showDialogEdit = false" />
        <Button label="Gửi" icon="pi pi-check" severity="info" @click="edittComment" />
      </template>
    </Dialog>

    <!-- dialog xác nhận xóa binh luan -->
    <Dialog v-model:visible="showDialogDelete" :style="{ width: '450px' }" header="Xóa chương" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="payload"
                >Bạn chắc chắn muốn xóa bình luận <b>Ẩn Danh{{ payload.id }}</b
                >?</span
            >
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="showDialogDelete = false" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteeComment" />
        </template>
    </Dialog>

    </div>
</template>