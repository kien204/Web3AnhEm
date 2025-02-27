<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const toast = useToast();

// Khai báo biến dữ liệu hiển thị chương
const expandedRows = ref([]);

// Khai báo danh sách thể loại truyện
// Khai báo biến dữ liệu form
const storyNameForm = ref('');
const storyCodeForm = ref('');
const storyAuthorForm = ref('');
const coverImageForm = ref('');
const descriptionForm = ref('');
const typeStoryForm = ref('');
const typeDetailStoryForm = ref([]);
const typeDetail = ref(["Hành động", "Viễn tưởng", "Đời thường", "Lãng mạn", "Ma quái"]);

// Khai báo biến lưu trữ truyện khi sửa or xóa
const cloudDeleteStory = ref({});
const cloudEditStory = ref({});

// Khai báo các dialog và form data
const dialogAddStory = ref(false);
const dialogEditStory = ref(false);
const dialogDeleteStory = ref(false);

const FilterMatchMode = {
    STARTS_WITH: 'startsWith',
    CONTAINS: 'contains',
    NOT_CONTAINS: 'notContains',
    ENDS_WITH: 'endsWith',
    EQUALS: 'equals',
    NOT_EQUALS: 'notEquals',
    IN: 'in',
    LESS_THAN: 'lt',
    LESS_THAN_OR_EQUAL_TO: 'lte',
    GREATER_THAN: 'gt',
    GREATER_THAN_OR_EQUAL_TO: 'gte',
    BETWEEN: 'between',
    DATE_IS: 'dateIs',
    DATE_IS_NOT: 'dateIsNot',
    DATE_BEFORE: 'dateBefore',
    DATE_AFTER: 'dateAfter'
};

onMounted(async () => {
    await getAllStory();
});

const url = 'http://localhost:8081/api/products';

// const storyList = ref([
//     {
//         storyName: 'Truyện 1',
//         storyCode: 'T001',
//         storyAuthor: 'Tác giả 1',
//         coverImage: 'image1.jpg',
//         description: 'Mô tả truyện 1',
//         typeStory: 'Phiêu lưu',
//         typeDetailStory: 'Hành động'
//     },
//     {
//         storyName: 'Truyện 2',
//         storyCode: 'T002',
//         storyAuthor: 'Tác giả 2',
//         coverImage: 'image2.jpg',
//         description: 'Mô tả truyện 2',
//         typeStory: 'Khoa học viễn tưởng',
//         typeDetailStory: 'Viễn tưởng'
//     },
//     {
//         storyName: 'Truyện 3',
//         storyCode: 'T003',
//         storyAuthor: 'Tác giả 3',
//         coverImage: 'image3.jpg',
//         description: 'Mô tả truyện 3',
//         typeStory: 'Hài hước',
//         typeDetailStory: 'Đời thường'
//     },
//     {
//         storyName: 'Truyện 4',
//         storyCode: 'T004',
//         storyAuthor: 'Tác giả 4',
//         coverImage: 'image4.jpg',
//         description: 'Mô tả truyện 4',
//         typeStory: 'Tình cảm',
//         typeDetailStory: 'Lãng mạn'
//     },
//     {
//         storyName: 'Truyện 5',
//         storyCode: 'T005',
//         storyAuthor: 'Tác giả 5',
//         coverImage: 'image5.jpg',
//         description: 'Mô tả truyện 5',
//         typeStory: 'Kinh dị',
//         typeDetailStory: 'Ma quái'
//     }
// ]);

const chapterData = ref([
    {
        chapterName: 'Chương 1: Khởi đầu',
        chapterCode: 'C001',
        episodeNumber: 1,
        storyCode: '1'
    },
    {
        chapterName: 'Chương 2: Cuộc gặp gỡ định mệnh',
        chapterCode: 'C002',
        episodeNumber: 2,
        storyCode: '1'
    },
    {
        chapterName: 'Chương 3: Bí mật được tiết lộ',
        chapterCode: 'C003',
        episodeNumber: 3,
        storyCode: '2'
    },
    {
        chapterName: 'Chương 4: Thử thách đầu tiên',
        chapterCode: 'C004',
        episodeNumber: 4,
        storyCode: '3'
    },
    {
        chapterName: 'Chương 5: Đồng minh bất ngờ',
        chapterCode: 'C005',
        episodeNumber: 5,
        storyCode: '12'
    }
]);

