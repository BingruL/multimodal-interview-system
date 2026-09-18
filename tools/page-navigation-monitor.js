// 页面跳转监控脚本
console.log('=== 页面跳转监控脚本已启动 ===');

// 监控状态
const navigationMonitor = {
  startTime: Date.now(),
  currentPage: null,
  pageHistory: [],
  events: [],
  errors: [],
  isMonitoring: false
};

// 页面跳转历史记录
class PageNavigationRecord {
  constructor(fromPage, toPage, timestamp, trigger, data = null) {
    this.fromPage = fromPage;
    this.toPage = toPage;
    this.timestamp = timestamp;
    this.trigger = trigger; // 'user', 'event', 'programmatic', 'error'
    this.data = data;
    this.duration = 0;
    this.success = false;
    this.error = null;
  }
}

// 事件记录
class EventRecord {
  constructor(type, data, timestamp, source) {
    this.type = type;
    this.data = data;
    this.timestamp = timestamp;
    this.source = source;
  }
}

// 开始监控
function startNavigationMonitoring() {
  if (navigationMonitor.isMonitoring) {
    console.log('页面跳转监控已在运行中');
    return;
  }
  
  navigationMonitor.isMonitoring = true;
  console.log('开始页面跳转监控...');
  
  // 监控Vue应用实例
  monitorVueApp();
  
  // 监控页面状态变化
  monitorPageStateChanges();
  
  // 监控事件系统
  monitorEventSystem();
  
  // 监控DOM变化
  monitorDOMChanges();
  
  // 监控错误
  monitorErrors();
  
  console.log('页面跳转监控已启动');
}

// 监控Vue应用
function monitorVueApp() {
  console.log('监控Vue应用...');
  
  // 检查Vue应用实例
  if (window.__VUE_APP__) {
    console.log('✅ 找到Vue应用实例');
    navigationMonitor.events.push(new EventRecord('vue_app_found', null, Date.now(), 'monitor'));
  } else {
    console.log('❌ 未找到Vue应用实例');
    navigationMonitor.events.push(new EventRecord('vue_app_not_found', null, Date.now(), 'monitor'));
  }
  
  // 监控全局变量
  if (window.currentPage) {
    console.log('✅ 找到currentPage全局变量');
    const originalValue = window.currentPage.value;
    navigationMonitor.currentPage = originalValue;
    
    // 代理currentPage的变化
    const originalSet = window.currentPage.set;
    window.currentPage.set = function(value) {
      const oldValue = window.currentPage.value;
      console.log(`🔄 currentPage变化: ${oldValue} -> ${value}`);
      
      // 记录页面跳转
      const record = new PageNavigationRecord(
        oldValue, 
        value, 
        Date.now(), 
        'programmatic'
      );
      navigationMonitor.pageHistory.push(record);
      
      // 调用原始setter
      originalSet.call(this, value);
      
      // 延迟检查跳转是否成功
      setTimeout(() => {
        const actualValue = window.currentPage.value;
        record.success = actualValue === value;
        record.duration = Date.now() - record.timestamp;
        
        if (record.success) {
          console.log(`✅ 页面跳转成功: ${oldValue} -> ${value}`);
        } else {
          console.log(`❌ 页面跳转失败: ${oldValue} -> ${value}, 实际值: ${actualValue}`);
          record.error = `期望值: ${value}, 实际值: ${actualValue}`;
        }
      }, 100);
    };
    
    navigationMonitor.events.push(new EventRecord('currentPage_monitored', originalValue, Date.now(), 'monitor'));
  } else {
    console.log('❌ 未找到currentPage全局变量');
    navigationMonitor.events.push(new EventRecord('currentPage_not_found', null, Date.now(), 'monitor'));
  }
}

// 监控页面状态变化
function monitorPageStateChanges() {
  console.log('监控页面状态变化...');
  
  // 监控调试信息元素
  const debugElement = document.querySelector('[style*="position: fixed; top: 10px; right: 10px"]');
  if (debugElement) {
    console.log('✅ 找到页面状态调试元素');
    
    // 监控调试信息变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const newPage = debugElement.textContent.replace('当前页面: ', '').trim();
          if (newPage !== navigationMonitor.currentPage) {
            console.log(`🔄 调试信息显示页面变化: ${navigationMonitor.currentPage} -> ${newPage}`);
            navigationMonitor.currentPage = newPage;
            
            navigationMonitor.events.push(new EventRecord('debug_element_changed', {
              oldPage: navigationMonitor.currentPage,
              newPage: newPage
            }, Date.now(), 'debug_element'));
          }
        }
      });
    });
    
    observer.observe(debugElement, {
      childList: true,
      characterData: true,
      subtree: true
    });
    
    navigationMonitor.events.push(new EventRecord('debug_element_monitored', debugElement.textContent, Date.now(), 'monitor'));
  } else {
    console.log('❌ 未找到页面状态调试元素');
    navigationMonitor.events.push(new EventRecord('debug_element_not_found', null, Date.now(), 'monitor'));
  }
}

// 监控事件系统
function monitorEventSystem() {
  console.log('监控事件系统...');
  
  // 监控analysis-complete事件
  const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
  EventTarget.prototype.dispatchEvent = function(event) {
    if (event.type === 'analysis-complete') {
      console.log('📡 检测到analysis-complete事件发送');
      console.log('事件详情:', {
        type: event.type,
        detail: event.detail,
        target: event.target,
        timestamp: Date.now()
      });
      
      navigationMonitor.events.push(new EventRecord('analysis_complete_sent', event.detail, Date.now(), 'event_system'));
    }
    
    // 调用原始方法
    return originalDispatchEvent.call(this, event);
  };
  
  // 监控Vue事件
  if (window.__VUE_APP__) {
    const app = window.__VUE_APP__;
    if (app.config && app.config.globalProperties) {
      console.log('✅ 监控Vue全局事件');
    }
  }
}

