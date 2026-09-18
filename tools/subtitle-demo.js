// 字幕功能演示脚本
console.log('=== 字幕功能演示 ===');

// 模拟字幕状态
const subtitleState = {
  enabled: true,
  history: [],
  current: '',
  loading: false
};

// 模拟字幕功能
class SubtitleManager {
  constructor() {
    this.history = [];
    this.current = '';
    this.loading = false;
    this.enabled = true;
  }

  // 添加字幕
  addSubtitle(text, user = 'AI', isComplete = false) {
    if (!this.enabled) {
      console.log('字幕功能已关闭');
      return;
    }

    const timestamp = new Date().toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });

    if (isComplete) {
      // 完成一句话，添加到历史记录
      this.history.push({
        id: Date.now(),
        text,
        user,
        timestamp,
        isComplete: true
      });
      this.current = '';
      console.log(`✅ 完成字幕: [${user}] ${text} (${timestamp})`);
    } else {
      // 实时更新当前字幕
      this.current = text;
      this.loading = true;
      console.log(`🔄 实时字幕: [${user}] ${text}...`);
    }
  }

  // 完成当前字幕
  completeSubtitle() {
    if (this.current) {
      this.addSubtitle(this.current, 'AI', true);
      this.loading = false;
    }
  }

  // 清空历史
  clearHistory() {
    this.history = [];
    this.current = '';
    this.loading = false;
    console.log('🗑️ 字幕历史已清空');
  }

  // 切换字幕开关
  toggleSubtitle() {
    this.enabled = !this.enabled;
    console.log(`字幕功能: ${this.enabled ? '开启' : '关闭'}`);
  }

  // 显示状态
  showStatus() {
    console.log('📊 字幕状态:');
    console.log(`  启用状态: ${this.enabled}`);
    console.log(`  历史记录数: ${this.history.length}`);
    console.log(`  当前字幕: ${this.current || '无'}`);
    console.log(`  加载状态: ${this.loading}`);
  }
}

// 演示字幕功能
async function demoSubtitle() {
  console.log('\n--- 开始字幕功能演示 ---');
  
  const subtitle = new SubtitleManager();
  
  // 显示初始状态
  subtitle.showStatus();
  
  // 添加一些测试字幕
  console.log('\n1. 添加完成字幕:');
  subtitle.addSubtitle('您好，我是AI面试官，很高兴见到您。', 'AI', true);
  subtitle.addSubtitle('您好，我是应聘者，很高兴参加面试。', 'User', true);
  
  console.log('\n2. 添加实时字幕:');
  subtitle.addSubtitle('请简单介绍一下您的技术背景', 'AI', false);
  
  // 模拟实时字幕更新
  setTimeout(() => {
    subtitle.addSubtitle('请简单介绍一下您的技术背景和工作经验', 'AI', false);
  }, 1000);
  
  setTimeout(() => {
    subtitle.addSubtitle('请简单介绍一下您的技术背景和工作经验，以及主要使用的技术栈', 'AI', false);
  }, 2000);
  
  setTimeout(() => {
    subtitle.completeSubtitle();
  }, 3000);
  
  // 显示最终状态
  setTimeout(() => {
    console.log('\n3. 最终状态:');
    subtitle.showStatus();
    
    console.log('\n4. 测试字幕开关:');
    subtitle.toggleSubtitle();
    subtitle.addSubtitle('这条字幕不会显示', 'AI', true);
    subtitle.toggleSubtitle();
    
    console.log('\n5. 清空历史:');
    subtitle.clearHistory();
    subtitle.showStatus();
    
    console.log('\n=== 字幕功能演示完成 ===');
  }, 4000);
}

// 运行演示
demoSubtitle(); 