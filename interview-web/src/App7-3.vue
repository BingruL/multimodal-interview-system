<template>
  <div style="text-align: center">
    <a-space style="padding: 20px" direction="vertical">
      <a-space>
        <a-button type="primary" :disabled="isConnected || isConnecting" @click="handleConnectClick">
          连接
        </a-button>
        <a-button :disabled="!isConnected" @click="handleInterrupt">
          打断
        </a-button>
        <a-button danger :disabled="!isConnected" @click="handleDisconnect">
          断开
        </a-button>
        <a-button v-if="audioEnabled" :disabled="!isConnected" @click="toggleMicrophone">
          静音
        </a-button>
        <a-button v-else :disabled="!isConnected" @click="toggleMicrophone">
          取消静音
        </a-button>
      </a-space>

      <a-space v-if="isSupportVideo && videoDevices.length > 0">
        <a-select
          style="width: 250px"
          :disabled="!isConnected"
          v-model:value="selectedVideoDeviceId"
          placeholder="选择视频输入设备"
          @change="handleVideoDeviceChange"
        >
          <a-select-option
            v-for="device in videoDevices"
            :key="device.deviceId"
            :value="device.deviceId"
          >
            {{ device.label || `设备 ${device.deviceId.substring(0, 8)}...` }}
          </a-select-option>
        </a-select>
        <a-button v-if="isVideoEnabled" :disabled="!isConnected" @click="toggleVideo">
          关闭视频
        </a-button>
        <a-button v-else :disabled="!isConnected" @click="toggleVideo">
          开启视频
        </a-button>
      </a-space>
      <br />
      <div>
        <p>Connection Status: {{ connectStatus }}</p>
      </div>
      <a-space direction="vertical">
        <a-space v-if="isSupportVideo">
          <div id="local-player" style="width: 400px; height: 400px; border: 1px solid #ccc"></div>
        </a-space>
        <a-space>
          <div
            style="
              margin-top: 20px;
              padding: 20px;
              max-height: 600px;
              width: 400px;
              overflow-y: auto;
              border: 1px solid #ccc;
            "
          >
            <h3>实时语音回复</h3>
            <a-list :data-source="messageList">
              <template #renderItem="{ item }">
                <a-list-item style="text-align: left">
                  {{ item }}
                </a-list-item>
              </template>
            </a-list>
          </div>
        </a-space>
      </a-space>
    </a-space>

    <Home v-if="currentPage === 'home'" @start-interview="handleStartInterview" :user-id="userId" />
    <Interview
      v-else-if="currentPage === 'interview'"
      :selected-domain-name="selectedDomainName"
      :selected-role="selectedRole"
      :current-question-index="currentQuestionIndex"
      :total-questions="totalQuestions"
      :current-question="currentQuestion"
      :is-ai-thinking="isAiThinking"
      :is-loading="isLoading"
      :ai-generated-question="aiGeneratedQuestion"
      @next-question="handleNextQuestion"
      @go-home="handleGoHome"
      @update:user-answer="updateUserAnswer"
      @start-video-recording="startVideoRecording"
      @stop-video-recording="stopVideoRecording"
      @start-audio-recording="startAudioRecording"
      @stop-audio-recording="stopAudioRecording"
      :is-recording-video="isRecordingVideo"
      :is-recording-audio="isRecordingAudio"
      :video-ref="videoRef"
    />
    <Report
      v-else-if="currentPage === 'report'"
      :feedback-data="feedbackData"
      :selected-domain-name="selectedDomainName"
      :selected-role="selectedRole"
      :radar-chart-scores="radarChartScores"
      :radar-chart-labels="radarChartLabels"
      @view-recommendations="currentPage = 'recommendations'"
      @go-home="handleGoHome"
    />
    <Recommendations
      v-else-if="currentPage === 'recommendations'"
      :learning-recs="learningRecs"
      :category-labels="categoryLabels"
      @go-home="handleGoHome"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
