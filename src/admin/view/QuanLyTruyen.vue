<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const toast = useToast();

// Khai báo biến dữ liệu hiển thị chương
const expandedRows = ref([]);

// Khai báo danh sách thể loại truyện
// Khai báo biến dữ liệu
const storyNameForm = ref('');
const storyCodeForm = ref('');
const storyAuthorForm = ref('');
const coverImageForm = ref('');
const descriptionForm = ref('');
const typeStoryForm = ref('');
const typeDetailStoryForm = ref([]);
const typeDetail = ref([]);

// Khai báo biến lưu trữ truyện khi sửa or xóa
const cloudDeleteStory = ref({});
const cloudEditStory = ref({});
const clouddeleteChapter = ref({});
const cloudeditChapter = ref({});
const cloudCodeStory = ref('');

// Khai báo các dialog và form data
const dialogAddStory = ref(false);
const dialogEditStory = ref(false);
const dialogDeleteStory = ref(false);
const dialogaddChapter = ref(false);
const dialogEditChapter = ref(false);
const dialogdeleteChapter = ref(false);

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

const token = JSON.parse(localStorage.getItem('token')); // Lấy token từ localStorage
onMounted(async () => {
    await getAllStory();
});

// const url = 'http://localhost:8081/api/products';
const url = 'http://10.15.82.73:5041/api';

const chapterterData = ref([]);
const storyList = ref([]);

const getAllStory = async () => {
    try {
        const response = await axios.get(url + '/Story/getAll');
        storyList.value = response.data.data;

        const response2 = await axios.get(url + '/DetailStory/get-all-detailstory');
        chapterterData.value = response2.data.data;

        const response1 = await axios.get(url + '/Story/get-type');
        typeDetail.value = response1.data.data;
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
    errors.value.typeDetailStoryForm = typeDetailStoryForm.value.length + AddTypeDetailStoryForm.value.length === 0;

    return !Object.values(errors.value).includes(true);
};

const validateFormEdit = () => {
    errors.value.storyNameForm = !storyNameForm.value;
    errors.value.storyAuthorForm = !storyAuthorForm.value;
    errors.value.coverImageForm = !coverImageForm.value;
    errors.value.descriptionForm = !descriptionForm.value;
    errors.value.typeDetailStoryForm = typeDetailStoryForm.value.length === 0;

    return !Object.values(errors.value).includes(true);
};

// Hàm reset form
const resetFormStory = () => {
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
        if (storyList.value.some((story) => story.storyCode === storyCodeForm.value)) {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Mã truyện đã tồn tại', life: 3000 });
            return;
        }

        try {
            const newStoryData = {
                storyName: storyNameForm.value,
                storyCode: storyCodeForm.value,
                autho: storyAuthorForm.value,
                imgCover: coverImageForm.value,
                description: descriptionForm.value,
                typeStory: typeStoryForm.value,
                typeDetailStory: typeDetailStoryForm.value.join(',') + "," + AddTypeDetailStoryForm.value
            };
            await axios.post(url + '/Story/inserts', newStoryData, {
                headers: {
                    Authorization: `Bearer ${token}` // Thêm token vào header
                }
            });
            await getAllStory();
            resetFormStory();
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
    storyAuthorForm.value = cloudEditStory.value.storyAuthor;
    coverImageForm.value = cloudEditStory.value.coverImage;
    descriptionForm.value = cloudEditStory.value.description;
    typeDetailStoryForm.value = cloudEditStory.value.typeDetailStory.split(",") || [];
};

// Hàm sửa truyện
const editStory = async () => {
    if (validateFormEdit()) {
        // Kiểm tra trùng mã truyện khi thêm mớii
        if (storyList.value.some((story) => story.storyCode === storyCodeForm.value && story.storyCode !== cloudEditStory.value.storyCode)) {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Mã truyện đã tồn tại', life: 3000 });
            return;
        }

        try {
            const editStoryData = {
                id: cloudEditStory.value.id,
                storyName: storyNameForm.value,
                coverImage: coverImageForm.value,
                description: descriptionForm.value,
                storyAuthor: storyAuthorForm.value,
                typeDetailStory: typeDetailStoryForm.join(',') + "," + AddTypeDetailStoryForm.value
            };
            console.log(editStoryData);
            
            await axios.put(url + `/Story/update-story`, editStoryData, 
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Thêm token vào header
                    }
                }
            );
            resetFormStory();
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
        const storyCodeDele = cloudDeleteStory.value.id;
        
        await axios.delete(url + `/Story/delete-story/${storyCodeDele}`,
            {
                headers: {
                    Authorization: `Bearer ${token}` // Thêm token vào header
                }
            }
        );
        // Cập nhật lại danh sách bằng cách lọc bỏ truyện vừa xóa
        storyList.value = storyList.value.filter((story) => story.storyCode !== storyCodeDele);
        dialogDeleteStory.value = false;
        toast.add({ severity: 'success', summary: 'Thành công', detail: `Truyện ${cloudDeleteStory.value.storyName} đã được xóa thành công`, life: 3000 });
        cloudDeleteStory.value = {};
        getAllStory();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: `Có lỗi xảy ra khi xóa truyện ${cloudDeleteStory.value.storyName}`, life: 3000 });
    }
};

