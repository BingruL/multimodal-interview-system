// RTC消息解析测试脚本
console.log('=== RTC消息解析测试 ===');

// 模拟RTC消息解析函数
const parseRTCMessage = (messageText) => {
  console.log('开始解析RTC消息:', messageText);
  
  // 1. 尝试标准JSON解析
  try {
    const jsonData = JSON.parse(messageText);
    console.log('标准JSON解析成功:', jsonData);
    return jsonData;
  } catch (jsonError) {
    console.log('标准JSON解析失败:', jsonError.message);
  }
  
  // 2. 处理特殊格式消息
  if (messageText.startsWith('subv')) {
    console.log('检测到字幕格式消息');
    
    // 匹配 subv{内容} 格式（可能包含特殊字符）
    const subtitleMatch = messageText.match(/subv\s*\{([\s\S]*)\}/);
    if (subtitleMatch) {
      const content = subtitleMatch[1];
      console.log('提取的字幕内容:', content);
      
      // 尝试解析字幕内容
      try {
        const subtitleData = JSON.parse(content);
        console.log('字幕数据解析成功:', subtitleData);
        return subtitleData;
      } catch (subtitleError) {
        console.log('字幕内容JSON解析失败，使用原始内容:', subtitleError.message);
        return { 
          type: 'subv', 
          data: [{ 
            text: content, 
            definite: true, 
            userId: 'AI' 
          }] 
        };
      }
    }
  }
  
  // 3. 处理conv格式消息
  if (messageText.startsWith('conv')) {
    console.log('检测到对话格式消息');
    
    // 匹配 conv{内容} 格式
    const convMatch = messageText.match(/conv\s*\{([\s\S]*)\}/);
    if (convMatch) {
      const content = convMatch[1];
      console.log('提取的对话内容:', content);
      
      try {
        const convData = JSON.parse(content);
        console.log('对话数据解析成功:', convData);
        return convData;
      } catch (convError) {
        console.log('对话内容JSON解析失败:', convError.message);
        return { 
          type: 'conv', 
          content: content
        };
      }
    }
  }
  
  // 4. 处理其他格式
  if (messageText.includes('{') && messageText.includes('}')) {
    // 尝试提取JSON部分
    const jsonMatch = messageText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[0]);
        console.log('提取的JSON数据:', jsonData);
        return jsonData;
      } catch (extractError) {
        console.log('提取的JSON解析失败:', extractError.message);
      }
    }
  }
  
  // 5. 使用原始文本
  console.log('使用原始文本作为消息');
  return { 
    type: 'unknown', 
    text: messageText,
    definite: true,
    userId: 'AI'
  };
};

// Unicode解码函数
const decodeUnicode = (text) => {
  try {
    if (text.includes('\\u')) {
      return JSON.parse('"' + text + '"');
    }
    return text;
  } catch (error) {
    console.log('Unicode解码失败:', error.message);
    return text;
  }
};

// 测试用例 - 基于实际消息格式
const testCases = [
  // 用户字幕消息
  'subv{ "data" : [ { "definite" : false, "language" : "", "mode" : 0, "paragraph" : false, "roundId" : 3, "sequence" : 18, "text" : "\\u592a\\u957f", "timestamp" : 1751701658351, "userId" : "user1" } ], "type" : "subtitle" }',
  
  // AI字幕消息
  'subv{ "data" : [ { "definite" : false, "language" : "zh", "mode" : 1, "paragraph" : false, "roundId" : 3, "sequence" : 18, "text" : "\\u54c8", "timestamp" : 1751701662601, "userId" : "ChatBot01" } ], "type" : "subtitle" }',
  
  // 确定的AI字幕
  'subv{ "data" : [ { "definite" : true, "language" : "zh", "mode" : 1, "paragraph" : true, "roundId" : 3, "sequence" : 24, "text" : "\\u54c8\\u55bd\\uff5e\\u5c0f\\u5b81\\u5728\\u7ebf\\uff01", "timestamp" : 1751701663901, "userId" : "ChatBot01" } ], "type" : "subtitle" }',
  
  // 对话状态消息
  'conv{ "EventTime" : 1751701658826, "RoundID" : 3, "Stage" : { "Code" : 2, "Description" : "thinking" }, "TaskId" : "Huoshan01", "UserID" : "user1" }',
  
  // 标准JSON格式
  '{"type":"subv","data":[{"text":"您好，我是AI面试官","definite":true,"userId":"AI"}]}',
  
  // 纯文本内容
  'subv{这是纯文本内容，没有JSON格式}',
  
  // 完全无效的格式
  'invalid message format',
  
  // 空消息
  '',
  
  // 只有空格
  '   '
];

