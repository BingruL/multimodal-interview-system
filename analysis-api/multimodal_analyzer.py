import cv2
import numpy as np
import librosa
import json
import time
from typing import Dict, List, Tuple, Optional
import threading
from collections import deque

class MultimodalAnalyzer:
    """多模态面试分析器 - 集成视频、语音、文本分析"""
    
    def __init__(self):
        # 视频分析配置
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        
        # 分析结果存储
        self.video_analysis = {
            'confidence_level': 0,
            'eye_contact_score': 0,
            'facial_expression_score': 0,
            'posture_score': 0,
            'micro_expressions': []
        }
        
        self.audio_analysis = {
            'speech_rate': 0,
            'tone_confidence': 0,
            'fluency_score': 0,
            'volume_stability': 0,
            'pause_analysis': []
        }
        
        self.text_analysis = {
            'relevance_score': 0,
            'structure_score': 0,
            'completeness_score': 0,
            'keyword_density': 0,
            'star_structure_usage': 0
        }
        
        # 实时分析状态
        self.is_analyzing = False
        self.analysis_thread = None
        self.video_frames = deque(maxlen=30)  # 存储最近30帧
        self.audio_buffer = deque(maxlen=1000)  # 存储音频数据
        
    def start_video_analysis(self, video_stream):
        """开始视频分析"""
        self.is_analyzing = True
        self.analysis_thread = threading.Thread(target=self._video_analysis_loop, args=(video_stream,))
        self.analysis_thread.start()
        
    def stop_video_analysis(self):
        """停止视频分析"""
        self.is_analyzing = False
        if self.analysis_thread:
            self.analysis_thread.join()
            
    def _video_analysis_loop(self, video_stream):
        """视频分析主循环"""
        while self.is_analyzing:
            ret, frame = video_stream.read()
            if not ret:
                break
                
            # 分析当前帧
            frame_analysis = self._analyze_video_frame(frame)
            self.video_frames.append(frame_analysis)
            
            # 更新综合评分
            self._update_video_scores()
            
            time.sleep(0.033)  # 约30fps
            
    def _analyze_video_frame(self, frame):
        """分析单帧视频"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # 人脸检测
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        frame_analysis = {
            'face_detected': len(faces) > 0,
            'face_count': len(faces),
            'eye_contact': False,
            'confidence_indicators': [],
            'posture_indicators': []
        }
        
        for (x, y, w, h) in faces:
            face_roi = gray[y:y+h, x:x+w]
            
            # 眼睛检测
            eyes = self.eye_cascade.detectMultiScale(face_roi)
            frame_analysis['eye_contact'] = len(eyes) >= 2
            
            # 自信度分析（基于面部特征）
            confidence_score = self._analyze_confidence_indicators(face_roi)
            frame_analysis['confidence_indicators'].append(confidence_score)
            
            # 姿态分析
            posture_score = self._analyze_posture(frame, (x, y, w, h))
            frame_analysis['posture_indicators'].append(posture_score)
            
        return frame_analysis
        
    def _analyze_confidence_indicators(self, face_roi):
        """分析自信度指标"""
        # 简化的自信度分析
        # 实际项目中可以使用更复杂的面部表情识别模型
        brightness = np.mean(face_roi)
        contrast = np.std(face_roi)
        
        # 基于亮度和对比度估算自信度
        confidence = min(100, max(0, (brightness - 50) * 0.5 + (contrast - 20) * 0.3))
        return confidence
        
    def _analyze_posture(self, frame, face_rect):
        """分析姿态"""
        x, y, w, h = face_rect
        frame_height, frame_width = frame.shape[:2]
        
        # 分析面部在画面中的位置和大小
        face_center_x = x + w // 2
        face_center_y = y + h // 2
        
        # 理想位置：画面中央
        ideal_center_x = frame_width // 2
        ideal_center_y = frame_height // 2
        
        # 计算偏离度
        x_offset = abs(face_center_x - ideal_center_x) / ideal_center_x
        y_offset = abs(face_center_y - ideal_center_y) / ideal_center_y
        
        # 面部大小分析（距离摄像头的远近）
        face_size_ratio = (w * h) / (frame_width * frame_height)
        ideal_size_ratio = 0.1  # 理想面部大小比例
        
        size_score = 100 - abs(face_size_ratio - ideal_size_ratio) * 1000
        
        # 综合姿态评分
        posture_score = 100 - (x_offset + y_offset) * 50 + size_score * 0.5
        return max(0, min(100, posture_score))
        
    def _update_video_scores(self):
        """更新视频分析综合评分"""
        if not self.video_frames:
            return
            
        recent_frames = list(self.video_frames)[-10:]  # 最近10帧
        
        # 计算眼神交流得分
        eye_contact_frames = sum(1 for frame in recent_frames if frame['eye_contact'])
        self.video_analysis['eye_contact_score'] = (eye_contact_frames / len(recent_frames)) * 100
        
        # 计算自信度得分
        if recent_frames:
            confidence_scores = []
            for frame in recent_frames:
                confidence_scores.extend(frame['confidence_indicators'])
            
            if confidence_scores:
                self.video_analysis['confidence_level'] = np.mean(confidence_scores)
                
        # 计算姿态得分
        if recent_frames:
            posture_scores = []
            for frame in recent_frames:
                posture_scores.extend(frame['posture_indicators'])
                
            if posture_scores:
                self.video_analysis['posture_score'] = np.mean(posture_scores)
                
    def analyze_audio(self, audio_data, sample_rate=16000):
        """分析音频数据"""
        try:
            # 语音速率分析
            speech_rate = self._analyze_speech_rate(audio_data, sample_rate)
            self.audio_analysis['speech_rate'] = speech_rate
            
            # 语调自信度分析
            tone_confidence = self._analyze_tone_confidence(audio_data, sample_rate)
            self.audio_analysis['tone_confidence'] = tone_confidence
            
            # 流畅度分析
            fluency_score = self._analyze_fluency(audio_data, sample_rate)
            self.audio_analysis['fluency_score'] = fluency_score
            
            # 音量稳定性分析
            volume_stability = self._analyze_volume_stability(audio_data)
            self.audio_analysis['volume_stability'] = volume_stability
            
        except Exception as e:
            print(f"音频分析错误: {e}")
            
    def _analyze_speech_rate(self, audio_data, sample_rate):
        """分析语音速率"""
        try:
            # 使用librosa进行语音分割
            intervals = librosa.effects.split(audio_data, top_db=20)
            
            # 计算有效语音时长
            speech_duration = sum(end - start for start, end in intervals) / sample_rate
            
            # 估算语音速率（假设平均每个音节0.1秒）
            estimated_syllables = speech_duration / 0.1
            
            # 标准化到0-100分
            speech_rate = min(100, max(0, estimated_syllables * 10))
            return speech_rate
            
        except Exception as e:
            print(f"语音速率分析错误: {e}")
            return 50  # 默认中等速率
            
    def _analyze_tone_confidence(self, audio_data, sample_rate):
        """分析语调自信度"""
        try:
            # 提取音调特征
            pitches, magnitudes = librosa.piptrack(y=audio_data, sr=sample_rate)
            
            # 计算平均音调
            pitch_values = []
            for t in range(pitches.shape[1]):
                index = magnitudes[:, t].argmax()
                pitch = pitches[index, t]
                if pitch > 0:
                    pitch_values.append(pitch)
                    
            if pitch_values:
                mean_pitch = np.mean(pitch_values)
                # 基于音调范围评估自信度（简化模型）
                confidence = min(100, max(0, (mean_pitch - 100) * 0.5))
                return confidence
            else:
                return 50
                
        except Exception as e:
            print(f"语调分析错误: {e}")
            return 50
            
    def _analyze_fluency(self, audio_data, sample_rate):
        """分析流畅度"""
        try:
            # 检测停顿
            intervals = librosa.effects.split(audio_data, top_db=20)
            
            # 计算停顿次数和时长
            pause_count = len(intervals) - 1
            total_pause_duration = 0
            
            for i in range(len(intervals) - 1):
                pause_duration = (intervals[i+1][0] - intervals[i][1]) / sample_rate
                total_pause_duration += pause_duration
                
            # 流畅度评分（停顿越少，分数越高）
            fluency_score = 100 - (pause_count * 5) - (total_pause_duration * 10)
            return max(0, min(100, fluency_score))
            
        except Exception as e:
            print(f"流畅度分析错误: {e}")
            return 70
            
    def _analyze_volume_stability(self, audio_data):
        """分析音量稳定性"""
        try:
            # 计算音量包络
            envelope = np.abs(audio_data)
            
            # 计算音量变化的标准差
            volume_std = np.std(envelope)
            volume_mean = np.mean(envelope)
            
            # 稳定性评分（变化越小，分数越高）
            stability_score = 100 - (volume_std / volume_mean) * 100
            return max(0, min(100, stability_score))
            
        except Exception as e:
            print(f"音量稳定性分析错误: {e}")
            return 70
            
    def analyze_text_content(self, text_content, domain, role):
        """分析文本内容"""
        try:
            # 相关性分析
            relevance_score = self._analyze_relevance(text_content, domain, role)
            self.text_analysis['relevance_score'] = relevance_score
            
            # 结构化程度分析
            structure_score = self._analyze_structure(text_content)
            self.text_analysis['structure_score'] = structure_score
            
            # 完整性分析
            completeness_score = self._analyze_completeness(text_content)
            self.text_analysis['completeness_score'] = completeness_score
            
            # 关键词密度分析
            keyword_density = self._analyze_keyword_density(text_content, domain)
            self.text_analysis['keyword_density'] = keyword_density
            
            # STAR结构使用分析
            star_usage = self._analyze_star_structure(text_content)
            self.text_analysis['star_structure_usage'] = star_usage
            
        except Exception as e:
            print(f"文本分析错误: {e}")
            
    def _analyze_relevance(self, text, domain, role):
        """分析回答相关性"""
        # 领域关键词
        domain_keywords = {
            '人工智能': ['算法', '机器学习', '深度学习', '神经网络', 'AI', '模型', '数据', '训练', '优化'],
            '大数据': ['Hadoop', 'Spark', '数据仓库', '数据挖掘', '数据分析', '数据处理', 'ETL', '数据湖'],
            '物联网': ['传感器', '嵌入式', 'RTOS', '通信协议', '硬件', '设备', '物联网', 'IoT', '边缘计算']
        }
        
        keywords = domain_keywords.get(domain, [])
        text_lower = text.lower()
        
        # 计算关键词匹配度
        matches = sum(1 for keyword in keywords if keyword.lower() in text_lower)
        relevance_score = min(100, (matches / len(keywords)) * 100) if keywords else 50
        
        return relevance_score
        
    def _analyze_structure(self, text):
        """分析回答结构化程度"""
        # 检查是否包含结构化元素
        structure_indicators = [
            '首先', '其次', '最后', '第一', '第二', '第三',
            '开始', '然后', '接着', '最后', '总结',
            '因为', '所以', '但是', '然而', '因此'
        ]
        
        text_lower = text.lower()
        structure_count = sum(1 for indicator in structure_indicators if indicator in text_lower)
        
        # 基于结构化词汇数量评分
        structure_score = min(100, structure_count * 15)
        return structure_score
        
    def _analyze_completeness(self, text):
        """分析回答完整性"""
        # 基于回答长度和内容丰富度
        word_count = len(text.split())
        
        # 检查是否包含具体例子
        has_examples = any(word in text.lower() for word in ['例如', '比如', '具体', '实例', '项目'])
        
        # 检查是否包含结果描述
        has_results = any(word in text.lower() for word in ['结果', '效果', '提升', '改善', '达到', '实现'])
        
        completeness_score = min(100, word_count * 2 + (has_examples * 20) + (has_results * 20))
        return completeness_score
        
    def _analyze_keyword_density(self, text, domain):
        """分析关键词密度"""
        domain_keywords = {
            '人工智能': ['算法', '机器学习', '深度学习', '神经网络', 'AI', '模型', '数据', '训练', '优化'],
            '大数据': ['Hadoop', 'Spark', '数据仓库', '数据挖掘', '数据分析', '数据处理', 'ETL', '数据湖'],
            '物联网': ['传感器', '嵌入式', 'RTOS', '通信协议', '硬件', '设备', '物联网', 'IoT', '边缘计算']
        }
        
        keywords = domain_keywords.get(domain, [])
        text_lower = text.lower()
        word_count = len(text.split())
        
        if word_count == 0:
            return 0
            
        keyword_count = sum(text_lower.count(keyword.lower()) for keyword in keywords)
        density = (keyword_count / word_count) * 100
        
        return min(100, density * 50)  # 标准化到0-100
        
    def _analyze_star_structure(self, text):
        """分析STAR结构使用情况"""
        # STAR结构关键词
        star_keywords = {
            'Situation': ['情况', '背景', '环境', '当时', '面临'],
            'Task': ['任务', '目标', '要求', '需要', '负责'],
            'Action': ['行动', '做法', '措施', '实施', '执行', '采用'],
            'Result': ['结果', '效果', '成果', '达到', '实现', '提升']
        }
        
        text_lower = text.lower()
        star_scores = {}
        
        for component, keywords in star_keywords.items():
            matches = sum(1 for keyword in keywords if keyword in text_lower)
            star_scores[component] = min(100, matches * 25)
            
        # 综合STAR结构得分
        avg_star_score = sum(star_scores.values()) / len(star_scores)
        return avg_star_score
        
    def get_comprehensive_analysis(self):
        """获取综合分析结果"""
        # 综合评分计算
        video_score = (
            self.video_analysis['confidence_level'] * 0.3 +
            self.video_analysis['eye_contact_score'] * 0.3 +
            self.video_analysis['posture_score'] * 0.4
        )
        
        audio_score = (
            self.audio_analysis['tone_confidence'] * 0.4 +
            self.audio_analysis['fluency_score'] * 0.3 +
            self.audio_analysis['volume_stability'] * 0.3
        )
        
        text_score = (
            self.text_analysis['relevance_score'] * 0.3 +
            self.text_analysis['structure_score'] * 0.2 +
            self.text_analysis['completeness_score'] * 0.3 +
            self.text_analysis['keyword_density'] * 0.2
        )
        
        return {
            'video_analysis': self.video_analysis,
            'audio_analysis': self.audio_analysis,
            'text_analysis': self.text_analysis,
            'comprehensive_scores': {
                'video_score': video_score,
                'audio_score': audio_score,
                'text_score': text_score,
                'overall_score': (video_score + audio_score + text_score) / 3
            }
        }
        
    def reset_analysis(self):
        """重置分析结果"""
        self.video_analysis = {
            'confidence_level': 0,
            'eye_contact_score': 0,
            'facial_expression_score': 0,
            'posture_score': 0,
            'micro_expressions': []
        }
        
        self.audio_analysis = {
            'speech_rate': 0,
            'tone_confidence': 0,
            'fluency_score': 0,
            'volume_stability': 0,
            'pause_analysis': []
        }
        
        self.text_analysis = {
            'relevance_score': 0,
            'structure_score': 0,
            'completeness_score': 0,
            'keyword_density': 0,
            'star_structure_usage': 0
        }
        
        self.video_frames.clear()
        self.audio_buffer.clear()

# 创建全局多模态分析器实例
multimodal_analyzer = MultimodalAnalyzer() 