// import { message } from 'ant-design-vue';
import { message } from 'ant-design-vue'; // message is from ant-design-vue
import { onAuthStateChanged } from 'firebase/auth'; // Correct import for onAuthStateChanged
// import { message, onAuthStateChanged } from 'ant-design-vue'; // Assuming onAuthStateChanged is also from ant-design-vue based on the error, but it's typically from firebase/auth
import { RealtimeAPIError, RealtimeClient, RealtimeError, RealtimeUtils, EventNames, ChatEventType } from '@coze/realtime-api';
import { CozeAPI, COZE_CN_BASE_URL } from '@coze/api';
import { useTokenWithPat } from './hooks/index';
import { NetworkErrorManager } from './network-error-manager';

// 导入子组件
import Home from './components/Home.vue';
import Interview from './components/Interview.vue';
import Report from './components/Report.vue';
import Recommendations from './components/Recommendations.vue';

// 导入模拟数据和工具函数
import {
  mockInterviewDomains,
  mockInterviewQuestions,
  mockFeedbackReport,
  mockLearningRecommendations,
  categoryLabels,
  radarChartLabels,
  simulateApiCall,
} from './utils/mockData';
// import { initializeFirebase, signInAnonymouslyToFirebase, addInterviewHistory } from './utils/realtimeService';
import { initializeFirebase, signInAnonymouslyToFirebase, addInterviewHistory } from './utils/realtimeService'; // No changes here

// Realtime API & Coze 配置
const botId = '7522465288949170212';
const { getToken } = useTokenWithPat();

// 全局响应式状态
const currentPage = ref('home');
const selectedDomain = ref(null);
const selectedRole = ref(null);
const currentQuestionIndex = ref(0);
const interviewHistory = ref([]);
const userAnswer = ref('');
const isRecordingAudio = ref(false);
const isRecordingVideo = ref(false);
const isLoading = ref(false);
const feedbackData = ref(null);
const learningRecs = ref([]);
const userId = ref(null);
const dbInstance = ref(null);
const authInstance = ref(null);
const isAuthReady = ref(false);
const aiGeneratedQuestion = ref(null);
const isAiThinking = ref(false);
const videoRef = ref(null);
const audioStreamRef = ref(null);
const videoStreamRef = ref(null);
const mediaRecorderRef = ref(null);
const audioChunksRef = ref([]);

// Realtime Client 相关状态和方法
const client = ref(null);
const messageList = ref([]);
const isConnecting = ref(false);
const isConnected = ref(false);
const audioEnabled = ref(true);
const isSupportVideo = ref(false);
const connectStatus = ref('disconnected');
const networkManager = ref(null);
const videoDevices = ref([]);
const selectedVideoDeviceId = ref('');
const isVideoEnabled = ref(true);
const isMobileDevice = ref(false);

const getVoices = async () => {
  const api = new CozeAPI({
    token: getToken,
    baseURL: COZE_CN_BASE_URL,
    allowPersonalAccessTokenInBrowser: true,
  });
  const voices = await api.audio.voices.list();
  return voices.voice_list;
};

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

const initClient = async () => {
  if (client.value) {
    return;
  }

  isMobileDevice.value = isMobile();
  const permission = await RealtimeUtils.checkDevicePermission(true);
  if (!permission.audio) {
    throw new Error('需要麦克风访问权限');
  }
  isSupportVideo.value = permission.video;

  if (isMobileDevice.value && isSupportVideo.value) {
    videoDevices.value = [
      { deviceId: 'user', label: '前置摄像头' },
      { deviceId: 'environment', label: '后置摄像头' },
    ];
  } else {
    const devices = await RealtimeUtils.getAudioDevices({
      video: true,
    });
    videoDevices.value = devices.videoInputs || [];
  }
  if (!selectedVideoDeviceId.value && videoDevices.value.length > 0) {
    selectedVideoDeviceId.value = videoDevices.value[0].deviceId;
  }

  const voices = await getVoices();

  console.log('voices', selectedVideoDeviceId.value);
  client.value = new RealtimeClient({
    accessToken: getToken,
    botId,
    connectorId: '1024',
    voiceId: voices.length > 0 ? voices[0].voice_id : undefined,
    allowPersonalAccessTokenInBrowser: true,
    debug: true,
    videoConfig: permission.video
      ? {
          renderDom: 'local-player',
          videoInputDeviceId: selectedVideoDeviceId.value || undefined,
        }
      : undefined,
  });
  handleMessageEvent();

  networkManager.value = new NetworkErrorManager(client.value);
  networkManager.value.onStatusChange = status => {
    connectStatus.value = status;
    isConnecting.value =
      status === 'connecting' || status === 'reconnecting';
    isConnected.value = status === 'connected';
  };
};

