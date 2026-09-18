<template>
  <div class="domain-selector">
    <div class="selector-container">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">选择面试领域和岗位</h2>
      
      <!-- 领域选择 -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">面试领域</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="domain in availableDomains"
            :key="domain"
            @click="selectDomain(domain)"
            :class="[
              'domain-card cursor-pointer p-4 rounded-lg border-2 transition-all duration-300',
              selectedDomain === domain
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            ]"
          >
            <div class="flex items-center">
              <div class="domain-icon mr-3">
                <component :is="getDomainIcon(domain)" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">{{ domain }}</h3>
                <p class="text-sm text-gray-600">{{ getDomainDescription(domain) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 岗位选择 -->
      <div v-if="selectedDomain" class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">应聘岗位</label>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="role in availableRoles"
            :key="role"
            @click="selectRole(role)"
            :class="[
              'role-card cursor-pointer p-4 rounded-lg border-2 transition-all duration-300',
              selectedRole === role
                ? 'border-green-500 bg-green-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            ]"
          >
            <div class="text-center">
              <div class="role-icon mb-2 mx-auto">
                <component :is="getRoleIcon(role)" class="w-8 h-8" />
              </div>
              <h4 class="font-semibold text-gray-800">{{ role }}</h4>
              <p class="text-xs text-gray-600 mt-1">{{ getRoleDescription(role) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 面试问题预览 -->
      <div v-if="selectedDomain && selectedRole" class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">面试问题预览</label>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div v-for="(question, index) in previewQuestions" :key="index" class="mb-2">
            <span class="text-sm font-medium text-gray-600">{{ index + 1 }}.</span>
            <span class="text-sm text-gray-800 ml-2">{{ question }}</span>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex justify-center space-x-4">
        <button
          @click="startInterview"
          :disabled="!selectedDomain || !selectedRole"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          开始面试
        </button>
        <button
          @click="testAnalysis"
          :disabled="!selectedDomain || !selectedRole"
          class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          测试分析
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  RobotOutlined, 
  DatabaseOutlined, 
  CloudOutlined,
  CodeOutlined,
  BarChartOutlined,
  SettingOutlined,
  ToolOutlined,
  SafetyOutlined,
  ExperimentOutlined
} from '@ant-design/icons-vue';

// 响应式数据
const selectedDomain = ref('');
const selectedRole = ref('');
const availableDomains = ref([]);
const availableRoles = ref([]);
const previewQuestions = ref([]);

// 领域描述
const domainDescriptions = {
  '人工智能': '机器学习、深度学习、自然语言处理等AI技术',
  '大数据': '数据存储、处理、分析、挖掘等技术',
  '物联网': '传感器、嵌入式系统、IoT平台等技术'
};

// 岗位描述
const roleDescriptions = {
  // 人工智能领域
  '算法工程师': '负责机器学习算法研发和优化',
  '数据科学家': '负责数据分析和挖掘工作',
  'AI产品经理': '负责AI产品规划和设计',
  
  // 大数据领域
  '大数据工程师': '负责大数据平台开发和维护',
  '数据分析师': '负责数据分析和报表制作',
  '数据架构师': '负责数据架构设计和优化',
  
  // 物联网领域
  '嵌入式工程师': '负责嵌入式系统开发',
  'IoT架构师': '负责物联网架构设计',
  '硬件工程师': '负责硬件电路设计'
};

// 图标映射
const domainIcons = {
  '人工智能': RobotOutlined,
  '大数据': DatabaseOutlined,
  '物联网': CloudOutlined
};

const roleIcons = {
  // 人工智能
  '算法工程师': CodeOutlined,
  '数据科学家': BarChartOutlined,
  'AI产品经理': SettingOutlined,
  
  // 大数据
  '大数据工程师': DatabaseOutlined,
  '数据分析师': BarChartOutlined,
  '数据架构师': SettingOutlined,
  
  // 物联网
  '嵌入式工程师': ToolOutlined,
  'IoT架构师': CloudOutlined,
  '硬件工程师': SafetyOutlined
};

// 计算属性
const canStartInterview = computed(() => {
  return selectedDomain.value && selectedRole.value;
});

// 方法
const getDomainIcon = (domain) => {
  return domainIcons[domain] || ExperimentOutlined;
};

const getRoleIcon = (role) => {
  return roleIcons[role] || ExperimentOutlined;
};

const getDomainDescription = (domain) => {
  return domainDescriptions[domain] || '';
};

const getRoleDescription = (role) => {
  return roleDescriptions[role] || '';
};

const selectDomain = async (domain) => {
  selectedDomain.value = domain;
  selectedRole.value = ''; // 重置岗位选择
  previewQuestions.value = []; // 清空问题预览
  
  try {
    // 获取该领域下的岗位列表
    const response = await fetch(`http://localhost:8000/roles/${domain}`);
    const data = await response.json();
    availableRoles.value = data.roles;
  } catch (error) {
    console.error('获取岗位列表失败:', error);
    // 使用默认岗位列表
    availableRoles.value = getDefaultRoles(domain);
  }
};

const selectRole = async (role) => {
  selectedRole.value = role;
  
  try {
    // 获取面试问题
    const response = await fetch(`http://localhost:8000/questions/${selectedDomain.value}/${role}`);
    const data = await response.json();
    previewQuestions.value = data.questions.slice(0, 3); // 只显示前3个问题
  } catch (error) {
    console.error('获取面试问题失败:', error);
    // 使用默认问题
    previewQuestions.value = getDefaultQuestions(selectedDomain.value, role);
  }
};

const getDefaultRoles = (domain) => {
  const defaultRoles = {
    '人工智能': ['算法工程师', '数据科学家', 'AI产品经理'],
    '大数据': ['大数据工程师', '数据分析师', '数据架构师'],
    '物联网': ['嵌入式工程师', 'IoT架构师', '硬件工程师']
  };
  return defaultRoles[domain] || [];
};

const getDefaultQuestions = (domain, role) => {
  const questions = {
    '人工智能': {
      '算法工程师': [
        '请介绍一下你在机器学习方面的经验',
        '你如何解决过拟合问题？',
        '请描述一个你参与过的深度学习项目'
      ],
      '数据科学家': [
        '请介绍一下你的数据分析经验',
        '你使用过哪些数据可视化工具？',
        '如何处理缺失数据？'
      ],
      'AI产品经理': [
        '请介绍一下你对AI产品的理解',
        '如何评估一个AI产品的价值？',
        '请描述一个AI产品从0到1的过程'
      ]
    },
    '大数据': {
      '大数据工程师': [
        '请介绍一下你的大数据处理经验',
        '你使用过哪些大数据技术栈？',
        '如何优化Hadoop作业性能？'
      ],
      '数据分析师': [
        '请介绍一下你的数据分析方法',
        '你使用过哪些BI工具？',
        '如何构建数据指标体系？'
      ],
      '数据架构师': [
        '请介绍一下你的数据架构设计经验',
        '如何设计一个数据湖架构？',
        '请描述一个数据中台项目'
      ]
    },
    '物联网': {
      '嵌入式工程师': [
        '请介绍一下你的嵌入式开发经验',
        '你使用过哪些RTOS？',
        '如何优化嵌入式系统的功耗？'
      ],
      'IoT架构师': [
        '请介绍一下你的IoT架构设计经验',
        '如何设计一个物联网平台？',
        '请描述一个大规模IoT部署项目'
      ],
      '硬件工程师': [
        '请介绍一下你的硬件设计经验',
        '你使用过哪些PCB设计工具？',
        '如何优化电路设计？'
      ]
    }
  };
  
  return questions[domain]?.[role] || ['请介绍一下你的相关经验'];
};

const startInterview = () => {
  if (canStartInterview.value) {
    // 触发开始面试事件
    emit('start-interview', {
      domain: selectedDomain.value,
      role: selectedRole.value
    });
  }
};

const testAnalysis = () => {
  if (canStartInterview.value) {
    // 触发测试分析事件
    emit('test-analysis', {
      domain: selectedDomain.value,
      role: selectedRole.value
    });
  }
};

// 生命周期
onMounted(async () => {
  try {
    // 获取可用领域
    const response = await fetch('http://localhost:8000/domains');
    const data = await response.json();
    availableDomains.value = data.domains;
  } catch (error) {
    console.error('获取领域列表失败:', error);
    // 使用默认领域列表
    availableDomains.value = ['人工智能', '大数据', '物联网'];
  }
});

// 定义事件
const emit = defineEmits(['start-interview', 'test-analysis']);
</script>

<style scoped>
.domain-selector {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.selector-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.domain-card:hover {
  transform: translateY(-2px);
}

.role-card:hover {
  transform: translateY(-2px);
}

.domain-icon {
  color: #3b82f6;
}

.role-icon {
  color: #10b981;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .selector-container {
    padding: 20px;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}
</style> 