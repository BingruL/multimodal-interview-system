<template>
  <div class="virtual-interviewer-container">
    <!-- 3D虚拟面试官画布 -->
    <div ref="threeContainer" class="three-canvas-container"></div>
    
    <!-- 虚拟面试官控制面板 -->
    <div class="interviewer-controls">
      <div class="interviewer-info">
        <h3 class="interviewer-name">AI面试官 - 小智</h3>
        <div class="interviewer-status">
          <span class="status-indicator" :class="{ 'speaking': isSpeaking, 'listening': isListening }"></span>
          <span class="status-text">
            {{ isSpeaking ? '正在说话' : isListening ? '正在聆听' : '待机中' }}
          </span>
        </div>
      </div>
      
      <!-- 表情和动作控制 -->
      <div class="expression-controls">
        <h4>表情控制</h4>
        <div class="expression-buttons">
          <button @click="setExpression('neutral')" class="expression-btn" :class="{ active: currentExpression === 'neutral' }">
            😐 中性
          </button>
          <button @click="setExpression('smile')" class="expression-btn" :class="{ active: currentExpression === 'smile' }">
            😊 微笑
          </button>
          <button @click="setExpression('thinking')" class="expression-btn" :class="{ active: currentExpression === 'thinking' }">
            🤔 思考
          </button>
          <button @click="setExpression('serious')" class="expression-btn" :class="{ active: currentExpression === 'serious' }">
            😤 严肃
          </button>
        </div>
      </div>
      
      <!-- 动作控制 -->
      <div class="gesture-controls">
        <h4>手势控制</h4>
        <div class="gesture-buttons">
          <button @click="playGesture('wave')" class="gesture-btn">👋 挥手</button>
          <button @click="playGesture('nod')" class="gesture-btn">👍 点头</button>
          <button @click="playGesture('point')" class="gesture-btn">👉 指向</button>
          <button @click="playGesture('clap')" class="gesture-btn">👏 鼓掌</button>
        </div>
      </div>
      
      <!-- 虚拟面试官设置 -->
      <div class="interviewer-settings">
        <h4>外观设置</h4>
        <div class="setting-item">
          <label>性别:</label>
          <select v-model="avatarGender" @change="updateAvatar">
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>
        <div class="setting-item">
          <label>服装:</label>
          <select v-model="avatarOutfit" @change="updateAvatar">
            <option value="business">商务装</option>
            <option value="casual">休闲装</option>
            <option value="formal">正装</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Props
const props = defineProps({
  isSpeaking: {
    type: Boolean,
    default: false
  },
  isListening: {
    type: Boolean,
    default: false
  },
  currentMessage: {
    type: String,
    default: ''
  }
})

// Emits
const emits = defineEmits(['expression-changed', 'gesture-played'])

// 响应式数据
const threeContainer = ref(null)
const currentExpression = ref('neutral')
const avatarGender = ref('female')
const avatarOutfit = ref('business')

// Three.js 相关变量
let scene, camera, renderer, controls
let avatarModel = null
let mixer = null
let clock = new THREE.Clock()
let animationId = null

// 表情和动画映射
const expressions = {
  neutral: { mouth: 0, eyebrows: 0, eyes: 0 },
  smile: { mouth: 0.8, eyebrows: 0.2, eyes: 0.1 },
  thinking: { mouth: -0.2, eyebrows: -0.3, eyes: -0.1 },
  serious: { mouth: -0.1, eyebrows: -0.5, eyes: 0.2 }
}

// 初始化Three.js场景
const initThreeJS = () => {
  if (!threeContainer.value) return
  
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    threeContainer.value.clientWidth / threeContainer.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 1.6, 3)
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  threeContainer.value.appendChild(renderer.domElement)
  
  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.maxPolarAngle = Math.PI / 2
  controls.minDistance = 2
  controls.maxDistance = 8
  
  // 添加光源
  setupLighting()
  
  // 创建虚拟角色
  createAvatar()
  
  // 开始渲染循环
  animate()
}

// 设置光源
const setupLighting = () => {
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  // 主光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)
  
  // 补光
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
  fillLight.position.set(-5, 5, -5)
  scene.add(fillLight)
}