// Hàm gọi dialog xóa truyện và chuyền data dòng đó vào
const deleteStoryData = (prod) => {
    cloudDeleteStory.value = prod;
    dialogDeleteStory.value = true;
};

// Khai báo biến dữ liệu lỗi cho chapter
const errorsChapter = ref({
    storyNameForm: false,
    storyCodeForm: false,
    storyAuthorForm: false,
    coverImageForm: false,
    descriptionForm: false,
    typeStoryForm: false,
    typeDetailStoryForm: false
});

// Hàm kiểm tra form chapter nhập đủ chưa
const validateFormChapter = () => {
    errorsChapter.value.storyNameForm = !storyNameForm.value;
    errorsChapter.value.storyCodeForm = !storyCodeForm.value;
    errorsChapter.value.storyAuthorForm = !storyAuthorForm.value;
    errorsChapter.value.coverImageForm = !coverImageForm.value;
    errorsChapter.value.descriptionForm = !descriptionForm.value;
    errorsChapter.value.typeStoryForm = !typeStoryForm.value;
    errorsChapter.value.typeDetailStoryForm = typeDetailStoryForm.value.length === 0;

    return !Object.values(errors.value).includes(true);
};

// Hàm reset form chapter
const resetFormChapter = () => {
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

// Hàm thêm chương mới
const addChapter = async () => {
    if (validateFormChapterEdit()) {
        // Kiểm tra trùng mã truyện khi thêm mớii
        if (chapterList.value.some((chapter) => chapter.detailID === detailIDForm.value)) {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Mã truyện đã tồn tại', life: 3000 });
            return;
        }

        try {
            const arr = AddTypeDetailStoryForm.value.split(',');
            const newStoryData = {
                storyName: storyNameForm.value,
                storyCode: storyCodeForm.value,
                storyAuthor: storyAuthorForm.value,
                coverImage: coverImageForm.value,
                description: descriptionForm.value,
                typeStory: typeStoryForm.value,
                typeDetailStory: typeDetailStoryForm.value + arr
            };
            
            await axios.post(url + '/add', newStoryData);
            await getAllStory();
            resetFormChapter();
            dialogaddChapter.value = false;
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
const editChapterData = (prod) => {
    cloudeditChapter.value = prod;
    dialogEditChapter.value = true;
    storyNameForm.value = cloudEditStory.value.storyName;
    storyCodeForm.value = cloudEditStory.value.storyCode;
    storyAuthorForm.value = cloudEditStory.value.storyAuthor;
    coverImageForm.value = cloudEditStory.value.coverImage;
    descriptionForm.value = cloudEditStory.value.description;
    typeStoryForm.value = cloudEditStory.value.typeStory;
    typeDetailStoryForm.value = cloudEditStory.value.typeDetailStory || [];
};

// Hàm sửa truyện
const editChapter = async () => {
    if (validateFormChapter()) {
        // Kiểm tra trùng mã truyện khi thêm mớii
        if (chapterList.value.some((chapter) => chapter.detailID === chapterCodeForm.value && chapter.detailID !== cloudeditChapter.value.detailID)) {
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
                typeDetailStory: typeDetailStoryForm.value + AddTypeDetailStoryForm.value
            };
            console.log(editStoryData.typeDetailStory);
            
            const chapterCodeEdit = cloudeditChapter.value.detailID;
            await axios.put(url + `/sua/${chapterCodeEdit}`, editStoryData);
            const index = chapterList.value.findIndex((chapter) => chapter.detailID === cloudeditChapter.value.detailID);
            if (index !== -1) {
                chapterList.value[index] = { ...editStoryData };
            }
            resetFormChapter();
            dialogEditChapter.value = false;
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
const deleteChapter = async () => {
    try {
        const chapterCodeDele = clouddeleteChapter.value.detailID;
        await axios.delete(url + `/DetailStory/delete-detailstory/${chapterCodeDele}`,
            {
                headers: {
                    Authorization: `Bearer ${token}` // Thêm token vào header
                }
            }
        );
        // Cập nhật lại danh sách bằng cách lọc bỏ truyện vừa xóa
        chapterList.value = chapterList.value.filter((chapter) => chapter.detailID !== chapterCodeDele);
        dialogDeleteStory.value = false;
        toast.add({ severity: 'success', summary: 'Thành công', detail: `Truyện ${clouddeleteChapter.value.storyName} đã được xóa thành công`, life: 3000 });
        clouddeleteChapter.value = {};
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: `Có lỗi xảy ra khi xóa truyện ${clouddeleteChapter.value.storyName}`, life: 3000 });
    }
};

// Hàm gọi dialog thêm truyện và chuyền mã truyện vào
const codeChapterData = (prod) => {
    cloudCodeStory.value = prod;
    dialogaddChapter.value = true;
    console.log(cloudCodeStory.value);
};

// Hàm gọi dialog xóa truyện và chuyền data dòng đó vào
const deleteChapterData = (prod) => {
    clouddeleteChapter.value = prod;
    dialogdeleteChapter.value = true;
};

// ham upload file
const onAdvancedUpload = () => {
    toast.add({ severity: 'info', summary: 'Thành công', detail: 'Tải file thành công', life: 3000 });
};

// Hàm lấy danh sách chương theo mã truyện
const getchaptertersForStory = (id) => {
    return chapterterData.value.filter((chapterter) => chapterter.storyID === id);
};

// Hàm tìm kiếm
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
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="Thêm truyện mới" icon="pi pi-plus" severity="success" class="mr-2" @click="dialogAddStory = true" />
                    <Button icon="pi pi-refresh" rounded raised @click="getAllStory" />
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
                <Column expander style="width: 2rem"/>
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
                        {{ data.typeDetailStory }}
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
                            <Column field="detailID" header="Mã Chương" />
                            <Column field="sttName" header="Tên Chương" />

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
        <Dialog v-model:visible="dialogAddStory" modal header="Thêm Truyện" :style="{ width: '45%' }" @hide="resetFormStory">
            <div class="p-fluid">
                <div class="field">
                    <label for="storyNameForm" class="text-lg">Tên Truyện</label>
                    <InputText id="storyNameForm" v-model="storyNameForm" class="w-full" :class="{ 'p-invalid': errors.storyNameForm }" />
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
                    <div class="field">
                        <InputText id="AddTypeDetailStoryForm" class="w-full mb-5" />
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
                                resetFormStory();
                                dialogAddStory = false;
                            }
                        "
                    />
                    <Button type="button" label="Lưu" icon="pi pi-check" class="p-button-success" @click="addStory" />
                </div>
            </div>
        </Dialog>

        <!-- dialog chỉnh sửa truyện -->
        <Dialog v-model:visible="dialogEditStory" modal header="Chỉnh sửa Truyện" :style="{ width: '45%' }" @hide="resetFormStory">
            <div class="p-fluid">
                <div class="field" :class="{ 'p-invalid': errors.storyNameForm }">
                    <label for="storyNameForm" class="text-lg">Tên Truyện</label>
                    <InputText id="storyNameForm" v-model="storyNameForm" class="w-full" />
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
                    <label for="typeDetail" class="text-lg">Chi Tiết Thể Loại</label>
                    <div class="flex flex-wrap">
                        <div v-for="item in typeDetail" :key="item" class="flex align-items-center mb-2 mr-4">
                            <Checkbox :class="{ 'p-invalid': errors.typeDetailStoryForm }" v-model="typeDetailStoryForm" :value="item" />
                            <label class="ml-2">{{ item }}</label>
                        </div>
                    </div>
                    <div class="field">
                        <InputText id="AddTypeDetailStoryForm" class="w-full mb-5" />
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
                                resetFormStory();
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
                <span v-if="cloudDeleteStory"
                    >Bạn chắc chắn muốn xóa truyện <b>{{ cloudDeleteStory.storyName }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="dialogDeleteStory = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteStory" />
            </template>
        </Dialog>

        <!-- dialog thêm chương mới -->
        <Dialog v-model:visible="dialogaddChapter" modal header="Thêm chương" :style="{ width: '45%' }" @hide="resetFormChapter">
            <div class="p-fluid">
                <div class="field">
                    <label for="detailIDForm" class="text-lg">Mã chương</label>
                    <InputText id="detailIDForm" v-model="detailIDForm" class="w-full" :class="{ 'p-invalid': errors.detailIDForm }" />
                </div>
                <div class="field">
                    <label for="sttNameForm" class="text-lg">Chương</label>
                    <InputText id="sttNameForm" v-model="sttNameForm" class="w-full" :class="{ 'p-invalid': errors.sttNameForm }" />
                </div>
                <div class="field">
                    <label for="contentForm" class="text-lg">Nội dung</label>
                    <Textarea id="contentForm" v-model="contentForm" rows="3" class="w-full" :class="{ 'p-invalid': errors.contentForm }" />
                </div>
                <FileUpload id="fileForm" name="tải file" url="/api/upload" @upload="onAdvancedUpload($event)" accept="application/pdf" :maxFileSize="10000000">
                    <template #empty>
                        <p>Kéo và thả tập tin vào đây để tải lên.</p>
                    </template>
                </FileUpload>
                <div class="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Hủy"
                        icon="pi pi-times"
                        class="p-button-secondary"
                        @click="
                            () => {
                                resetFormChapter();
                                dialogaddChapter = false;
                            }
                        "
                    />
                    <Button type="button" label="Lưu" icon="pi pi-check" class="p-button-success" @click="addChapter" />
                </div>
            </div>
        </Dialog>

        <!-- dialog chỉnh sửa chương -->
        <Dialog v-model:visible="dialogEditChapter" modal header="Chỉnh sửa Truyện" :style="{ width: '45%' }" @hide="resetFormChapter">
            <div class="p-fluid">
                <div class="field">
                    <label for="detailIDForm" class="text-lg">Mã chương</label>
                    <InputText id="detailIDForm" v-model="detailIDForm" class="w-full" :class="{ 'p-invalid': errors.detailIDForm }" />
                </div>
                <div class="field">
                    <label for="sttNameForm" class="text-lg">Chương</label>
                    <InputText id="sttNameForm" v-model="sttNameForm" class="w-full" :class="{ 'p-invalid': errors.sttNameForm }" />
                </div>
                <div class="field">
                    <label for="contentForm" class="text-lg">Nội dung</label>
                    <Textarea id="contentForm" v-model="contentForm" rows="3" class="w-full" :class="{ 'p-invalid': errors.contentForm }" />
                </div>
                <FileUpload id="fileForm" name="tải file" url="/api/upload" @upload="onAdvancedUpload($event)" accept="application/pdf" :maxFileSize="10000000">
                    <template #empty>
                        <p>Kéo và thả tập tin vào đây để tải lên.</p>
                    </template>
                </FileUpload>
                <div class="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Hủy"
                        icon="pi pi-times"
                        class="p-button-secondary"
                        @click="
                            () => {
                                resetFormChapter();
                                dialogEditChapter = false;
                            }
                        "
                    />
                    <Button type="button" label="Lưu" icon="pi pi-check" class="p-button-success" @click="editChapter" />
                </div>
            </div>
        </Dialog>

        <!-- dialog xác nhận xóa chương -->
        <Dialog v-model:visible="dialogdeleteChapter" :style="{ width: '450px' }" header="Xóa chương" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="clouddeleteChapter">Bạn chắc chắn muốn xóa chương <b>{{ clouddeleteChapter.sttName }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="dialogdeleteChapter = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteChapter" />
            </template>
        </Dialog>
    </div>
</template>