const storyList = ref([]);

const getAllStory = async () => {
    try {        
        const response = await axios.get(url + '/getall');
        storyList.value = response.data;
        // const response1 = await axios.get(url + '/get-type');
        // typeDetail.value = response1.data.data;
    } catch (e) {
        console.log(e);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra khi lấy dữ liệu', life: 3000 });
    }
};

// Khai báo biến dữ liệu lỗi
const errors = ref({
    storyNameForm: false,
    storyCodeForm: false,
    storyAuthorForm: false,
    coverImageForm: false,
    descriptionForm: false,
    typeStoryForm: false,
    typeDetailStoryForm: false
});

// Hàm kiểm tra form nhập đủ chưa
const validateForm = () => {
    errors.value.storyNameForm = !storyNameForm.value;
    errors.value.storyCodeForm = !storyCodeForm.value;
    errors.value.storyAuthorForm = !storyAuthorForm.value;
    errors.value.coverImageForm = !coverImageForm.value;
    errors.value.descriptionForm = !descriptionForm.value;
    errors.value.typeStoryForm = !typeStoryForm.value;
    errors.value.typeDetailStoryForm = typeDetailStoryForm.value.length === 0;
    
    
    return !Object.values(errors.value).includes(true);
};

// Hàm reset form
const resetForm = () => {
    storyNameForm.value = '';
    storyCodeForm.value = '';
    storyAuthorForm.value = '';
    coverImageForm.value = '';
    descriptionForm.value = '';
    typeStoryForm.value = '';
    typeDetailStoryForm.value = [];
    Object.keys(errors.value).forEach((key) => {
        errors.value[key] = false;
    });
};

// Hàm thêm truyện mới
const addStory = async () => {
    if (validateForm()) {

        // Kiểm tra trùng mã truyện khi thêm mớii
        if(storyList.value.some(story => story.storyCode === storyCodeForm.value)){
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Mã truyện đã tồn tại', life: 3000 });
            return;
        }

        try {
            const newStoryData = {
                storyName: storyNameForm.value,
                storyCode: storyCodeForm.value,
                storyAuthor: storyAuthorForm.value,
                coverImage: coverImageForm.value,
                description: descriptionForm.value,
                typeStory: typeStoryForm.value,
                typeDetailStory: typeDetailStoryForm.value
            };
            await axios.post(url + '/add', newStoryData);
            await getAllStory();
            resetForm();
            dialogAddStory.value = false;
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm truyện thành công', life: 3000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra khi thêm truyện', life: 3000 });
            console.error('Lỗi thêm dữ liệu:', error);
        }
    } else {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập đầy đủ thông tin', life: 3000 });
    }
};

// Hàm gọi dialog sửa truyện và chuyền data dòng đó vào
const editStoryData = (prod) => {
    cloudEditStory.value = prod;
    dialogEditStory.value = true;
    storyNameForm.value = cloudEditStory.value.storyName;
    storyCodeForm.value = cloudEditStory.value.storyCode;
    storyAuthorForm.value = cloudEditStory.value.storyAuthor;
    coverImageForm.value = cloudEditStory.value.coverImage;
    descriptionForm.value = cloudEditStory.value.description;
    typeStoryForm.value = cloudEditStory.value.typeStory;
    typeDetailStoryForm.value = cloudEditStory.value.typeDetailStory || [];
};

// Hàm sửa truyện
const editStory = async () => {
    if (validateForm()) {

        // Kiểm tra trùng mã truyện khi thêm mớii
        if(storyList.value.some(story => 
        story.storyCode === storyCodeForm.value && story.storyCode !== cloudEditStory.value.storyCode)){
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Mã truyện đã tồn tại', life: 3000 });
            return;
        }

        try {
            const editStoryData = {
                storyName: storyNameForm.value,
                storyCode: storyCodeForm.value,
                storyAuthor: storyAuthorForm.value,
                coverImage: coverImageForm.value,
                description: descriptionForm.value,
                typeStory: typeStoryForm.value,
                typeDetailStory: typeDetailStoryForm.value
            };
            const storyCodeEdit = cloudEditStory.value.storyCode;
            await axios.put(url + `/sua/${storyCodeEdit}` , editStoryData);
            const index = storyList.value.findIndex(story => story.storyCode === cloudEditStory.value.storyCode);
            if (index !== -1) {
                storyList.value[index] = { ...editStoryData };
            }
            resetForm();
            dialogEditStory.value = false;
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Sửa truyện thành công', life: 3000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra khi thêm truyện', life: 3000 });
            console.error('Lỗi sửa dữ liệu:', error);
        }
    } else {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập đầy đủ thông tin', life: 3000 });
    }
};