// 创建动漫风格虚拟角色
const createAvatar = () => {
  // 创建动漫风格的3D角色
  
  // 头部 - 更大更圆润的动漫风格
  const headGeometry = new THREE.SphereGeometry(0.22, 32, 32)
  const headMaterial = new THREE.MeshToonMaterial({ 
    color: 0xffeaa7,  // 温暖的肤色
    shininess: 10
  })
  const head = new THREE.Mesh(headGeometry, headMaterial)
  head.position.set(0, 1.75, 0)
  head.scale.set(1, 1.1, 0.9)  // 稍微拉长，更符合动漫比例
  head.castShadow = true
  scene.add(head)
  
  // 身体 - 动漫风格服装
  const bodyGeometry = new THREE.CylinderGeometry(0.18, 0.22, 0.7, 8)
  const bodyMaterial = new THREE.MeshToonMaterial({ 
    color: avatarOutfit.value === 'business' ? 0x74b9ff : 0x6c5ce7  // 更鲜艳的动漫色彩
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.set(0, 1.15, 0)
  body.castShadow = true
  scene.add(body)
  
  // 手臂 - 动漫风格
  const armGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.55, 8)
  const armMaterial = new THREE.MeshToonMaterial({ color: 0xffeaa7 })  // 与头部同色
  
  const leftArm = new THREE.Mesh(armGeometry, armMaterial)
  leftArm.position.set(-0.28, 1.15, 0)
  leftArm.rotation.z = Math.PI / 6
  leftArm.castShadow = true
  scene.add(leftArm)
  
  const rightArm = new THREE.Mesh(armGeometry, armMaterial)
  rightArm.position.set(0.28, 1.15, 0)
  rightArm.rotation.z = -Math.PI / 6
  rightArm.castShadow = true
  scene.add(rightArm)
  
  // 动漫风格大眼睛
  const eyeWhiteGeometry = new THREE.SphereGeometry(0.045, 16, 16)
  const eyeWhiteMaterial = new THREE.MeshToonMaterial({ color: 0xffffff })
  
  const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial)
  leftEyeWhite.position.set(-0.08, 1.8, 0.15)
  leftEyeWhite.scale.set(1, 1.2, 0.8)
  scene.add(leftEyeWhite)
  
  const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial)
  rightEyeWhite.position.set(0.08, 1.8, 0.15)
  rightEyeWhite.scale.set(1, 1.2, 0.8)
  scene.add(rightEyeWhite)
  
  // 眼珠
  const pupilGeometry = new THREE.SphereGeometry(0.025, 16, 16)
  const pupilMaterial = new THREE.MeshToonMaterial({ color: 0x2d3436 })
  
  const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
  leftPupil.position.set(-0.08, 1.8, 0.17)
  scene.add(leftPupil)
  
  const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
  rightPupil.position.set(0.08, 1.8, 0.17)
  scene.add(rightPupil)
  
  // 眼睛高光 - 动漫特色
  const highlightGeometry = new THREE.SphereGeometry(0.008, 8, 8)
  const highlightMaterial = new THREE.MeshToonMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
  
  const leftHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial)
  leftHighlight.position.set(-0.075, 1.82, 0.18)
  scene.add(leftHighlight)
  
  const rightHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial)
  rightHighlight.position.set(0.085, 1.82, 0.18)
  scene.add(rightHighlight)
  
  // 动漫风格小嘴巴
  const mouthGeometry = new THREE.SphereGeometry(0.02, 16, 16)
  const mouthMaterial = new THREE.MeshToonMaterial({ color: 0xff7675 })
  const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial)
  mouth.position.set(0, 1.68, 0.15)
  mouth.scale.set(1.2, 0.4, 0.6)
  scene.add(mouth)
  
  // 动漫风格头发
  const hairGeometry = new THREE.SphereGeometry(0.22, 16, 16)
  const hairMaterial = new THREE.MeshToonMaterial({ color: 0x6c5ce7 })  // 紫色头发
  const hair = new THREE.Mesh(hairGeometry, hairMaterial)
  hair.position.set(0, 1.95, -0.05)
  hair.scale.set(1.1, 0.8, 1.2)
  hair.castShadow = true
  scene.add(hair)
  
  // 刘海
  const bangsGeometry = new THREE.SphereGeometry(0.12, 12, 12)
  const bangs = new THREE.Mesh(bangsGeometry, hairMaterial)
  bangs.position.set(0, 1.88, 0.08)
  bangs.scale.set(1.5, 0.6, 0.8)
  scene.add(bangs)
  
  // 侧边头发
  const sideHairGeometry = new THREE.SphereGeometry(0.08, 12, 12)
  
  const leftSideHair = new THREE.Mesh(sideHairGeometry, hairMaterial)
  leftSideHair.position.set(-0.18, 1.85, 0.02)
  leftSideHair.scale.set(0.8, 1.2, 1.0)
  scene.add(leftSideHair)
  
  const rightSideHair = new THREE.Mesh(sideHairGeometry, hairMaterial)
  rightSideHair.position.set(0.18, 1.85, 0.02)
  rightSideHair.scale.set(0.8, 1.2, 1.0)
  scene.add(rightSideHair)
  
  // 地面
  const groundGeometry = new THREE.PlaneGeometry(10, 10)
  const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)
  
  // 保存模型引用
  avatarModel = {
    head,
    body,
    leftArm,
    rightArm,
    leftEyeWhite,
    rightEyeWhite,
    leftPupil,
    rightPupil,
    leftHighlight,
    rightHighlight,
    mouth,
    hair,
    bangs,
    leftSideHair,
    rightSideHair
  }
}

