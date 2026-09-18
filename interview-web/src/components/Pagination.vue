<template>
  <div class="pagination-container">
    <div class="pagination-wrapper">
      <!-- 上一页按钮 -->
      <button 
        class="pagination-btn prev-btn"
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
      >
        <span class="btn-icon">‹</span>
        <span class="btn-text">上一页</span>
      </button>

      <!-- 页码列表 -->
      <div class="page-numbers">
        <!-- 第一页 -->
        <button 
          v-if="showFirstPage"
          class="page-btn"
          :class="{ active: currentPage === 1 }"
          @click="goToPage(1)"
        >
          1
        </button>
        
        <!-- 左侧省略号 -->
        <span v-if="showLeftEllipsis" class="ellipsis">...</span>
        
        <!-- 中间页码 -->
        <button 
          v-for="page in visiblePages"
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        
        <!-- 右侧省略号 -->
        <span v-if="showRightEllipsis" class="ellipsis">...</span>
        
        <!-- 最后一页 -->
        <button 
          v-if="showLastPage"
          class="page-btn"
          :class="{ active: currentPage === totalPages }"
          @click="goToPage(totalPages)"
        >
          {{ totalPages }}
        </button>
      </div>

      <!-- 下一页按钮 -->
      <button 
        class="pagination-btn next-btn"
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <span class="btn-text">下一页</span>
        <span class="btn-icon">›</span>
      </button>
    </div>

    <!-- 分页信息 -->
    <div class="pagination-info">
      <span class="info-text">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
        <span class="total-items">（共 {{ totalItems }} 条记录）</span>
      </span>
      
      <!-- 每页显示数量选择 -->
      <div class="page-size-selector">
        <label>每页显示：</label>
        <select v-model="pageSize" @change="handlePageSizeChange" class="page-size-select">
          <option value="10">10 条</option>
          <option value="20">20 条</option>
          <option value="50">50 条</option>
          <option value="100">100 条</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalItems: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  }
});

const emits = defineEmits(['page-change', 'page-size-change']);

const pageSize = ref(props.pageSize);

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / pageSize.value);
});

// 计算可见页码
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = props.maxVisiblePages;
  const current = props.currentPage;
  const total = totalPages.value;
  
  if (total <= maxVisible) {
    // 如果总页数小于等于最大可见页数，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // 计算显示范围
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    
    // 调整起始位置
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    // 排除第一页和最后一页（它们单独显示）
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i);
      }
    }
  }
  
  return pages;
});

// 是否显示第一页
const showFirstPage = computed(() => {
  return totalPages.value > 1 && !visiblePages.value.includes(1);
});

// 是否显示最后一页
const showLastPage = computed(() => {
  return totalPages.value > 1 && !visiblePages.value.includes(totalPages.value);
});

// 是否显示左侧省略号
const showLeftEllipsis = computed(() => {
  return showFirstPage.value && visiblePages.value.length > 0 && visiblePages.value[0] > 2;
});

// 是否显示右侧省略号
const showRightEllipsis = computed(() => {
  return showLastPage.value && visiblePages.value.length > 0 && 
         visiblePages.value[visiblePages.value.length - 1] < totalPages.value - 1;
});

// 跳转到指定页
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emits('page-change', page);
  }
};

// 处理每页显示数量变化
const handlePageSizeChange = () => {
  emits('page-size-change', pageSize.value);
};

// 监听props变化
watch(() => props.pageSize, (newSize) => {
  pageSize.value = newSize;
});
</script>

<style scoped>
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f9fafb;
}

.btn-icon {
  font-size: 18px;
  font-weight: bold;
}

.btn-text {
  font-size: 14px;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
  transform: translateY(-1px);
}

.page-btn.active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.ellipsis {
  padding: 0 8px;
  color: #9ca3af;
  font-weight: bold;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: #6b7280;
}

.info-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.total-items {
  color: #9ca3af;
  font-size: 13px;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size-selector label {
  font-weight: 500;
  color: #374151;
}

.page-size-select {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.page-size-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pagination-container {
    padding: 16px;
  }
  
  .pagination-wrapper {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .pagination-info {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .btn-text {
    display: none;
  }
  
  .pagination-btn {
    min-width: 40px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .page-numbers {
    gap: 2px;
  }
  
  .page-btn {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }
  
  .pagination-btn {
    padding: 8px;
    min-width: 36px;
  }
  
  .btn-icon {
    font-size: 16px;
  }
}
</style>