const handleMessageEvent = () => {
  let lastEvent;
  client.value?.on(EventNames.ALL_SERVER, (eventName, event) => {
    if (
      event.event_type !== ChatEventType.CONVERSATION_MESSAGE_DELTA &&
      event.event_type !== ChatEventType.CONVERSATION_MESSAGE_COMPLETED
    ) {
      return;
    }
    const content = event.data.content;

    if (
      lastEvent?.event_type === ChatEventType.CONVERSATION_MESSAGE_DELTA
    ) {
      messageList.value[messageList.value.length - 1] += content;
    } else if (
      event.event_type === ChatEventType.CONVERSATION_MESSAGE_DELTA
    ) {
      messageList.value.push(content);
    }
    lastEvent = event;
  });
};

const handleConnectClick = () => {
  isConnecting.value = true;
  handleConnect();
};

const handleConnect = async () => {
  try {
    if (!client.value) {
      await initClient();
    }

    await client.value?.connect();
    isConnected.value = true;
  } catch (error) {
    isConnecting.value = false;
    console.error(error);
    if (error instanceof RealtimeAPIError) {
      switch (error.code) {
        case RealtimeError.CREATE_ROOM_ERROR:
          message.error(`创建房间失败: ${error.message}`);
          break;
        case RealtimeError.CONNECTION_ERROR:
          message.error(`加入房间失败: ${error.message}`);
          break;
        case RealtimeError.DEVICE_ACCESS_ERROR:
          message.error(`获取设备失败: ${error.message}`);
          break;
        default:
          message.error(`连接错误: ${error.message}`);
      }
    } else {
      message.error('连接错误：' + error);
    }
  }
};

const handleInterrupt = () => {
  try {
    client.value?.interrupt();
  } catch (error) {
    message.error('打断失败：' + error);
  }
};

const handleDisconnect = () => {
  try {
    client.value?.disconnect();
  } catch (error) {
    message.error('断开失败：' + error);
  }
};

const toggleMicrophone = () => {
  try {
    client.value?.setAudioEnable(!audioEnabled.value);
    audioEnabled.value = !audioEnabled.value;
  } catch (error) {
    message.error('切换麦克风状态失败：' + error);
  }
};

const toggleVideo = () => {
  try {
    client.value?.setVideoEnable(!isVideoEnabled.value);
    isVideoEnabled.value = !isVideoEnabled.value;
  } catch (error) {
    message.error('切换视频状态失败：' + error);
  }
};

const handleVideoDeviceChange = async (deviceId) => {
  try {
    if (!client.value || !isConnected.value) {
      return;
    }

    if (
      RealtimeUtils.isScreenShareDevice(deviceId) ||
      RealtimeUtils.isScreenShareDevice(selectedVideoDeviceId.value)
    ) {
      selectedVideoDeviceId.value = deviceId;
      handleDisconnect();
      client.value = null;
      handleConnect();
    } else {
      selectedVideoDeviceId.value = deviceId;
      await client.value.setVideoInputDevice(deviceId);
    }
    message.success('切换视频设备成功');
  } catch (error) {
    message.error('切换视频设备失败：' + error);
  }
};

// --- Computed Properties ---
const selectedDomainName = computed(() => mockInterviewDomains.find(d => d.id === selectedDomain.value)?.name);
const currentQuestionList = computed(() => {
  if (!selectedDomain.value || !selectedRole.value) return [];
  return mockInterviewQuestions[`${selectedDomain.value}-${selectedRole.value}`] || [];
});
const totalQuestions = computed(() => currentQuestionList.value.length);
const currentQuestion = computed(() => aiGeneratedQuestion.value || currentQuestionList.value[currentQuestionIndex.value]);
const radarChartScores = computed(() => {
  if (!feedbackData.value) return [];
  const { professionalKnowledge, jobSkillMatch, languageExpression, logicalThinking, stressResistance } = feedbackData.value;
  return [professionalKnowledge, jobSkillMatch, languageExpression, logicalThinking, stressResistance];
});