// 渲染循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  const delta = clock.getDelta()
  
  // 更新动画混合器
  if (mixer) {
    mixer.update(delta)
  }
  
  // 说话时的嘴部动画
  if (props.isSpeaking && avatarModel) {
    const time = clock.getElapsedTime()
    avatarModel.mouth.scale.y = 0.3 + Math.sin(time * 10) * 0.2
  }
  
  // 呼吸动画
  if (avatarModel) {
    const time = clock.getElapsedTime()
    avatarModel.body.scale.y = 1 + Math.sin(time * 2) * 0.02
  }
  
  // 更新控制器
  controls.update()
  
  // 渲染场景
  renderer.render(scene, camera)
}

// 设置动漫风格表情
const setExpression = (expression) => {
  currentExpression.value = expression
  
  if (!avatarModel) return
  
  const expr = expressions[expression]
  
  // 更新动漫风格眼睛
  avatarModel.leftEyeWhite.scale.y = 1.2 + expr.eyes * 0.3
  avatarModel.rightEyeWhite.scale.y = 1.2 + expr.eyes * 0.3
  
  // 眼珠跟随表情变化
  if (expression === 'thinking') {
    avatarModel.leftPupil.position.x = -0.085
    avatarModel.rightPupil.position.x = 0.075
  } else {
    avatarModel.leftPupil.position.x = -0.08
    avatarModel.rightPupil.position.x = 0.08
  }
  
  // 更新动漫风格嘴巴
  if (expression === 'smile') {
    avatarModel.mouth.material.color.setHex(0xff6b9d)  // 粉色微笑
    avatarModel.mouth.scale.x = 1.8
    avatarModel.mouth.scale.y = 0.6
  } else if (expression === 'serious') {
    avatarModel.mouth.material.color.setHex(0xa29bfe)  // 紫色严肃
    avatarModel.mouth.scale.x = 0.8
    avatarModel.mouth.scale.y = 0.3
  } else if (expression === 'thinking') {
    avatarModel.mouth.material.color.setHex(0xfdcb6e)  // 黄色思考
    avatarModel.mouth.scale.x = 1.0
    avatarModel.mouth.scale.y = 0.5
  } else {
    avatarModel.mouth.material.color.setHex(0xff7675)  // 默认粉红
    avatarModel.mouth.scale.x = 1.2
    avatarModel.mouth.scale.y = 0.4
  }
  
  emits('expression-changed', expression)
}

// 播放手势
const playGesture = (gesture) => {
  if (!avatarModel) return
  
  switch (gesture) {
    case 'wave':
      // 挥手动画
      animateWave()
      break
    case 'nod':
      // 点头动画
      animateNod()
      break
    case 'point':
      // 指向动画
      animatePoint()
      break
    case 'clap':
      // 鼓掌动画
      animateClap()
      break
  }
  
  emits('gesture-played', gesture)
}

// 挥手动画
const animateWave = () => {
  const duration = 2000
  const startTime = Date.now()
  
  const wave = () => {
    const elapsed = Date.now() - startTime
    const progress = elapsed / duration
    
    if (progress < 1) {
      const angle = Math.sin(progress * Math.PI * 4) * 0.5
      avatarModel.rightArm.rotation.z = -Math.PI / 6 + angle
      requestAnimationFrame(wave)
    } else {
      avatarModel.rightArm.rotation.z = -Math.PI / 6
    }
  }
  
  wave()
}

// 点头动画
const animateNod = () => {
  const duration = 1000
  const startTime = Date.now()
  
  const nod = () => {
    const elapsed = Date.now() - startTime
    const progress = elapsed / duration
    
    if (progress < 1) {
      const angle = Math.sin(progress * Math.PI * 3) * 0.2
      avatarModel.head.rotation.x = angle
      requestAnimationFrame(nod)
    } else {
      avatarModel.head.rotation.x = 0
    }
  }
  
  nod()
}

// 指向动画
const animatePoint = () => {
  const originalRotation = avatarModel.rightArm.rotation.z
  avatarModel.rightArm.rotation.z = 0
  
  setTimeout(() => {
    avatarModel.rightArm.rotation.z = originalRotation
  }, 1500)
}