// Hàm xác nhận xóa truyện
const deleteStory = async () => {
    try {
        const storyCodeDele = cloudDeleteStory.value.storyCode;
        await axios.delete(url + `/xoa/${storyCodeDele}`);
        // Cập nhật lại danh sách bằng cách lọc bỏ truyện vừa xóa
        storyList.value = storyList.value.filter(story => story.storyCode !== storyCodeDele);
        dialogDeleteStory.value = false;
        toast.add({ severity: 'success', summary: 'Thành công', detail: `Truyện ${cloudDeleteStory.value.storyName} đã được xóa thành công`, life: 3000 });
        cloudDeleteStory.value = {};
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: `Có lỗi xảy ra khi xóa truyện ${cloudDeleteStory.value.storyName}`, life: 3000 });
    }
};

// Hàm gọi dialog xóa truyện và chuyền data dòng đó vào
const deleteStoryData = (prod) => {
    cloudDeleteStory.value = prod;
    dialogDeleteStory.value = true;
};

// Hàm lấy danh sách chương theo mã truyện
const getChaptersForStory = (storyCode) => {
    return chapterData.value.filter((chapter) => chapter.storyCode === storyCode);
};

// Hàm tìm kiếm
const filtersStory = ref({
    global: { value: null, matchMode: 'contains' },
    storyName: { value: null, matchMode: 'startsWith' },
    storyCode: { value: null, matchMode: 'equals' }
});
const filtersChapter = ref({
    global: { value: null, matchMode: 'contains' },
    chapterName: { value: null, matchMode: 'startsWith' },
    chapterCode: { value: null, matchMode: 'equals' }
});
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="Thêm truyện mới" icon="pi pi-plus" severity="success" class="mr-2" @click="dialogAddStory = true" />
                    <Button icon="pi pi-refresh" rounded raised @click="getAllStory"/>
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
                <Column header="Ảnh Bìa">
                    <template #body="slotProps">
                        <img :src="slotProps.data.coverImage" :alt="slotProps.data.storyName" class="border-round" style="width: 64px" />
                    </template>
                </Column>
                <Column field="typeStory" header="Thể Loại" />
                <Column field="typeDetailStory" header="Chi Tiết Thể Loại">
                    <template #body="{ data }">
                        {{ data.typeDetailStory.join(", ") }}
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editStoryData(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="deleteStoryData(slotProps.data)" />
                    </template>
                </Column>

                <!-- template hiển thị các chương khi expandable -->
                <template #expansion="slotProps">
                    <div class="p-3">
                        <h5>Danh sách chương - {{ slotProps.data.storyName }}</h5>
                        <DataTable :value="getChaptersForStory(slotProps.data.storyCode)" responsiveLayout="scroll" :globalFilterFields="['chapterName', 'chapterCode']" :filters="filtersChapter">
                            <template #header>
                                <IconField iconPosition="left">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filtersChapter.global.value" placeholder="Nhập mã hoặc tên chương" />
                                    <Button label="Thêm chương mới" icon="pi pi-plus" severity="success" class="ml-2" @click="dialogAddStory = true" />
                                </IconField>
                            </template>
                            <Column field="chapterCode" header="Mã Chương" />
                            <Column field="chapterName" header="Tên Chương" />
                            <Column field="episodeNumber" header="Chương" />

                            <Column :exportable="false" style="min-width: 8rem">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editStoryData(slotProps.data)" />
                                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="deleteStoryData(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </template>
            </DataTable>
        </div>

        <!-- dialog thêm truyện mới -->
        <Dialog v-model:visible="dialogAddStory" modal header="Thêm Truyện" :style="{ width: '45%' }" @hide="resetForm">
            <div class="p-fluid">
                <div class="field">
                    <label for="storyNameForm" class="text-lg">Tên Truyện</label>
                    <InputText id="storyNameForm" v-model="storyNameForm" class="w-full" :class="{ 'p-invalid': errors.storyNameForm }"/>
                </div>
                <div class="field">
                    <label for="storyCodeForm" class="text-lg">Mã Truyện</label>
                    <InputText id="storyCodeForm" v-model="storyCodeForm" class="w-full" :class="{ 'p-invalid': errors.storyCodeForm }" />
                </div>
                <div class="field">
                    <label for="storyAuthorForm" class="text-lg">Tác Giả</label>
                    <InputText id="storyAuthorForm" v-model="storyAuthorForm" class="w-full" :class="{ 'p-invalid': errors.storyAuthorForm }" />
                </div>
                <div class="field">
                    <label for="coverImage" class="text-lg">Ảnh Bìa</label>
                    <InputText id="coverImageForm" v-model="coverImageForm" class="w-full" :class="{ 'p-invalid': errors.coverImageForm }" />
                </div>
                <div class="field">
                    <label for="descriptionForm" class="text-lg">Mô Tả</label>
                    <Textarea id="descriptionForm" v-model="descriptionForm" rows="3" class="w-full" :class="{ 'p-invalid': errors.descriptionForm }" />
                </div>
                <div class="field">
                    <label for="typeStoryForm" class="text-lg">Thể Loại</label>
                    <div class="flex align-items-center mb-2">
                        <RadioButton :class="{ 'p-invalid': errors.typeStoryForm }" inputId="typeStoryTT" name="typeStory" value="TT" v-model="typeStoryForm" />
                        <label for="typeStoryTT" class="ml-2 mr-6">TT</label>
                        <RadioButton :class="{ 'p-invalid': errors.typeStoryForm }" inputId="typeStoryTC" name="typeStory" value="TC" v-model="typeStoryForm" />
                        <label for="typeStoryTC" class="ml-2">TC</label>
                    </div>
                </div>
                <div class="field">
                    <label for="typeDetail" class="text-lg">Chi Tiết Thể Loại</label>
                    <div class="flex flex-wrap">
                        <div v-for="item in typeDetail" :key="item" class="flex align-items-center mb-2 mr-4">
                            <Checkbox :class="{ 'p-invalid': errors.typeDetailStoryForm }" v-model="typeDetailStoryForm" :value="item" />
                            <label class="ml-2">{{ item }}</label>
                        </div>
                    </div>
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Hủy"
                        icon="pi pi-times"
                        class="p-button-secondary"
                        @click="
                            () => {
                                resetForm();
                                dialogAddStory = false;
                            }
                        "
                    />
                    <Button type="button" label="Lưu" icon="pi pi-check" class="p-button-success" @click="addStory" />
                </div>
            </div>
        </Dialog>

        <!-- dialog chỉnh sửa truyện -->
        <Dialog v-model:visible="dialogEditStory" modal header="Chỉnh sửa Truyện" :style="{ width: '45%' }" @hide="resetForm">
            <div class="p-fluid">
                <div class="field" :class="{ 'p-invalid': errors.storyNameForm }">
                    <label for="storyNameForm" class="text-lg">Tên Truyện</label>
                    <InputText id="storyNameForm" v-model="storyNameForm" class="w-full" />
                </div>
                <div class="field" :class="{ 'p-invalid': errors.storyCodeForm }">
                    <label for="storyCodeForm" class="text-lg">Mã Truyện</label>
                    <InputText id="storyCodeForm" v-model="storyCodeForm" class="w-full" />
                </div>
                <div class="field" :class="{ 'p-invalid': errors.storyAuthorForm }">
                    <label for="storyAuthorForm" class="text-lg">Tác Giả</label>
                    <InputText id="storyAuthorForm" v-model="storyAuthorForm" class="w-full" />
                </div>
                <div class="field" :class="{ 'p-invalid': errors.coverImageForm }">
                    <label for="coverImageForm" class="text-lg">Ảnh Bìa</label>
                    <InputText id="coverImageForm" v-model="coverImageForm" class="w-full" />
                </div>
                <div class="field">
                    <label for="descriptionForm" class="text-lg">Mô Tả</label>
                    <Textarea id="descriptionForm" v-model="descriptionForm" rows="3" class="w-full" :class="{ 'p-invalid': errors.descriptionForm }" />
                </div>
                <div class="field">
                    <label for="typeStoryForm" class="text-lg">Thể Loại</label>
                    <div class="flex align-items-center mb-2">
                        <RadioButton :class="{ 'p-invalid': errors.typeStoryForm }" inputId="typeStoryTT" name="typeStoryForm" value="TT" v-model="typeStoryForm" />
                        <label for="typeStoryTT" class="ml-2 mr-6">TT</label>
                        <RadioButton :class="{ 'p-invalid': errors.typeStoryForm }" inputId="typeStoryTC" name="typeStoryForm" value="TC" v-model="typeStoryForm" />
                        <label for="typeStoryTC" class="ml-2">TC</label>
                    </div>
                </div>
                <div class="field">
                    <label for="typeDetail" class="text-lg">Chi Tiết Thể Loại</label>
                    <div class="flex flex-wrap">
                        <div v-for="item in typeDetail" :key="item" class="flex align-items-center mb-2 mr-4">
                            <Checkbox :class="{ 'p-invalid': errors.typeDetailStoryForm }" v-model="typeDetailStoryForm" :value="item" />
                            <label class="ml-2">{{ item }}</label>
                        </div>
                    </div>
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Hủy"
                        icon="pi pi-times"
                        class="p-button-secondary"
                        @click="
                            () => {
                                resetForm();
                                dialogEditStory = false;
                            }
                        "
                    />
                    <Button type="button" label="Lưu" icon="pi pi-check" class="p-button-success" @click="editStory" />
                </div>
            </div>
        </Dialog>

        <!-- dialog xác nhận xóa truyện -->
        <Dialog v-model:visible="dialogDeleteStory" :style="{ width: '450px' }" header="Xóa truyện" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="cloudDeleteStory">Bạn chắc chắn muốn xóa truyện <b>{{ cloudDeleteStory.storyName }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="dialogDeleteStory = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteStory" />
            </template>
        </Dialog>


        <!-- dialog thêm chương mới -->
        <Dialog v-model:visible="dialogAddStory" modal header="Thêm Truyện" :style="{ width: '45%' }" @hide="resetForm">
            <div class="p-fluid">
                <div class="field">
                    <label for="storyNameForm" class="text-lg">Tên Truyện</label>
                    <InputText id="storyNameForm" v-model="storyNameForm" class="w-full" :class="{ 'p-invalid': errors.storyNameForm }"/>
                </div>
                <div class="field">
                    <label for="storyCodeForm" class="text-lg">Mã Truyện</label>
                    <InputText id="storyCodeForm" v-model="storyCodeForm" class="w-full" :class="{ 'p-invalid': errors.storyCodeForm }" />
                </div>
                <div class="field">
                    <label for="storyAuthorForm" class="text-lg">Tác Giả</label>
                    <InputText id="storyAuthorForm" v-model="storyAuthorForm" class="w-full" :class="{ 'p-invalid': errors.storyAuthorForm }" />
                </div>
                <div class="field">
                    <label for="coverImage" class="text-lg">Ảnh Bìa</label>
                    <InputText id="coverImageForm" v-model="coverImageForm" class="w-full" :class="{ 'p-invalid': errors.coverImageForm }" />
                </div>
                <div class="field">
                    <label for="descriptionForm" class="text-lg">Mô Tả</label>
                    <Textarea id="descriptionForm" v-model="descriptionForm" rows="3" class="w-full" :class="{ 'p-invalid': errors.descriptionForm }" />
                </div>
                <div class="field">
                    <label for="typeStoryForm" class="text-lg">Thể Loại</label>
                    <div class="flex align-items-center mb-2">
                        <RadioButton :class="{ 'p-invalid': errors.typeStoryForm }" inputId="typeStoryTT" name="typeStory" value="TT" v-model="typeStoryForm" />
                        <label for="typeStoryTT" class="ml-2 mr-6">TT</label>
                        <RadioButton :class="{ 'p-invalid': errors.typeStoryForm }" inputId="typeStoryTC" name="typeStory" value="TC" v-model="typeStoryForm" />
                        <label for="typeStoryTC" class="ml-2">TC</label>
                    </div>
                </div>
                <div class="field">
                    <label for="typeDetail" class="text-lg">Chi Tiết Thể Loại</label>
                    <div class="flex flex-wrap">
                        <div v-for="item in typeDetail" :key="item" class="flex align-items-center mb-2 mr-4">
                            <Checkbox :class="{ 'p-invalid': errors.typeDetailStoryForm }" v-model="typeDetailStoryForm" :value="item" />
                            <label class="ml-2">{{ item }}</label>
                        </div>
                    </div>
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Hủy"
                        icon="pi pi-times"
                        class="p-button-secondary"
                        @click="
                            () => {
                                resetForm();
                                dialogAddStory = false;
                            }
                        "
                    />
                    <Button type="button" label="Lưu" icon="pi pi-check" class="p-button-success" @click="addStory" />
                </div>
            </div>
        </Dialog>

        <!-- dialog chỉnh sửa chương -->
        <Dialog v-model:visible="dialogEditStory" modal header="Chỉnh sửa Truyện" :style="{ width: '45%' }" @hide="resetForm">
            <div class="p-fluid">
                <div class="field" :class="{ 'p-invalid': errors.storyNameForm }">
                    <label for="storyNameForm" class="text-lg">Tên Truyện</label>
                    <InputText id="storyNameForm" v-model="storyNameForm" class="w-full" />
                </div>
                <div class="field" :class="{ 'p-invalid': errors.storyCodeForm }">
                    <label for="storyCodeForm" class="text-lg">Mã Truyện</label>
                    <InputText id="storyCodeForm" v-model="storyCodeForm" class="w-full" />
                </div>
                <div class="field" :class="{ 'p-invalid': errors.storyAuthorForm }">
                    <label for="storyAuthorForm" class="text-lg">Tác Giả</label>
                    <InputText id="storyAuthorForm" v-model="storyAuthorForm" class="w-full" />
                </div>
                <div class="field" :class="{ 'p-invalid': errors.coverImageForm }">
                    <label for="coverImageForm" class="text-lg">Ảnh Bìa</label>
                    <InputText id="coverImageForm" v-model="coverImageForm" class="w-full" />
                </div>
                <div class="field">
                    <label for="descriptionForm" class="text-lg">Mô Tả</label>
                    <Textarea id="descriptionForm" v-model="descriptionForm" rows="3" class="w-full" :class="{ 'p-invalid': errors.descriptionForm }" />
                </div>
                <div class="field">
                    <label for="typeStoryForm" class="text-lg">Thể Loại</label>
                    <div class="flex align-items-center mb-2">
                        <RadioButton :class="{ 'p-invalid': errors.typeStoryForm }" inputId="typeStoryTT" name="typeStoryForm" value="TT" v-model="typeStoryForm" />
                        <label for="typeStoryTT" class="ml-2 mr-6">TT</label>
                        <RadioButton :class="{ 'p-invalid': errors.typeStoryForm }" inputId="typeStoryTC" name="typeStoryForm" value="TC" v-model="typeStoryForm" />
                        <label for="typeStoryTC" class="ml-2">TC</label>
                    </div>
                </div>
                <div class="field">
                    <label for="typeDetail" class="text-lg">Chi Tiết Thể Loại</label>
                    <div class="flex flex-wrap">
                        <div v-for="item in typeDetail" :key="item" class="flex align-items-center mb-2 mr-4">
                            <Checkbox :class="{ 'p-invalid': errors.typeDetailStoryForm }" v-model="typeDetailStoryForm" :value="item" />
                            <label class="ml-2">{{ item }}</label>
                        </div>
                    </div>
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Hủy"
                        icon="pi pi-times"
                        class="p-button-secondary"
                        @click="
                            () => {
                                resetForm();
                                dialogEditStory = false;
                            }
                        "
                    />
                    <Button type="button" label="Lưu" icon="pi pi-check" class="p-button-success" @click="editStory" />
                </div>
            </div>
        </Dialog>

        <!-- dialog xác nhận xóa chương -->
        <Dialog v-model:visible="dialogDeleteStory" :style="{ width: '450px' }" header="Xóa truyện" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="cloudDeleteStory">Bạn chắc chắn muốn xóa truyện <b>{{ cloudDeleteStory.storyName }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="dialogDeleteStory = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteStory" />
            </template>
        </Dialog>
    </div>
</template>