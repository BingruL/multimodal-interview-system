<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-teal-100 p-4">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl text-center">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-6 font-inter">模拟面试进行中</h1>
      <p class="text-xl text-gray-600 mb-8 font-inter">
        领域: <span class="font-semibold text-teal-600">{{ selectedDomainName }}</span> - 岗位: <span class="font-semibold text-teal-600">{{ selectedRole }}</span>
      </p>

      <div class="bg-gray-50 p-6 rounded-lg shadow-inner mb-8 text-left">
        <p class="text-lg font-medium text-gray-700 mb-4 font-inter">
          问题 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}:
        </p>
        <p class="text-2xl text-gray-900 leading-relaxed font-inter">
          {{ currentQuestion }}
        </p>
        <p v-if="isAiThinking" class="text-blue-500 mt-2 flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          AI思考中...
        </p>
      </div>

      <div class="flex flex-col items-center mb-8">
        <video :ref="videoRef" autoplay muted class="w-full max-w-sm rounded-lg shadow-md mb-4 bg-gray-200"></video>
        <div class="flex space-x-4 mb-4">
          <button
            @click="isRecordingVideo ? emits('stop-video-recording') : emits('start-video-recording')"
            :class="['flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold transition-all duration-300', isRecordingVideo ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600']"
          >
            <VideoIcon class="mr-2" />
            {{ isRecordingVideo ? '停止录像' : '开始录像' }}
          </button>
          <button
            @click="isRecordingAudio ? emits('stop-audio-recording') : emits('start-audio-recording')"
            :class="['flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold transition-all duration-300', isRecordingAudio ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600']"
          >
            <MicIcon class="mr-2" />
            {{ isRecordingAudio ? '停止录音' : '开始录音' }}
          </button>
        </div>
      </div>

      <textarea
        :value="userAnswer"
        @input="emits('update:user-answer', $event.target.value)"
        class="w-full p-4 border border-gray-300 rounded-lg mb-6 text-lg font-inter focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
        rows="6"
        placeholder="请在此输入您的回答..."
      ></textarea>

      <button
        @click="emits('next-question')"
        :disabled="isLoading || isAiThinking"
        class="flex items-center justify-center mx-auto bg-green-600 text-white py-4 px-8 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 font-inter text-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="isLoading || isAiThinking" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <SendIcon v-else class="mr-2" />
        {{ (currentQuestionIndex + 1 === totalQuestions && !aiGeneratedQuestion) ? '结束面试并生成报告' : '提交回答，下一题 ✨' }}
      </button>

      <button
        @click="emits('go-home')"
        class="mt-4 flex items-center justify-center mx-auto bg-gray-400 text-white py-2 px-6 rounded-full shadow hover:bg-gray-500 transition-all duration-300 font-inter"
      >
        <HomeIcon class="mr-2" />
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { MicIcon, VideoIcon, SendIcon, HomeIcon } from './Icons.js'; // 导入图标组件

const props = defineProps({
  selectedDomainName: String,
  selectedRole: String,
  currentQuestionIndex: Number,
  totalQuestions: Number,
  currentQuestion: String,
  isAiThinking: Boolean,
  isLoading: Boolean,
  aiGeneratedQuestion: String,
  userAnswer: String, // Prop for v-model in textarea
  isRecordingAudio: Boolean,
  isRecordingVideo: Boolean,
  videoRef: Object, // Ref for video element
});

const emits = defineEmits([
  'next-question',
  'go-home',
  'update:user-answer',
  'start-video-recording',
  'stop-video-recording',
  'start-audio-recording',
  'stop-audio-recording',
]);
</script>

<style scoped>
/* Interview.vue 专属样式 */
</style>