// 鼓掌动画
const animateClap = () => {
  const duration = 1500
  const startTime = Date.now()
  
  const clap = () => {
    const elapsed = Date.now() - startTime
    const progress = elapsed / duration
    
    if (progress < 1) {
      const angle = Math.sin(progress * Math.PI * 6) * 0.3
      avatarModel.leftArm.rotation.z = Math.PI / 6 + angle
      avatarModel.rightArm.rotation.z = -Math.PI / 6 - angle
      requestAnimationFrame(clap)
    } else {
      avatarModel.leftArm.rotation.z = Math.PI / 6
      avatarModel.rightArm.rotation.z = -Math.PI / 6
    }
  }
  
  clap()
}

// 更新动漫角色外观
const updateAvatar = () => {
  if (!avatarModel) return
  
  // 根据性别调整颜色
  if (avatarGender.value === 'female') {
    avatarModel.body.material.color.setHex(0xffb3ba)  // 粉色上衣
    avatarModel.hair.material.color.setHex(0xfd79a8)  // 粉色头发
    avatarModel.bangs.material.color.setHex(0xfd79a8)
    avatarModel.leftSideHair.material.color.setHex(0xfd79a8)
    avatarModel.rightSideHair.material.color.setHex(0xfd79a8)
  } else {
    avatarModel.body.material.color.setHex(0x74b9ff)  // 蓝色上衣
    avatarModel.hair.material.color.setHex(0x2d3436)  // 黑色头发
    avatarModel.bangs.material.color.setHex(0x2d3436)
    avatarModel.leftSideHair.material.color.setHex(0x2d3436)
    avatarModel.rightSideHair.material.color.setHex(0x2d3436)
  }
  
  // 根据服装调整颜色
  const outfitColors = {
    business: 0x2c3e50,  // 深蓝商务
    casual: 0x81ecec,    // 青色休闲
    formal: 0x1a1a1a     // 黑色正式
  }
  
  const hairColors = {
    business: avatarGender.value === 'female' ? 0x6c5ce7 : 0x2d3436,  // 紫色/黑色
    casual: avatarGender.value === 'female' ? 0x00b894 : 0x636e72,   // 绿色/灰色
    formal: avatarGender.value === 'female' ? 0x2d3436 : 0x2d3436    // 黑色
  }
  
  avatarModel.body.material.color.setHex(outfitColors[avatarOutfit.value])
  
  // 更新头发颜色
  const hairColor = hairColors[avatarOutfit.value]
  avatarModel.hair.material.color.setHex(hairColor)
  avatarModel.bangs.material.color.setHex(hairColor)
  avatarModel.leftSideHair.material.color.setHex(hairColor)
  avatarModel.rightSideHair.material.color.setHex(hairColor)
}

// 处理窗口大小变化
const handleResize = () => {
  if (!threeContainer.value || !camera || !renderer) return
  
  const width = threeContainer.value.clientWidth
  const height = threeContainer.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  
  renderer.setSize(width, height)
}

// 监听说话状态变化
watch(() => props.isSpeaking, (newValue) => {
  if (newValue) {
    setExpression('smile')
  } else {
    setExpression('neutral')
  }
})

// 监听聆听状态变化
watch(() => props.isListening, (newValue) => {
  if (newValue) {
    setExpression('thinking')
  }
})

// 组件挂载
onMounted(() => {
  initThreeJS()
  window.addEventListener('resize', handleResize)
})

// 组件卸载
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (renderer) {
    renderer.dispose()
  }
  
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.virtual-interviewer-container {
  display: flex;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.three-canvas-container {
  flex: 1;
  position: relative;
  min-height: 400px;
}

.interviewer-controls {
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  overflow-y: auto;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.interviewer-info {
  margin-bottom: 24px;
  text-align: center;
}

.interviewer-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.interviewer-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #95a5a6;
  transition: all 0.3s ease;
}

.status-indicator.speaking {
  background: #e74c3c;
  animation: pulse 1s infinite;
}

.status-indicator.listening {
  background: #3498db;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

.status-text {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
}

.expression-controls,
.gesture-controls,
.interviewer-settings {
  margin-bottom: 20px;
}

.expression-controls h4,
.gesture-controls h4,
.interviewer-settings h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.expression-buttons,
.gesture-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.expression-btn,
.gesture-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.expression-btn:hover,
.gesture-btn:hover {
  background: #f8f9fa;
  border-color: #667eea;
  transform: translateY(-1px);
}

.expression-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.setting-item label {
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
}

.setting-item select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 0.85rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .virtual-interviewer-container {
    flex-direction: column;
  }
  
  .interviewer-controls {
    width: 100%;
    max-height: 200px;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .three-canvas-container {
    min-height: 300px;
  }
}
</style>