// 执行测试
console.log('\n--- 开始测试各种消息格式 ---\n');

testCases.forEach((testCase, index) => {
  console.log(`\n测试用例 ${index + 1}:`);
  console.log('输入:', testCase);
  
  try {
    const result = parseRTCMessage(testCase);
    console.log('解析结果:', result);
    
    // 验证结果
    if (result && (result.text || (result.data && result.data.length > 0))) {
      console.log('✅ 解析成功');
      
      // 如果是字幕数据，测试Unicode解码
      if (result.data && result.data.length > 0) {
        const subtitleData = result.data[0];
        if (subtitleData.text) {
          const decodedText = decodeUnicode(subtitleData.text);
          console.log('  原始文本:', subtitleData.text);
          console.log('  解码文本:', decodedText);
          console.log('  说话者:', subtitleData.userId);
          console.log('  是否确定:', subtitleData.definite);
        }
      }
    } else {
      console.log('⚠️ 解析结果可能为空');
    }
  } catch (error) {
    console.log('❌ 解析失败:', error.message);
  }
  
  console.log('---');
});

// 模拟实际RTC消息处理
console.log('\n--- 模拟实际RTC消息处理 ---\n');

const mockRTCMessages = [
  'subv{ "data" : [ { "definite" : false, "language" : "", "mode" : 0, "paragraph" : false, "roundId" : 3, "sequence" : 18, "text" : "\\u592a\\u957f", "timestamp" : 1751701658351, "userId" : "user1" } ], "type" : "subtitle" }',
  'subv{ "data" : [ { "definite" : true, "language" : "zh", "mode" : 1, "paragraph" : true, "roundId" : 3, "sequence" : 24, "text" : "\\u54c8\\u55bd\\uff5e\\u5c0f\\u5b81\\u5728\\u7ebf\\uff01", "timestamp" : 1751701663901, "userId" : "ChatBot01" } ], "type" : "subtitle" }',
  'conv{ "EventTime" : 1751701658826, "RoundID" : 3, "Stage" : { "Code" : 2, "Description" : "thinking" }, "TaskId" : "Huoshan01", "UserID" : "user1" }'
];

mockRTCMessages.forEach((message, index) => {
  console.log(`\n处理RTC消息 ${index + 1}:`);
  
  try {
    const messageData = parseRTCMessage(message);
    
    if (messageData && messageData.type === 'subtitle' && messageData.data) {
      const subtitleData = messageData.data[0];
      const { text, definite, userId, language, mode } = subtitleData;
      
      // 解码Unicode字符
      const decodedText = decodeUnicode(text);
      
      console.log('✅ 字幕解析成功:');
      console.log('  原始文本:', text);
      console.log('  解码文本:', decodedText);
      console.log('  是否确定:', definite);
      console.log('  用户ID:', userId);
      console.log('  语言:', language);
      console.log('  模式:', mode);
      
      // 判断说话者
      const speaker = (userId === 'ChatBot01' || userId === 'AI') ? 'AI面试官' : '您';
      console.log('  说话者:', speaker);
      
      // 模拟添加到字幕历史
      console.log('  添加到字幕历史');
      
    } else if (messageData && messageData.Stage) {
      const { Stage } = messageData;
      const { Code, Description } = Stage;
      
      console.log('✅ 状态消息解析成功:');
      console.log('  状态码:', Code);
      console.log('  描述:', Description);
      console.log('  事件时间:', messageData.EventTime);
      
    } else {
      console.log('⚠️ 消息格式不符合预期');
    }
  } catch (error) {
    console.log('❌ 消息处理失败:', error.message);
  }
});

console.log('\n=== 测试完成 ===');
console.log('\n建议:');
console.log('1. 检查解析结果是否符合预期');
console.log('2. 确认Unicode字符正确解码');
console.log('3. 验证说话者识别是否正确');
console.log('4. 测试各种边界情况');
console.log('5. 确认字幕和状态消息都能正确处理'); 