// 监控DOM变化
function monitorDOMChanges() {
  console.log('监控DOM变化...');
  
  // 监控组件渲染
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查是否是新组件渲染
            const componentSelectors = [
              '[data-component="home"]',
              '[data-component="interview"]',
              '[data-component="report"]',
              '[data-component="recommendations"]'
            ];
            
            componentSelectors.forEach(selector => {
              if (node.matches && node.matches(selector) || node.querySelector && node.querySelector(selector)) {
                const componentName = selector.replace('[data-component="', '').replace('"]', '');
                console.log(`🎯 检测到组件渲染: ${componentName}`);
                
                navigationMonitor.events.push(new EventRecord('component_rendered', {
                  component: componentName,
                  element: node
                }, Date.now(), 'dom_observer'));
              }
            });
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  navigationMonitor.events.push(new EventRecord('dom_monitoring_started', null, Date.now(), 'monitor'));
}

// 监控错误
function monitorErrors() {
  console.log('监控错误...');
  
  // 监控JavaScript错误
  window.addEventListener('error', (event) => {
    console.log('❌ JavaScript错误:', event.error);
    navigationMonitor.errors.push({
      type: 'javascript_error',
      error: event.error,
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: Date.now()
    });
  });
  
  // 监控Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    console.log('❌ Promise错误:', event.reason);
    navigationMonitor.errors.push({
      type: 'promise_error',
      error: event.reason,
      timestamp: Date.now()
    });
  });
  
  navigationMonitor.events.push(new EventRecord('error_monitoring_started', null, Date.now(), 'monitor'));
}

// 获取监控报告
function getNavigationReport() {
  const report = {
    monitoringDuration: Date.now() - navigationMonitor.startTime,
    currentPage: navigationMonitor.currentPage,
    pageHistory: navigationMonitor.pageHistory,
    events: navigationMonitor.events,
    errors: navigationMonitor.errors,
    summary: {
      totalPageChanges: navigationMonitor.pageHistory.length,
      successfulChanges: navigationMonitor.pageHistory.filter(r => r.success).length,
      failedChanges: navigationMonitor.pageHistory.filter(r => !r.success).length,
      totalEvents: navigationMonitor.events.length,
      totalErrors: navigationMonitor.errors.length
    }
  };
  
  console.log('=== 页面跳转监控报告 ===');
  console.log('监控时长:', Math.round(report.monitoringDuration / 1000), '秒');
  console.log('当前页面:', report.currentPage);
  console.log('页面变化总数:', report.summary.totalPageChanges);
  console.log('成功跳转:', report.summary.successfulChanges);
  console.log('失败跳转:', report.summary.failedChanges);
  console.log('事件总数:', report.summary.totalEvents);
  console.log('错误总数:', report.summary.totalErrors);
  
  // 显示失败的跳转
  const failedChanges = report.pageHistory.filter(r => !r.success);
  if (failedChanges.length > 0) {
    console.log('❌ 失败的页面跳转:');
    failedChanges.forEach((change, index) => {
      console.log(`  ${index + 1}. ${change.fromPage} -> ${change.toPage} (${change.error})`);
    });
  }
  
  // 显示最近的页面历史
  console.log('📋 最近的页面历史:');
  report.pageHistory.slice(-5).forEach((change, index) => {
    const status = change.success ? '✅' : '❌';
    console.log(`  ${status} ${change.fromPage} -> ${change.toPage} (${change.trigger})`);
  });
  
  return report;
}

// 实时监控状态
function showRealTimeStatus() {
  const status = {
    currentPage: navigationMonitor.currentPage,
    isMonitoring: navigationMonitor.isMonitoring,
    totalEvents: navigationMonitor.events.length,
    totalErrors: navigationMonitor.errors.length,
    lastPageChange: navigationMonitor.pageHistory.length > 0 ? 
      navigationMonitor.pageHistory[navigationMonitor.pageHistory.length - 1] : null
  };
  
  console.log('=== 实时监控状态 ===');
  console.log('监控状态:', status.isMonitoring ? '✅ 运行中' : '❌ 已停止');
  console.log('当前页面:', status.currentPage || '未知');
  console.log('事件总数:', status.totalEvents);
  console.log('错误总数:', status.totalErrors);
  
  if (status.lastPageChange) {
    const change = status.lastPageChange;
    const statusIcon = change.success ? '✅' : '❌';
    console.log('最后页面变化:', `${statusIcon} ${change.fromPage} -> ${change.toPage}`);
  }
  
  return status;
}

// 停止监控
function stopNavigationMonitoring() {
  navigationMonitor.isMonitoring = false;
  console.log('页面跳转监控已停止');
}

// 清除监控数据
function clearNavigationData() {
  navigationMonitor.pageHistory = [];
  navigationMonitor.events = [];
  navigationMonitor.errors = [];
  console.log('监控数据已清除');
}

// 导出监控函数
window.navigationMonitor = {
  start: startNavigationMonitoring,
  stop: stopNavigationMonitoring,
  report: getNavigationReport,
  status: showRealTimeStatus,
  clear: clearNavigationData,
  data: navigationMonitor
};

console.log('页面跳转监控脚本已加载，可以使用以下命令:');
console.log('- navigationMonitor.start() - 开始监控');
console.log('- navigationMonitor.stop() - 停止监控');
console.log('- navigationMonitor.report() - 获取监控报告');
console.log('- navigationMonitor.status() - 显示实时状态');
console.log('- navigationMonitor.clear() - 清除监控数据'); 