// --- Methods ---
const handleStartInterview = (domainId, role) => {
  selectedDomain.value = domainId;
  selectedRole.value = role;
  currentQuestionIndex.value = 0;
  interviewHistory.value = [];
  aiGeneratedQuestion.value = null;
  currentPage.value = 'interview';
};

const callGeminiForFollowUp = async (lastQuestion, userAnswer, domain, role) => {
  isAiThinking.value = true;
  const apiKey = ""; // Provided by Canvas at runtime
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const prompt = `你是一个专业的AI面试官，正在对一位应聘者进行${domain}领域的${role}岗位的模拟面试。这是你提出的上一个问题：'${lastQuestion}' 这是应聘者的回答：'${userAnswer}' 请根据应聘者的回答，判断是否需要进行追问或引导。如果需要追问，请生成一个相关的、有深度的追问问题。如果认为当前话题已充分探讨，不需要追问，请回复一个特殊标记表示可以进入下一个话题。请以JSON格式返回你的判断和问题（如果生成了的话）。示例1（追问）：{ "action": "follow_up", "question": "基于您刚才的回答，您能具体谈谈在[某个点]上是如何实现的吗？" } 示例2（进入下一话题）：{ "action": "next_topic" }`;
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          "action": { "type": "STRING", "enum": ["follow_up", "next_topic"] },
          "question": { "type": "STRING" }
        },
        required: ["action"]
      }
    }
  };

  try {
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (result.candidates?.[0]?.content?.parts?.[0]) {
      const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
      isAiThinking.value = false;
      return parsedJson;
    }
    throw new Error("Invalid API response structure");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    isAiThinking.value = false;
    return { action: "next_topic" }; // Fallback
  }
};

const handleNextQuestion = async () => {
  if (!userAnswer.value.trim()) {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `<div class="bg-white p-6 rounded-lg shadow-xl text-center rounded-lg"><p class="text-lg font-semibold text-gray-800 mb-4">请输入您的回答！</p><button id="closeMessageBox" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 rounded-lg">确定</button></div>`;
    document.body.appendChild(messageBox);
    document.getElementById('closeMessageBox').onclick = () => document.body.removeChild(messageBox);
    return;
  }
  isLoading.value = true;
  const question = currentQuestion.value;
  const newEntry = { question, answer: userAnswer.value, timestamp: new Date().toISOString() };

  if (dbInstance.value && userId.value) {
    try {
      const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
      await addInterviewHistory(dbInstance.value, appId, userId.value, newEntry);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  interviewHistory.value.push(newEntry);

  const lastAnswer = userAnswer.value;
  userAnswer.value = '';
  const geminiResponse = await callGeminiForFollowUp(question, lastAnswer, selectedDomainName.value, selectedRole.value);

  if (geminiResponse.action === "follow_up" && geminiResponse.question) {
    aiGeneratedQuestion.value = geminiResponse.question;
  } else {
    aiGeneratedQuestion.value = null;
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++;
    } else {
      await generateFeedbackReport();
    }
  }
  isLoading.value = false;
};

const generateFeedbackReport = async () => {
  isLoading.value = true;
  const report = await simulateApiCall(mockFeedbackReport[selectedDomain.value]);
  feedbackData.value = report;

  const recommendations = {};
  Object.keys(report).forEach(key => {
    if (mockLearningRecommendations[key] && Array.isArray(mockLearningRecommendations[key])) {
      recommendations[key] = mockLearningRecommendations[key];
    }
  });
  learningRecs.value = recommendations;
  currentPage.value = 'report';
  isLoading.value = false;
};

const handleGoHome = () => {
  currentPage.value = 'home';
  selectedDomain.value = null;
  selectedRole.value = null;
  currentQuestionIndex.value = 0;
  interviewHistory.value = [];
  userAnswer.value = '';
  isRecordingAudio.value = false;
  isRecordingVideo.value = false;
  isLoading.value = false;
  feedbackData.value = null;
  learningRecs.value = [];
  aiGeneratedQuestion.value = null;
  isAiThinking.value = false;
};

const updateUserAnswer = (value) => {
  userAnswer.value = value;
};

const startVideoRecording = async () => {
  try {
    videoStreamRef.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    videoRef.value.srcObject = videoStreamRef.value;
    isRecordingVideo.value = true;
    message.success('视频录制已开始');
  } catch (error) {
    console.error('Error starting video recording:', error);
    message.error('无法开始视频录制');
  }
};

const stopVideoRecording = () => {
  if (videoStreamRef.value) {
    videoStreamRef.value.getTracks().forEach(track => track.stop());
    videoRef.value.srcObject = null;
    isRecordingVideo.value = false;
    message.success('视频录制已停止');
  }
};

const startAudioRecording = async () => {
  try {
    audioStreamRef.value = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    mediaRecorderRef.value = new MediaRecorder(audioStreamRef.value);
    audioChunksRef.value = [];

    mediaRecorderRef.value.ondataavailable = (event) => {
      audioChunksRef.value.push(event.data);
    };

    mediaRecorderRef.value.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.value, { type: 'audio/wav' });
      console.log('Audio recorded:', audioBlob);
      // TODO: Send audioBlob to server or process further
    };

    mediaRecorderRef.value.start();
    isRecordingAudio.value = true;
    message.success('音频录制已开始');
  } catch (error) {
    console.error('Error starting audio recording:', error);
    message.error('无法开始音频录制');
  }
};

