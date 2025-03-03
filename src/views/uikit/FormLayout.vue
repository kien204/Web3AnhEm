<template>
    <div class="w-full min-h-screen flex flex-col items-center p-6">
        <h2 class="text-3xl font-bold text-orange-600 mb-6">📚 Chọn Thể Loại Truyện 📚</h2>

        <!-- Bộ lọc thể loại -->
        <div class="p-4 rounded-md shadow-md w-full max-w-6xl">
            <div class="flex flex-wrap gap-4 justify-center">
                <button
                    v-for="(genre, index) in allGenres"
                    :key="index"
                    @click="toggleGenre(genre)"
                    :class="{ ' text-white border-blue-200': selectedGenres.includes(genre) }"
                    class="px-4 py-2 border-1 border-orange-400 rounded-full hover:bg-orange-300 transition-all"
                >
                    {{ genre }}
                </button>
            </div>
        </div>

        <!-- Nút xác nhận -->
        <div class="mt-6">
            <Button class="px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-800 transition-all" @click="confirmSelection">🔍 Tìm Truyện</Button>
        </div>

        <!-- Danh sách truyện -->
        <div v-if="filteredStories.length" class="w-full max-w-7xl p-6 mt-6 rounded-md shadow-lg">
            <h3 class="text-2xl font-semibold">✨ Kết quả tìm kiếm:</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                <div v-for="(story, index) in filteredStories" :key="index" class="border-1 border-slate-200 rounded-md p-4 shadow-md transition-all hover:scale-105">
                    <div class="w-full h-40 flex items-center justify-center overflow-hidden">
                        <img :src="story.coverImage" alt="Story Image" class="w-full h-full object-cover rounded-md" />
                    </div>
                    <h4 class="text-lg font-bold mt-3">{{ story.storyName }}</h4>
                    <p class="text-sm">{{ story.typeDetailStory }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            allGenres: [],
            selectedGenres: [],
            filteredStories: []
        };
    },
    methods: {
        async fetchGenres() {
            try {
                const response = await fetch('http://10.15.250.41:5041/api/Story/get-type');
                const data = await response.json();
                this.allGenres = data.data;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách thể loại:', error);
            }
        },
        async confirmSelection() {
            if (this.selectedGenres.length === 0) return;

            // Encode thể loại đúng định dạng API yêu cầu
            const genreQuery = this.selectedGenres.map((genre) => encodeURIComponent(genre)).join('%2C');

            try {
                const response = await fetch(`http://10.15.250.41:5041/api/Story/filter-story/${genreQuery}`);
                const data = await response.json();

                console.log('Dữ liệu API trả về:', data);
                this.filteredStories = data.data || data;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách truyện:', error);
            }
        },
        toggleGenre(genre) {
            if (this.selectedGenres.includes(genre)) {
                this.selectedGenres = this.selectedGenres.filter((g) => g !== genre);
            } else {
                this.selectedGenres.push(genre);
            }
        }
    },
    mounted() {
        this.fetchGenres();
    }
};
</script>
