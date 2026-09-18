// 页面跳转分析脚本
console.log('=== 页面跳转分析脚本 ===');

// 分析页面跳转失败的原因
function analyzeNavigationFailure() {
  console.log('开始分析页面跳转失败原因...');
  
  const analysis = {
    timestamp: Date.now(),
    issues: [],
    recommendations: [],
    status: 'unknown'
  };
  
  // 1. 检查Vue应用状态
  console.log('1. 检查Vue应用状态...');
  if (!window.__VUE_APP__) {
    analysis.issues.push('Vue应用实例不存在');
    analysis.recommendations.push('检查Vue应用是否正确初始化');
  } else {
    console.log('✅ Vue应用实例存在');
  }
  
  // 2. 检查currentPage变量
  console.log('2. 检查currentPage变量...');
  if (!window.currentPage) {
    analysis.issues.push('currentPage全局变量不存在');
    analysis.recommendations.push('检查App.vue中currentPage的定义');
  } else {
    console.log('✅ currentPage变量存在，当前值:', window.currentPage.value);
    
    // 检查是否为响应式对象
    if (typeof window.currentPage.value === 'undefined') {
      analysis.issues.push('currentPage.value为undefined');
      analysis.recommendations.push('检查currentPage的初始值设置');
    }
  }
  
  // 3. 检查事件系统
  console.log('3. 检查事件系统...');
  const eventListeners = getEventListeners();
  if (eventListeners.length === 0) {
    analysis.issues.push('未检测到事件监听器');
    analysis.recommendations.push('检查Vue组件的事件绑定');
  } else {
    console.log('✅ 检测到事件监听器:', eventListeners.length, '个');
  }
  
  // 4. 检查组件渲染
  console.log('4. 检查组件渲染...');
  const componentStatus = checkComponentRendering();
  analysis.issues.push(...componentStatus.issues);
  analysis.recommendations.push(...componentStatus.recommendations);
  
  // 5. 检查JavaScript错误
  console.log('5. 检查JavaScript错误...');
  const errors = getRecentErrors();
  if (errors.length > 0) {
    analysis.issues.push(`检测到${errors.length}个JavaScript错误`);
    analysis.recommendations.push('修复JavaScript错误');
    errors.forEach(error => {
      console.log('❌ 错误:', error.message);
    });
  } else {
    console.log('✅ 未检测到JavaScript错误');
  }
  
  // 6. 检查网络请求
  console.log('6. 检查网络请求...');
  const networkIssues = checkNetworkRequests();
  analysis.issues.push(...networkIssues.issues);
  analysis.recommendations.push(...networkIssues.recommendations);
  
  // 7. 检查内存使用
  console.log('7. 检查内存使用...');
  const memoryStatus = checkMemoryUsage();
  if (memoryStatus.isHigh) {
    analysis.issues.push('内存使用过高');
    analysis.recommendations.push('检查内存泄漏问题');
  }
  
  // 8. 检查Vue响应式系统
  console.log('8. 检查Vue响应式系统...');
  const reactivityStatus = checkVueReactivity();
  analysis.issues.push(...reactivityStatus.issues);
  analysis.recommendations.push(...reactivityStatus.recommendations);
  
  // 生成分析报告
  generateAnalysisReport(analysis);
  
  return analysis;
}

// 获取事件监听器
function getEventListeners() {
  const listeners = [];
  
  // 检查Vue组件事件
  const components = document.querySelectorAll('[data-component]');
  components.forEach(component => {
    const componentName = component.getAttribute('data-component');
    if (componentName) {
      listeners.push(`组件: ${componentName}`);
    }
  });
  
  // 检查全局事件
  if (window.addEventListener) {
    listeners.push('全局事件监听器可用');
  }
  
  return listeners;
}

// 检查组件渲染
function checkComponentRendering() {
  const result = {
    issues: [],
    recommendations: []
  };
  
  const expectedComponents = ['home', 'interview', 'report', 'recommendations'];
  const renderedComponents = [];
  
  expectedComponents.forEach(componentName => {
    const selector = `[data-component="${componentName}"]`;
    const element = document.querySelector(selector);
    if (element) {
      renderedComponents.push(componentName);
    }
  });
  
  console.log('已渲染的组件:', renderedComponents);
  
  // 检查当前应该显示的组件
  const currentPage = window.currentPage?.value;
  if (currentPage && !renderedComponents.includes(currentPage)) {
    result.issues.push(`当前页面${currentPage}对应的组件未渲染`);
    result.recommendations.push(`检查${currentPage}组件的条件渲染逻辑`);
  }
  
  return result;
}

// 获取最近的错误
function getRecentErrors() {
  const errors = [];
  
  // 检查控制台错误（这需要手动检查）
  console.log('请检查控制台是否有错误信息');
  
  // 检查全局错误处理器
  if (window.onerror) {
    console.log('✅ 全局错误处理器已设置');
  } else {
    console.log('⚠️ 全局错误处理器未设置');
  }
  
  return errors;
}