const stopAudioRecording = () => {
  if (mediaRecorderRef.value && mediaRecorderRef.value.state === 'recording') {
    mediaRecorderRef.value.stop();
  }
  if (audioStreamRef.value) {
    audioStreamRef.value.getTracks().forEach(track => track.stop());
  }
  isRecordingAudio.value = false;
  message.success('音频录制已停止');
};

onMounted(async () => {
  // Firebase初始化和匿名登录
  const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.VUE_APP_FIREBASE_APP_ID || '',
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID || '',
  };
  const { auth, db } = initializeFirebase(firebaseConfig);
  authInstance.value = auth;
  dbInstance.value = db;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid;
      console.log("Firebase User ID:", userId.value);
    } else {
      signInAnonymouslyToFirebase(auth).then(userCred => {
        userId.value = userCred.user.uid;
        console.log("Signed in anonymously:", userId.value);
      }).catch(error => {
        console.error("Anonymous sign-in failed:", error);
      });
    }
    isAuthReady.value = true;
  });

  await handleConnect();
});

onUnmounted(() => {
  networkManager.value?.destroy();
  handleDisconnect();
});
</script>
<style>
/* Using Tailwind, so minimal global styles are needed. */
/* The 'font-inter' class is used throughout the template, assuming Inter is loaded globally, e.g., in index.html */
.font-inter {
  font-family: 'Inter', sans-serif;
}

/* ========== 全局样式增强 ========== */
body {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

/* 页面容器动画 */
div[class*="flex flex-col items-center"] {
  animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ========== 首页样式增强 ========== */
.bg-gradient-to-br.from-blue-100.to-purple-100 {
  background: linear-gradient(135deg, #e0f7fa 0%, #f3e5f5 100%);
}

/* 领域卡片悬浮效果 */
.bg-blue-50 {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-left: 4px solid #3b82f6;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.15);
  position: relative;
  overflow: hidden;
}

.bg-blue-50:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.25);
}

.bg-blue-50:hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 1.5s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 按钮发光效果 */
.bg-blue-600 {
    font-size: 24px;
    color: rgb(0, 0, 0);
    visibility: visible;
    font-family: zt3, sans-serif;
    box-sizing: border-box;
    outline: none;
    padding: 0px;
    margin: 0px;
    position: relative;
    box-shadow: rgba(176, 208, 221, 0.16) 0px 6px 8px 1px;
    float: left;
    /* margin-right: 40px; */
    width: calc(30% - 26.6667px);
    text-align: center;
    /* margin-bottom: 30px; */
    overflow: hidden;
    background: linear-gradient(rgba(116, 200, 223, 0.3) 0%, rgb(255, 255, 255) 100%);
    border-radius: 30px;
    border-width: 3px;
    border-style: solid;
    border-color: rgb(255, 255, 255);
    border-image: initial;
    height: 50px;
}

.bg-blue-600:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.6);
}

