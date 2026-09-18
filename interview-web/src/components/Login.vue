<template>
  <div class="login-container">
    <div class="background-gradient"></div>
    
    <div class="login-form">
      <h2>{{ isRegisterMode ? '注册账户' : '用户登录' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <span class="icon">👤</span>
          <input 
            type="text" 
            v-model="formData.username" 
            placeholder="用户名" 
            required
          />
        </div>
        
        <div class="input-group">
          <span class="icon">🔒</span>
          <input 
            type="password" 
            v-model="formData.password" 
            placeholder="密码" 
            required
          />
        </div>
        
        <div v-if="isRegisterMode" class="input-group">
          <span class="icon">🔒</span>
          <input 
            type="password" 
            v-model="formData.confirmPassword" 
            placeholder="确认密码" 
            required
          />
        </div>
        
        <div v-if="isRegisterMode" class="input-group">
          <span class="icon">📧</span>
          <input 
            type="email" 
            v-model="formData.email" 
            placeholder="邮箱地址" 
            required
          />
        </div>
        
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '处理中...' : (isRegisterMode ? '注册' : '登录') }}
        </button>
      </form>
      
      <div class="switch-mode">
        <span>{{ isRegisterMode ? '已有账户？' : '还没有账户？' }}</span>
        <a @click="toggleMode" href="#">
          {{ isRegisterMode ? '立即登录' : '立即注册' }}
        </a>
      </div>
      
      <div class="guest-login">
        <button @click="handleGuestLogin" class="guest-btn" :disabled="isLoading">
          游客体验
        </button>
      </div>
      
      <p class="copyright">
        © 2024 AI面试官系统. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { message } from 'ant-design-vue';

const emits = defineEmits(['login-success']);

const isRegisterMode = ref(false);
const isLoading = ref(false);

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: ''
});

// 切换登录/注册模式
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  // 清空表单
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  };
};

// 处理表单提交
const handleSubmit = async () => {
  if (isLoading.value) return;
  
  // 表单验证
  if (!formData.value.username || !formData.value.password) {
    message.error('请填写用户名和密码');
    return;
  }
  
  if (isRegisterMode.value) {
    if (formData.value.password !== formData.value.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    if (!formData.value.email) {
      message.error('请填写邮箱地址');
      return;
    }
  }
  
  isLoading.value = true;
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (isRegisterMode.value) {
      // 注册逻辑
      message.success('注册成功！请登录');
      toggleMode();
    } else {
      // 登录逻辑
      const userData = {
        username: formData.value.username,
        userId: 'user_' + Date.now(),
        loginTime: new Date().toISOString()
      };
      
      message.success('登录成功！');
      emits('login-success', userData);
    }
  } catch (error) {
    message.error(isRegisterMode.value ? '注册失败，请重试' : '登录失败，请检查用户名和密码');
  } finally {
    isLoading.value = false;
  }
};

// 游客登录
const handleGuestLogin = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const guestData = {
      username: '游客用户',
      userId: 'guest_' + Date.now(),
      loginTime: new Date().toISOString(),
      isGuest: true
    };
    
    message.success('游客登录成功！');
    emits('login-success', guestData);
  } catch (error) {
    message.error('游客登录失败，请重试');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 基本布局 */
.login-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: hidden;
}

/* 背景渐变 */
.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: -1;
}

/* 登录表单容器 (毛玻璃效果) */
.login-form {
  padding: 40px;
  width: 380px;
  
  /* 核心：毛玻璃效果 */
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

/* 标题样式 */
.login-form h2 {
  color: #fff;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 35px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* 输入组样式 */
.input-group {
  position: relative;
  margin-bottom: 25px;
}

.input-group .icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
}

.input-group input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.input-group input:focus {
  border-color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.3);
}

/* 按钮样式 */
button {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  background: linear-gradient(90deg, #a062f5, #673ab7);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 游客登录按钮 */
.guest-btn {
  background: linear-gradient(90deg, #4CAF50, #45a049);
  margin-bottom: 20px;
}

.guest-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #45a049, #3d8b40);
}

/* 模式切换 */
.switch-mode {
  text-align: center;
  margin: 20px 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.switch-mode a {
  color: #a062f5;
  text-decoration: none;
  font-weight: bold;
  margin-left: 5px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.switch-mode a:hover {
  color: #fff;
}

/* 游客登录区域 */
.guest-login {
  margin: 20px 0;
  text-align: center;
}

/* 版权信息 */
.copyright {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-form {
    width: 90%;
    padding: 30px 20px;
  }
  
  .login-form h2 {
    font-size: 20px;
    margin-bottom: 25px;
  }
  
  .input-group input {
    padding: 12px 12px 12px 40px;
    font-size: 14px;
  }
  
  button {
    padding: 12px;
    font-size: 16px;
  }
}
</style>