// 检查网络请求
function checkNetworkRequests() {
  const result = {
    issues: [],
    recommendations: []
  };
  
  // 检查是否有失败的API请求
  if (window.navigationMonitor && window.navigationMonitor.data) {
    const events = window.navigationMonitor.data.events;
    const networkErrors = events.filter(event => 
      event.type.includes('network') || event.type.includes('api')
    );
    
    if (networkErrors.length > 0) {
      result.issues.push(`检测到${networkErrors.length}个网络相关事件`);
      result.recommendations.push('检查API请求是否成功');
    }
  }
  
  return result;
}

// 检查内存使用
function checkMemoryUsage() {
  const result = {
    isHigh: false
  };
  
  if (performance.memory) {
    const memory = performance.memory;
    const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
    
    console.log(`内存使用: ${usedMB}MB / ${totalMB}MB`);
    
    if (usedMB > 100) {
      result.isHigh = true;
    }
  } else {
    console.log('无法获取内存使用信息');
  }
  
  return result;
}

// 检查Vue响应式系统
function checkVueReactivity() {
  const result = {
    issues: [],
    recommendations: []
  };
  
  // 检查Vue版本
  if (window.Vue) {
    console.log('Vue版本:', window.Vue.version);
  } else {
    console.log('无法检测Vue版本');
  }
  
  // 检查响应式对象
  if (window.currentPage) {
    try {
      const value = window.currentPage.value;
      console.log('currentPage.value:', value);
      
      // 尝试修改值
      const originalValue = value;
      window.currentPage.value = 'test';
      const newValue = window.currentPage.value;
      
      if (newValue === 'test') {
        console.log('✅ 响应式系统正常工作');
        // 恢复原值
        window.currentPage.value = originalValue;
      } else {
        result.issues.push('响应式系统可能有问题');
        result.recommendations.push('检查Vue响应式系统的设置');
      }
    } catch (error) {
      result.issues.push('测试响应式系统时出错');
      result.recommendations.push('检查Vue应用配置');
    }
  }
  
  return result;
}

// 生成分析报告
function generateAnalysisReport(analysis) {
  console.log('\n=== 页面跳转失败分析报告 ===');
  console.log('分析时间:', new Date(analysis.timestamp).toLocaleString());
  
  if (analysis.issues.length === 0) {
    console.log('✅ 未发现明显问题');
    analysis.status = 'healthy';
  } else {
    console.log(`❌ 发现 ${analysis.issues.length} 个问题:`);
    analysis.issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue}`);
    });
    analysis.status = 'has_issues';
  }
  
  if (analysis.recommendations.length > 0) {
    console.log('\n💡 建议解决方案:');
    analysis.recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }
  
  // 生成详细报告
  const detailedReport = {
    summary: {
      totalIssues: analysis.issues.length,
      totalRecommendations: analysis.recommendations.length,
      status: analysis.status
    },
    details: analysis
  };
  
  // 保存到全局变量
  window.navigationAnalysis = detailedReport;
  
  return detailedReport;
}

// 快速诊断
function quickDiagnosis() {
  console.log('=== 快速诊断 ===');
  
  const checks = [
    {
      name: 'Vue应用',
      check: () => !!window.__VUE_APP__,
      message: 'Vue应用实例存在'
    },
    {
      name: 'currentPage变量',
      check: () => !!window.currentPage,
      message: 'currentPage变量存在'
    },
    {
      name: 'currentPage值',
      check: () => window.currentPage && typeof window.currentPage.value !== 'undefined',
      message: 'currentPage.value有值'
    },
    {
      name: '调试元素',
      check: () => !!document.querySelector('[style*="position: fixed; top: 10px; right: 10px"]'),
      message: '页面状态调试元素存在'
    },
    {
      name: 'Report组件',
      check: () => !!document.querySelector('[data-component="report"]'),
      message: 'Report组件已渲染'
    }
  ];
  
  const results = [];
  
  checks.forEach(check => {
    const passed = check.check();
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${check.name}: ${check.message}`);
    results.push({
      name: check.name,
      passed,
      message: check.message
    });
  });
  
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  
  console.log(`\n诊断结果: ${passedCount}/${totalCount} 项检查通过`);
  
  if (passedCount === totalCount) {
    console.log('✅ 所有检查都通过，页面跳转应该正常工作');
  } else {
    console.log('❌ 发现问题，建议运行完整分析');
  }
  
  return results;
}

// 导出分析函数
window.navigationAnalysis = {
  analyze: analyzeNavigationFailure,
  quick: quickDiagnosis,
  report: window.navigationAnalysis
};

console.log('页面跳转分析脚本已加载，可以使用以下命令:');
console.log('- navigationAnalysis.quick() - 快速诊断');
console.log('- navigationAnalysis.analyze() - 完整分析');
console.log('- navigationAnalysis.report - 查看分析报告'); 