.bg-blue-600:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: 0.5s;
}

.bg-blue-600:hover:before {
  left: 100%;
}

/* ========== 面试页面样式增强 ========== */
.bg-gradient-to-br.from-green-100.to-teal-100 {
  background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%);
}

/* 问题卡片样式 */
.bg-gray-50 {
  background: linear-gradient(to bottom right, #f9fafb, #f0fdfa);
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
  border-left: 4px solid #10b981;
  position: relative;
  padding: 1.5rem;
}

/* 视频预览样式 */
video {
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 2px solid #e5e7eb;
  background: linear-gradient(45deg, #6ee7b7, #3b82f6);
  background-size: 400% 400%;
  animation: gradientBG 8s ease infinite;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 输入框聚焦效果 */
textarea {
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #d1d5db;
}

textarea:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
  border-color: #10b981;
  outline: none;
}

/* 按钮组样式 */
.flex.space-x-4 {
  gap: 1rem;
}

/* ========== 报告页面样式增强 ========== */
.bg-gradient-to-br.from-orange-100.to-red-100 {
  background: linear-gradient(135deg, #ffedd5 0%, #fee2e2 100%);
}

/* 雷达图容器 */
.mb-8 {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

/* 关键问题定位和改进建议卡片 */
.text-left.bg-white {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  background: white;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.text-left.bg-white h2 {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  color: white;
  padding: 1rem 1.5rem;
  margin: -1.5rem -1.5rem 1.5rem -1.5rem;
  border-radius: 16px 16px 0 0;
  font-weight: 600;
}

/* ========== 推荐页面样式增强 ========== */
.bg-gradient-to-br.from-purple-100.to-indigo-100 {
  background: linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%);
}

/* 推荐卡片样式 */
.bg-indigo-50 {
  border-radius: 16px;
  transition: all 0.3s ease;
  border-left: 4px solid #8b5cf6;
  box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.bg-indigo-50:hover {
  transform: translateX(10px);
  box-shadow: 0 20px 25px -5px rgba(139, 92, 246, 0.2);
}

/* ========== 按钮通用样式增强 ========== */
button:not(:disabled) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  font-weight: 500;
}

button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
}

/* 主按钮特效 */
.bg-green-600 {
  background: linear-gradient(45deg, #10b981, #3b82f6);
  background-size: 200% 200%;
  transition: background-position 0.5s ease;
  border: none;
}

.bg-green-600:hover {
  background-position: 100% 100%;
}

/* ========== 加载动画增强 ========== */
.animate-spin {
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ========== 雷达图修复 ========== */
/* 修复雷达图不显示的问题 */
svg {
  display: block;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

polygon {
  fill: rgba(76, 175, 80, 0.6);
  stroke: #4CAF50;
  stroke-width: 2;
  stroke-linejoin: round;
}

text {
  font-size: 14px;
  fill: #334155;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

circle {
  fill: #3b82f6;
}

/* ========== 响应式调整 ========== */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .p-8 {
    padding: 1.5rem;
  }
  
  .text-5xl {
    font-size: 2.5rem;
  }
  
  .text-3xl {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .grid-cols-1.md\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .flex.space-x-4 {
    flex-direction: column;
    gap: 12px;
  }
  
  button {
    width: 100%;
  }
  
  .text-4xl {
    font-size: 1.75rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  video {
    max-width: 100%;
  }
}

/* ========== 卡片标题样式 ========== */
h2.text-3xl.font-bold {
  position: relative;
  padding-bottom: 0.5rem;
}

h2.text-3xl.font-bold::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

/* ========== 按钮图标样式 ========== */
button svg {
  transition: transform 0.3s ease;
}

button:hover svg {
  transform: scale(1.1);
}

/* ========== 进度指示器 ========== */
p.text-lg.font-medium {
  position: relative;
  display: inline-block;
  padding-left: 2rem;
}

p.text-lg.font-medium::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}
</style>
