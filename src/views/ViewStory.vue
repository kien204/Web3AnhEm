<template>
    <div>
      <div  v-for="img in urlString":key="img">
        <img :src="img" alt="">
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRoute();
const route = useRouter();
const urlString = ref([]);
const params = ref();
  const dataAll = ref(null);
  
  const getAllDetail = async (id) => {
    try {
      const res = await axios.get(`http://10.15.169.9:5041/api/DetailStory/get-detailstory/${id}`);
      dataAll.value = res.data; // Không cần `await` ở `res.data`
      urlString.value = dataAll.value.data.urlImg.trim().split(',');
      console.log(urlString.value);
    } catch (e) {
      console.error('Lỗi khi lấy dữ liệu:', e);
    }
  };
  
  // Gọi API khi component được tải
  onMounted(() => {
     params.value = router.params;
    getAllDetail(params.value.id); // Truyền ID muốn lấy
  });


  </script>
  
  <style>
  /* Thêm CSS nếu cần */
  </style>
  