<template>
  <div class="flex flex-col h-screen overflow-hidden text-sm text-af-ink bg-af-bg font-sans">
    <!-- Header -->
    <header class="h-[52px] flex items-center justify-between px-4 shrink-0 z-50 border-b border-af-rule bg-af-surface">
      <div class="flex items-center gap-3">
        <RouterLink to="/" class="flex items-center gap-2.5 font-bold text-[15px] tracking-wide text-af-ink no-underline">
          <div class="w-7 h-7 rounded-md flex items-center justify-center text-sm text-white bg-gradient-to-br from-af-accent to-af-accent2">AF</div>
          <span>ArtForgeAI</span>
        </RouterLink>
        <div class="relative w-80">
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-af-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
          <input v-model="globalSearch" type="text" placeholder="搜索功能、资源或项目..." class="w-full bg-af-bg border border-af-rule rounded-md py-1.5 pl-8 pr-3 text-af-ink text-[13px] outline-none focus:border-af-accent placeholder:text-af-muted" />
        </div>
      </div>
      <div class="flex items-center gap-2.5">
        <button class="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border border-af-rule bg-af-bg text-af-muted hover:text-af-ink hover:bg-af-surface-hover transition-colors" @click="cycleTheme">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <span>{{ themeLabel }}</span>
        </button>
        <button class="relative p-1.5 rounded-md text-af-muted hover:text-af-ink hover:bg-af-surface-hover transition-colors group" @click="apiOpen = true">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          <span v-if="apiKey" class="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-af-accent ring-2 ring-af-surface"></span>
          <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-[11px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">API 设置</span>
        </button>
        <button class="relative p-1.5 rounded-md text-af-muted hover:text-af-ink hover:bg-af-surface-hover transition-colors group" @click="navigate('resource-library')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-[11px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">资源库</span>
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside class="shrink-0 flex flex-col overflow-hidden border-r border-af-rule bg-af-surface transition-[width] duration-300" :class="sidebarCollapsed ? 'w-14' : 'w-[230px]'">
        <div class="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2.5">
          <div class="mb-1">
            <button class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors" :class="currentScreen === 'home' ? 'text-af-accent bg-af-accent-soft' : 'text-af-muted hover:text-af-ink hover:bg-af-surface-hover'" @click="navigate('home')">
              <svg class="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span class="whitespace-nowrap overflow-hidden transition-all" :class="sidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">首页</span>
            </button>
          </div>

          <div class="mb-1">
            <div v-if="!sidebarCollapsed" class="text-[11px] font-semibold uppercase tracking-wider text-af-muted px-2.5 pt-2.5 pb-1.5">纯2D</div>
            <SidebarGroup v-model:open="groups.ai" title="AI概念工坊" :collapsed="sidebarCollapsed">
              <SidebarItem label="文生图" :active="currentScreen === 'ai-concept' && aiTab === 'txt2img'" @click="goSub('ai-concept','txt2img')" />
              <SidebarItem label="画风迁移" :active="currentScreen === 'ai-concept' && aiTab === 'style'" @click="goSub('ai-concept','style')" />
              <SidebarItem label="角色简化" :active="currentScreen === 'ai-concept' && aiTab === 'simplify'" @click="goSub('ai-concept','simplify')" />
              <SidebarItem label="姿势生成" :active="currentScreen === 'ai-concept' && aiTab === 'pose'" @click="goSub('ai-concept','pose')" />
            </SidebarGroup>
          </div>

          <div class="mb-1">
            <SidebarGroup v-model:open="groups.frame" title="序列帧工场" :collapsed="sidebarCollapsed">
              <SidebarItem label="视频转序列帧" :active="currentScreen === 'sequence-frame' && seqTab === 'video'" @click="goSub('sequence-frame','video')" />
              <SidebarItem label="GIF转序列帧" :active="currentScreen === 'sequence-frame' && seqTab === 'gif'" @click="goSub('sequence-frame','gif')" />
              <SidebarItem label="图片合成精灵图" :active="currentScreen === 'sequence-frame' && seqTab === 'sprite'" @click="goSub('sequence-frame','sprite')" />
            </SidebarGroup>
          </div>

          <div class="mb-1">
            <div v-if="!sidebarCollapsed" class="text-[11px] font-semibold uppercase tracking-wider text-af-muted px-2.5 pt-2.5 pb-1.5">像素</div>
            <SidebarGroup v-model:open="groups.pixel" title="像素画室" :collapsed="sidebarCollapsed">
              <SidebarItem label="像素绘画" :active="currentScreen === 'pixel-studio' && pixelTab === 'draw'" @click="goSub('pixel-studio','draw')" />
              <SidebarItem label="精细处理" :active="currentScreen === 'pixel-studio' && pixelTab === 'process'" @click="goSub('pixel-studio','process')" />
              <SidebarItem label="像素动作生成" :active="currentScreen === 'pixel-studio' && pixelTab === 'action'" @click="goSub('pixel-studio','action')" />
            </SidebarGroup>
            <SidebarGroup v-model:open="groups.map" title="地图编辑器" :collapsed="sidebarCollapsed">
              <SidebarItem label="瓦片双网格" :active="currentScreen === 'map-editor' && mapTab === 'tilemap'" @click="goSub('map-editor','tilemap')" />
              <SidebarItem label="Top-down 预览" :active="currentScreen === 'map-editor' && mapTab === 'preview'" @click="goSub('map-editor','preview')" />
            </SidebarGroup>
          </div>

          <div class="mb-1">
            <button class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors" :class="currentScreen === 'resource-library' ? 'text-af-accent bg-af-accent-soft' : 'text-af-muted hover:text-af-ink hover:bg-af-surface-hover'" @click="navigate('resource-library')">
              <svg class="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              <span class="whitespace-nowrap overflow-hidden transition-all" :class="sidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">资源库</span>
            </button>
          </div>
        </div>
        <div class="border-t border-af-rule px-2.5 py-2 flex items-center justify-between">
          <span v-if="!sidebarCollapsed" class="text-[11px] text-af-muted px-2.5">v0.2</span>
          <button class="p-1 rounded text-af-muted hover:text-af-ink hover:bg-af-surface-hover transition-colors group ml-auto" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-[11px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">收起/展开</span>
          </button>
        </div>
      </aside>

      <!-- Main workspace -->
      <main class="flex flex-col flex-1 overflow-hidden min-w-0">
        <div class="flex flex-1 min-h-0 overflow-hidden">
          <div class="flex flex-col flex-1 overflow-hidden min-w-0">

            <!-- HOME -->
            <section v-show="currentScreen === 'home'" class="flex flex-col flex-1 overflow-auto">
              <div class="flex items-center justify-between px-5 pt-3.5 pb-2.5 shrink-0">
                <div>
                  <h1 class="text-[22px] font-bold tracking-tight flex items-center gap-2">ArtForgeAI 工作台</h1>
                  <p class="text-[13px] text-af-muted mt-0.5">纯前端独立游戏美术一站式解决方案 · AI功能需配置自有API密钥</p>
                </div>
                <button class="btn-secondary" @click="apiOpen = true">API 设置</button>
              </div>
              <div class="flex-1 overflow-y-auto px-5 pb-4">
                <div class="text-[13px] font-semibold mb-2.5">最近使用</div>
                <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3.5 pb-5">
                  <div class="bg-af-surface border border-af-rule rounded-lg p-4 cursor-pointer transition-all hover:border-af-accent hover:bg-af-surface-hover hover:-translate-y-0.5" @click="goSub('ai-concept','txt2img')">
                    <div class="w-8 h-8 rounded-lg bg-af-accent-soft text-af-accent flex items-center justify-center mb-2.5"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg></div>
                    <div class="text-base font-semibold mb-1">文生图</div>
                    <div class="text-xs text-af-muted leading-relaxed">通过文本描述生成游戏概念美术</div>
                  </div>
                  <div class="bg-af-surface border border-af-rule rounded-lg p-4 cursor-pointer transition-all hover:border-af-accent hover:bg-af-surface-hover hover:-translate-y-0.5" @click="goSub('sequence-frame','video')">
                    <div class="w-8 h-8 rounded-lg bg-af-warning/10 text-af-warning flex items-center justify-center mb-2.5"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></div>
                    <div class="text-base font-semibold mb-1">视频转序列帧</div>
                    <div class="text-xs text-af-muted leading-relaxed">从视频提取帧序列，裁剪、抠图、导出</div>
                  </div>
                  <div class="bg-af-surface border border-af-rule rounded-lg p-4 cursor-pointer transition-all hover:border-af-accent hover:bg-af-surface-hover hover:-translate-y-0.5" @click="goSub('sequence-frame','sprite')">
                    <div class="w-8 h-8 rounded-lg bg-af-accent2/10 text-af-accent2 flex items-center justify-center mb-2.5"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div>
                    <div class="text-base font-semibold mb-1">图片合成精灵图</div>
                    <div class="text-xs text-af-muted leading-relaxed">编辑与导出精灵图序列帧</div>
                  </div>
                  <div class="bg-af-surface border border-af-rule rounded-lg p-4 cursor-pointer transition-all hover:border-af-accent hover:bg-af-surface-hover hover:-translate-y-0.5" @click="goSub('pixel-studio','draw')">
                    <div class="w-8 h-8 rounded-lg bg-af-accent-soft text-af-accent flex items-center justify-center mb-2.5"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></div>
                    <div class="text-base font-semibold mb-1">像素绘画</div>
                    <div class="text-xs text-af-muted leading-relaxed">在线像素画编辑器</div>
                  </div>
                  <div class="bg-af-surface border border-af-rule rounded-lg p-4 cursor-pointer transition-all hover:border-af-accent hover:bg-af-surface-hover hover:-translate-y-0.5" @click="navigate('resource-library')">
                    <div class="w-8 h-8 rounded-lg bg-af-accent-soft text-af-accent flex items-center justify-center mb-2.5"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg></div>
                    <div class="text-base font-semibold mb-1">资源库</div>
                    <div class="text-xs text-af-muted leading-relaxed">本地 IndexedDB 资源管理</div>
                  </div>
                </div>
                <div class="text-[13px] font-semibold mb-2.5">快速开始</div>
                <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3.5">
                  <div class="bg-af-surface border border-af-rule rounded-lg p-4 cursor-pointer transition-all hover:border-af-accent hover:bg-af-surface-hover hover:-translate-y-0.5" @click="goSub('sequence-frame','gif')"><div class="text-base font-semibold mb-1">GIF转序列帧</div><div class="text-xs text-af-muted leading-relaxed">解码GIF为逐帧图像</div></div>
                  <div class="bg-af-surface border border-af-rule rounded-lg p-4 cursor-pointer transition-all hover:border-af-accent hover:bg-af-surface-hover hover:-translate-y-0.5" @click="goSub('ai-concept','style')"><div class="text-base font-semibold mb-1">画风迁移</div><div class="text-xs text-af-muted leading-relaxed">将图像转换为目标画风</div></div>
                  <div class="bg-af-surface border border-af-rule rounded-lg p-4 cursor-pointer transition-all hover:border-af-accent hover:bg-af-surface-hover hover:-translate-y-0.5" @click="goSub('map-editor','tilemap')"><div class="text-base font-semibold mb-1">瓦片地图编辑器</div><div class="text-xs text-af-muted leading-relaxed">双网格瓦片地图绘制</div></div>
                  <div class="bg-af-surface border border-af-rule rounded-lg p-4 cursor-pointer transition-all hover:border-af-accent hover:bg-af-surface-hover hover:-translate-y-0.5" @click="goSub('pixel-studio','action')"><div class="text-base font-semibold mb-1">像素动作生成</div><div class="text-xs text-af-muted leading-relaxed">生成像素角色动画</div></div>
                </div>
              </div>
            </section>

            <!-- AI CONCEPT -->
            <section v-show="currentScreen === 'ai-concept'" class="flex flex-col flex-1 overflow-auto">
              <div class="flex items-center justify-between px-5 pt-3.5 pb-2.5 shrink-0">
                <div>
                  <h1 class="text-[22px] font-bold tracking-tight flex items-center gap-2">AI概念工坊</h1>
                  <p class="text-[13px] text-af-muted mt-0.5">文本生成、风格迁移与角色概念工具</p>
                </div>
                <button class="btn-secondary" @click="apiOpen = true">API 设置</button>
              </div>
              <div class="flex-1 overflow-y-auto px-5 pb-4">
                <div class="flex gap-2 mb-3 flex-wrap">
                  <button v-for="t in aiTabs" :key="t.key" class="px-3 py-1.5 rounded-md text-xs font-medium border transition-colors" :class="aiTab === t.key ? 'bg-af-accent-soft border-af-accent text-af-accent' : 'bg-af-surface border-af-rule text-af-muted hover:text-af-ink hover:border-af-ink/30'" @click="aiTab = t.key">{{ t.label }}</button>
                </div>

                <!-- txt2img -->
                <div v-if="aiTab === 'txt2img'" class="space-y-3">
                  <div class="bg-af-bg border border-af-rule rounded-lg p-3.5">
                    <div class="panel-title"><span>提示词</span><HelpBtn text="输入描述游戏画面的提示词，选择风格、尺寸等，点击生成。结果可直接保存到资源库。AI 调用需先在右上角配置 API。" /></div>
                    <textarea v-model="t2i.prompt" rows="3" placeholder="描述你想要的画面..." class="form-textarea mb-3"></textarea>
                    <div class="form-group"><label class="form-label">反向提示词</label><textarea v-model="t2i.negative" rows="2" class="form-textarea"></textarea></div>
                    <div class="form-row">
                      <div class="form-group"><label class="form-label">风格模板</label><select v-model="t2i.style" class="form-select"><option value="pixel">像素艺术</option><option value="anime">2D 动漫</option><option value="lowpoly">Low Poly</option><option value="handdrawn">手绘</option><option value="realistic">写实</option></select></div>
                      <div class="form-group"><label class="form-label">数量</label><select v-model="t2i.count" class="form-select"><option>1</option><option>4</option><option>9</option></select></div>
                    </div>
                    <div class="form-row">
                      <div class="form-group"><label class="form-label">尺寸</label><select v-model="t2i.size" class="form-select"><option value="1024x1024">1024x1024</option><option value="1024x1536">1024x1536</option><option value="1536x1024">1536x1024</option><option value="512x512">512x512</option></select></div>
                      <div class="form-group"><label class="form-label">步数 (SD)</label><input v-model.number="t2i.steps" type="number" min="1" max="50" class="form-input" /></div>
                      <div class="form-group"><label class="form-label">质量</label><select v-model="t2i.quality" class="form-select"><option value="standard">标准</option><option value="hd">高清</option></select></div>
                    </div>
                    <div class="form-group mt-3">
                      <label class="form-label">参考图（可选）<HelpBtn text="上传参考图可帮助模型保持角色或风格一致。仅部分 API 支持参考图。" /></label>
                      <UploadZone accept="image/*" multiple prompt="点击或拖拽上传 1 张或多张参考图" @files="t2i.refs = $event; previewT2iRefs()" />
                      <div v-if="t2i.refPreviews.length" class="flex flex-wrap gap-1.5 mt-2"><img v-for="(u,i) in t2i.refPreviews" :key="i" :src="u" class="w-16 h-16 object-cover rounded border border-af-rule" /></div>
                    </div>
                    <div class="flex gap-2 mt-3"><button class="btn-primary" :disabled="t2i.generating" @click="generateTxt2Img">{{ t2i.generating ? '生成中...' : '生成图像' }}</button></div>
                    <div v-if="t2i.progress > 0" class="h-1 bg-af-bg rounded overflow-hidden mt-3"><div class="h-full rounded bg-gradient-to-r from-af-accent to-af-accent2 transition-all" :style="{ width: t2i.progress + '%' }"></div></div>
                  </div>
                  <div class="text-[13px] font-semibold mb-2">生成结果</div>
                  <div class="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5">
                    <div v-for="n in parseInt(t2i.count.toString())" :key="n" class="aspect-square bg-af-surface border border-af-rule rounded-md overflow-hidden relative group cursor-pointer" @click="openPreview(t2i.results[n-1] || placeholderUrl)">
                      <img v-if="t2i.results[n-1]" :src="t2i.results[n-1]" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center text-xs text-af-muted bg-gradient-to-br from-af-surface to-af-surface-hover">等待生成</div>
                      <div v-if="t2i.results[n-1]" class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"><button class="w-7 h-7 rounded-md bg-white/15 text-white flex items-center justify-center" @click.stop="saveToLibrary(t2i.results[n-1], 'output')"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></button></div>
                    </div>
                  </div>
                </div>

                <!-- style transfer -->
                <div v-if="aiTab === 'style'" class="space-y-3">
                  <div class="bg-af-bg border border-af-rule rounded-lg p-3.5">
                    <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 items-start">
                      <div>
                        <div class="panel-title">目标图像</div>
                        <div class="preview-box h-[220px] relative">
                          <UploadZone v-if="!st.targetUrl" accept="image/*" prompt="上传目标图像" class="absolute inset-0" @files="loadStTarget($event)" />
                          <img v-else :src="st.targetUrl" class="max-w-full max-h-full object-contain" />
                          <button v-if="st.targetUrl" class="absolute bottom-2 left-1/2 -translate-x-1/2 btn-secondary btn-sm z-10" @click="st.targetUrl = ''">重新上传</button>
                        </div>
                      </div>
                      <div>
                        <div class="panel-title">风格参考</div>
                        <div class="preview-box h-[220px] relative">
                          <UploadZone v-if="!st.styleUrl" accept="image/*" prompt="上传风格参考图" class="absolute inset-0" @files="loadStStyle($event)" />
                          <img v-else :src="st.styleUrl" class="max-w-full max-h-full object-contain" />
                          <button v-if="st.styleUrl" class="absolute bottom-2 left-1/2 -translate-x-1/2 btn-secondary btn-sm z-10" @click="st.styleUrl = ''">重新上传</button>
                        </div>
                      </div>
                      <div>
                        <div class="panel-title">预览结果</div>
                        <div class="preview-box h-[220px]">
                          <img v-if="st.resultUrl" :src="st.resultUrl" class="max-w-full max-h-full object-contain" />
                          <span v-else class="text-af-muted text-sm">迁移后的图像将显示在这里</span>
                        </div>
                      </div>
                    </div>
                    <div class="form-group mt-3"><label class="form-label">风格描述 / 提示词</label><textarea v-model="st.prompt" rows="2" placeholder="可留空，使用参考图风格" class="form-textarea"></textarea></div>
                    <div class="flex gap-2 flex-wrap mt-3">
                      <button class="btn-primary" :disabled="st.running" @click="runStyleTransfer">{{ st.running ? '迁移中...' : '开始迁移' }}</button>
                      <button class="btn-secondary" @click="frontendStyleTransfer">前端色彩迁移（离线）</button>
                      <button v-if="st.resultUrl" class="btn-secondary" @click="saveToLibrary(st.resultUrl, 'output')">保存到资源库</button>
                    </div>
                  </div>
                </div>

                <!-- char simplify -->
                <div v-if="aiTab === 'simplify'" class="space-y-3">
                  <div class="flex gap-3 flex-wrap min-h-[320px]">
                    <div class="flex-1 min-w-[260px]">
                      <div class="preview-box h-[320px] relative">
                        <span class="preview-label">原图</span>
                        <UploadZone v-if="!cs.sourceUrl" accept="image/*" prompt="上传角色图像" class="w-[90%] h-[90%]" @files="loadCharSimplify($event)" />
                        <img v-else :src="cs.sourceUrl" class="max-w-full max-h-full object-contain" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-[260px]">
                      <div class="preview-box h-[320px] relative">
                        <span class="preview-label">结果</span>
                        <img v-if="cs.resultUrl" :src="cs.resultUrl" class="max-w-full max-h-full object-contain" />
                        <span v-else class="text-af-muted text-sm">处理结果</span>
                      </div>
                    </div>
                  </div>
                  <div class="bg-af-bg border border-af-rule rounded-lg p-3.5">
                    <div class="panel-title"><span>简化程度</span><HelpBtn text="上传角色图像，选择简化程度和颜色数，系统将缩放并量化颜色，生成像素风格结果。" /></div>
                    <div class="flex gap-1">
                      <button v-for="l in ['light','medium','heavy']" :key="l" class="flex-1 px-2 py-1.5 rounded-md text-xs border transition-colors" :class="cs.level === l ? 'bg-af-accent-soft border-af-accent text-af-accent' : 'bg-af-bg border-af-rule text-af-muted hover:text-af-ink'" @click="cs.level = l">{{ { light:'轻度', medium:'中度', heavy:'重度' }[l] }}</button>
                    </div>
                    <div class="form-row mt-3">
                      <div class="form-group"><label class="form-label">目标宽度</label><input v-model.number="cs.width" type="number" min="16" max="512" class="form-input" /></div>
                      <div class="form-group"><label class="form-label">颜色数</label><input v-model.number="cs.colors" type="number" min="2" max="64" class="form-input" /></div>
                    </div>
                    <div class="flex gap-2 mt-3">
                      <button class="btn-primary" :disabled="cs.running" @click="processCharSimplify">{{ cs.running ? '处理中...' : '处理' }}</button>
                      <button v-if="cs.resultUrl" class="btn-secondary" @click="saveToLibrary(cs.resultUrl, 'output')">保存到资源库</button>
                    </div>
                  </div>
                </div>

                <!-- pose gen -->
                <div v-if="aiTab === 'pose'" class="space-y-3">
                  <div class="bg-af-surface border border-af-accent rounded-lg p-3.5 mb-3">
                    <div class="panel-title text-af-accent">使用说明</div>
                    <div class="text-xs text-af-muted leading-relaxed">上传角色图像，从下方选择预设姿势。若已配置 API 密钥，将调用 API 生成匹配姿势；否则生成姿势骨架作为参考。</div>
                  </div>
                  <div class="flex gap-3 flex-wrap min-h-[300px]">
                    <div class="flex-1 min-w-[260px]">
                      <div class="preview-box h-[300px] relative">
                        <span class="preview-label">角色上传</span>
                        <UploadZone v-if="!pg.sourceUrl" accept="image/*" prompt="上传角色图像" class="w-[90%] h-[90%]" @files="loadPose($event)" />
                        <img v-else :src="pg.sourceUrl" class="max-w-full max-h-full object-contain" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-[260px]">
                      <div class="preview-box h-[300px] relative">
                        <span class="preview-label">姿势预览</span>
                        <canvas v-if="pg.resultCanvas" ref="pgResultCanvas" class="max-w-full max-h-full"></canvas>
                        <span v-else class="text-af-muted text-sm">选择预设姿势生成骨架</span>
                      </div>
                    </div>
                  </div>
                  <div class="bg-af-bg border border-af-rule rounded-lg p-3.5">
                    <div class="form-group"><label class="form-label">预设姿势<HelpBtn text="上传角色图像并选择姿势。未配置 API 时生成姿势骨架参考；配置 API 后可尝试生成对应姿势。" /></label></div>
                    <div class="flex flex-wrap gap-1.5">
                      <button v-for="p in posePresets" :key="p" class="px-3 py-1 rounded-full text-xs border transition-colors" :class="pg.pose === p ? 'bg-af-accent-soft border-af-accent text-af-accent' : 'bg-af-bg border-af-rule text-af-muted hover:text-af-ink'" @click="pg.pose = p">{{ poseNames[p] }}</button>
                    </div>
                    <div class="flex gap-2 mt-3"><button class="btn-primary" @click="generatePoseFrontend">预览骨架</button><button class="btn-secondary" @click="generatePoseApi">API生成（需配置）</button></div>
                  </div>
                </div>
              </div>
            </section>

            <!-- PIXEL STUDIO -->
            <section v-show="currentScreen === 'pixel-studio'" class="flex flex-col flex-1 overflow-auto">
              <div class="flex items-center justify-between px-5 pt-3.5 pb-2.5 shrink-0">
                <div>
                  <h1 class="text-[22px] font-bold tracking-tight flex items-center gap-2">像素画室</h1>
                  <p class="text-[13px] text-af-muted mt-0.5">像素绘画、精细处理与动作生成</p>
                </div>
              </div>
              <div class="flex-1 overflow-y-auto px-5 pb-4">
                <div class="flex gap-2 mb-3 flex-wrap">
                  <button v-for="t in pixelTabs" :key="t.key" class="px-3 py-1.5 rounded-md text-xs font-medium border transition-colors" :class="pixelTab === t.key ? 'bg-af-accent-soft border-af-accent text-af-accent' : 'bg-af-surface border-af-rule text-af-muted hover:text-af-ink hover:border-af-ink/30'" @click="pixelTab = t.key">{{ t.label }}</button>
                </div>

                <!-- pixel draw -->
                <div v-if="pixelTab === 'draw'" class="space-y-3">
                  <div class="flex gap-2 items-center flex-wrap mb-3">
                    <button v-for="t in pixelTools" :key="t.key" class="w-8 h-8 rounded-md bg-af-bg border border-af-rule text-af-muted flex items-center justify-center" :class="pd.tool === t.key ? 'bg-af-accent-soft border-af-accent text-af-accent' : 'hover:text-af-ink'" :title="t.label" @click="pd.tool = t.key"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="t.icon"></svg></button>
                    <div class="w-px h-6 bg-af-rule mx-1"></div>
                    <div class="form-group w-20 !mb-0"><label class="form-label">画笔大小</label><input v-model.number="pd.brush" type="number" min="1" max="8" class="form-input" /></div>
                    <div class="form-group w-28 !mb-0"><label class="form-label">缩放</label><div class="slider-wrap"><input v-model.number="pd.zoom" type="range" min="1" max="32" class="flex-1 accent-af-accent h-1"><span class="slider-value">{{ pd.zoom }}x</span></div></div>
                    <div class="w-px h-6 bg-af-rule mx-1"></div>
                    <button class="btn-secondary btn-sm" @click="importPixelFromLibrary">从资源库导入</button>
                    <button class="btn-secondary btn-sm" @click="triggerPixelImport">从本地导入</button>
                    <input ref="pixelImportInput" type="file" accept="image/*" class="hidden" @change="handlePixelImport" />
                    <button class="btn-secondary btn-sm" @click="pd.bg = pd.bg === 'black' ? 'white' : 'black'">背景: {{ pd.bg === 'black' ? '黑' : '白' }}</button>
                  </div>
                  <div class="flex gap-3 flex-wrap h-[520px]">
                    <div class="flex-1 min-w-[260px] bg-[#0e0e14] border border-af-rule rounded-lg overflow-auto flex items-center justify-center relative">
                      <canvas ref="pixelCanvas" :width="pd.w * pd.zoom" :height="pd.h * pd.zoom" class="image-pixelated"></canvas>
                    </div>
                    <div class="w-[210px] bg-af-surface border border-af-rule rounded-lg p-3 overflow-y-auto shrink-0">
                      <div class="panel-title">当前色</div>
                      <div class="flex items-center gap-2 mb-3"><input v-model="pd.color" type="color" class="w-10 h-10 rounded-md border-0 cursor-pointer bg-transparent"><span class="font-mono text-[13px] text-af-muted">{{ pd.color }}</span></div>
                      <div class="panel-title">调色板</div>
                      <div class="grid grid-cols-8 gap-1 mb-3"><button v-for="c in pixelPalette" :key="c" class="aspect-square rounded-sm border border-af-rule" :style="{ background: c }" @click="pd.color = c"></button></div>
                      <div class="panel-title">最近颜色</div>
                      <div class="grid grid-cols-8 gap-1 mb-3"><button v-for="c in pd.recent" :key="c" class="aspect-square rounded-sm border border-af-rule" :style="{ background: c }" @click="pd.color = c"></button></div>
                      <div class="panel-title">图层</div>
                      <div class="space-y-1.5"><div v-for="(l,i) in pd.layers" :key="i" class="flex items-center gap-2 px-1.5 py-1 bg-af-bg border border-af-rule rounded-md cursor-pointer text-xs" :class="pd.layer === i ? 'border-af-accent' : ''" @click="pd.layer = i"><span>{{ l.name }}</span><span class="ml-auto text-af-muted">{{ l.visible ? '👁' : '' }}</span></div></div>
                      <div class="flex gap-2 mt-3"><button class="btn-primary btn-sm" @click="exportPixelPng">导出 PNG</button><button class="btn-secondary btn-sm" @click="savePixelToLibrary">保存到资源库</button></div>
                      <div class="text-[11px] text-af-muted mt-2">快捷键: Ctrl+Z 撤销, Ctrl+Y 重做</div>
                    </div>
                  </div>
                </div>

                <!-- pixel process -->
                <div v-if="pixelTab === 'process'" class="space-y-3">
                  <div class="flex gap-3 flex-wrap min-h-[340px]">
                    <div class="flex-1 min-w-[260px]">
                      <div class="preview-box h-[340px] relative">
                        <span class="preview-label">原图</span>
                        <UploadZone v-if="!pp.sourceUrl" accept="image/*" prompt="上传像素图像" class="w-[90%] h-[90%]" @files="loadPixelProcess($event)" />
                        <img v-else :src="pp.sourceUrl" class="max-w-full max-h-full object-contain" />
                        <button v-if="pp.sourceUrl" class="absolute bottom-2 left-1/2 -translate-x-1/2 btn-secondary btn-sm" @click="pp.sourceUrl = ''">重新上传</button>
                      </div>
                    </div>
                    <div class="flex-1 min-w-[260px]">
                      <div class="preview-box h-[340px] relative">
                        <span class="preview-label">结果</span>
                        <img v-if="pp.resultUrl" :src="pp.resultUrl" class="max-w-full max-h-full object-contain" />
                        <span v-else class="text-af-muted text-sm">处理结果</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-row flex-wrap">
                    <div class="form-group w-36"><label class="form-label">宽度</label><select v-model="pp.width" class="form-select"><option value="32">32px</option><option value="64">64px</option><option value="128">128px</option><option value="256">256px</option><option value="custom">自定义</option></select></div>
                    <div class="form-group w-24"><label class="form-label">自定义宽</label><input v-model.number="pp.customWidth" type="number" min="8" max="1024" class="form-input" /></div>
                    <div class="form-group w-36"><label class="form-label">缩放算法</label><select v-model="pp.scaleMode" class="form-select"><option value="nearest">最近邻</option><option value="pixel">像素艺术</option></select></div>
                    <div class="form-group w-28"><label class="form-label">内描边</label><select v-model="pp.outline" class="form-select"><option value="none">无</option><option value="inner">内描边</option><option value="outline">外描边</option></select></div>
                    <div class="form-group w-28"><label class="form-label">颜色数</label><input v-model.number="pp.colors" type="number" min="2" max="256" class="form-input" /></div>
                    <div class="form-group w-36"><label class="form-label">抖动</label><select v-model="pp.dither" class="form-select"><option value="none">无</option><option value="bayer">Bayer</option></select></div>
                  </div>
                  <div class="flex gap-2"><button class="btn-primary" @click="applyPixelProcess">处理</button><button v-if="pp.resultUrl" class="btn-secondary" @click="downloadUrl(pp.resultUrl, 'pixel_process.png')">下载</button><button v-if="pp.resultUrl" class="btn-secondary" @click="saveToLibrary(pp.resultUrl, 'output')">保存到资源库</button></div>
                </div>

                <!-- pixel char -->
                <div v-if="pixelTab === 'action'" class="space-y-3">
                  <div class="flex gap-3 flex-wrap min-h-[300px]">
                    <div class="flex-1 min-w-[260px]">
                      <div class="preview-box h-[300px] relative">
                        <span class="preview-label">参考图</span>
                        <UploadZone v-if="!pc.sourceUrl" accept="image/*" prompt="上传参考图" class="w-[90%] h-[90%]" @files="loadPixelChar($event)" />
                        <img v-else :src="pc.sourceUrl" class="max-w-full max-h-full object-contain" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-[260px]">
                      <div class="preview-box h-[300px] relative">
                        <span class="preview-label">生成结果</span>
                        <canvas v-if="pc.resultCanvas" ref="pcResultCanvas" class="max-w-full max-h-full"></canvas>
                        <span v-else class="text-af-muted text-sm">生成结果</span>
                      </div>
                    </div>
                  </div>
                  <div class="bg-af-bg border border-af-rule rounded-lg p-3.5">
                    <div class="panel-title"><span>模板风格</span><HelpBtn text="V1/V2/V3 分别对应 4 帧、8 帧、2 帧动作模板。选择动作类型后生成像素动画。" /></div>
                    <div class="flex items-center gap-3 flex-wrap mb-3">
                      <div class="flex flex-wrap gap-1.5">
                        <button v-for="s in pcStyles" :key="s.key" class="px-3 py-1 rounded-full text-xs border transition-colors" :class="pc.style === s.key ? 'bg-af-accent-soft border-af-accent text-af-accent' : 'bg-af-bg border-af-rule text-af-muted hover:text-af-ink'" @click="pc.style = s.key">{{ s.label }}</button>
                      </div>
                      <span class="text-xs text-af-muted">{{ pcStyleDesc }}</span>
                    </div>
                    <div class="form-row">
                      <div class="form-group"><label class="form-label">动作类型</label><select v-model="pc.action" class="form-select"><option value="walk">行走</option><option value="run">奔跑</option><option value="idle">待机</option></select></div>
                      <div class="form-group"><label class="form-label">输出宽度</label><input v-model.number="pc.width" type="number" min="16" max="128" class="form-input" /></div>
                      <div class="form-group"><label class="form-label">颜色数</label><input v-model.number="pc.colors" type="number" min="4" max="64" class="form-input" /></div>
                    </div>
                    <div class="flex gap-2 mt-3"><button class="btn-primary" @click="generatePixelChar">生成像素动作</button><button v-if="pc.resultCanvas" class="btn-secondary" @click="downloadPixelCharSprite">下载动作精灵图</button><button v-if="pc.resultCanvas" class="btn-secondary" @click="savePixelCharToLibrary">保存到资源库</button></div>
                  </div>
                </div>
              </div>
            </section>

            <!-- SEQUENCE FRAME -->
            <section v-show="currentScreen === 'sequence-frame'" class="flex flex-col flex-1 overflow-auto">
              <div class="flex items-center justify-between px-5 pt-3.5 pb-2.5 shrink-0">
                <div>
                  <h1 class="text-[22px] font-bold tracking-tight flex items-center gap-2">序列帧工场</h1>
                  <p class="text-[13px] text-af-muted mt-0.5">视频/GIF 提取帧、合成精灵图</p>
                </div>
              </div>
              <div class="flex-1 overflow-y-auto px-5 pb-4">
                <div class="flex gap-2 mb-3 flex-wrap">
                  <button v-for="t in seqTabs" :key="t.key" class="px-3 py-1.5 rounded-md text-xs font-medium border transition-colors" :class="seqTab === t.key ? 'bg-af-accent-soft border-af-accent text-af-accent' : 'bg-af-surface border-af-rule text-af-muted hover:text-af-ink hover:border-af-ink/30'" @click="seqTab = t.key">{{ t.label }}</button>
                </div>

                <!-- video frames -->
                <div v-if="seqTab === 'video'" class="space-y-3">
                  <div class="steps-bar">
                    <button v-for="n in 3" :key="n" class="step-pill" :class="video.step === n ? 'active' : ''" @click="video.step = n"><span class="step-num">{{ n }}</span><span>{{ ['上传·裁剪·提取','处理提取帧','导出处理结果'][n-1] }}</span></button>
                  </div>
                  <div v-if="video.step === 1" class="space-y-3">
                    <UploadZone v-if="!video.file" accept="video/mp4,video/webm,video/quicktime" prompt="上传视频文件 (MP4, MOV, WebM)" hint="点击选择或拖拽文件到此处" @files="loadVideo($event)" />
                    <div v-else class="space-y-3">
                      <div class="flex gap-3 flex-wrap">
                        <div class="flex-1 min-w-[260px]">
                          <div class="panel-title"><span>源视频</span><HelpBtn text="在左侧视频上拖动虚线矩形选择裁剪区域。右侧实时显示裁剪预览。所有提取帧都会应用此裁剪。" /></div>
                          <div class="bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-[280px]"><video ref="sourceVideo" :src="video.url" class="max-w-full max-h-[360px] block" crossorigin="anonymous"></video></div>
                        </div>
                        <div class="flex-1 min-w-[260px]">
                          <div class="panel-title">裁剪预览</div>
                          <div class="bg-af-surface border border-af-rule rounded-lg overflow-hidden flex items-center justify-center min-h-[280px]"><canvas ref="cropPreviewCanvas" class="max-w-full max-h-[360px]"></canvas></div>
                          <div class="text-xs text-af-muted text-center mt-2">输出尺寸</div>
                        </div>
                      </div>
                      <div class="bg-af-bg border border-af-rule rounded-lg p-3.5">
                        <div class="panel-title">视频信息</div>
                        <div class="form-row"><div class="form-group"><label class="form-label">文件名</label><input :value="video.file.name" readonly class="form-input" /></div><div class="form-group"><label class="form-label">时长</label><input :value="video.duration.toFixed(2)+'s'" readonly class="form-input" /></div><div class="form-group"><label class="form-label">分辨率</label><input :value="video.width+'x'+video.height" readonly class="form-input" /></div></div>
                      </div>
                      <div class="bg-af-bg border border-af-rule rounded-lg p-3.5">
                        <div class="panel-title"><span>提取设置</span><HelpBtn text="设置每秒提取帧数、输出宽高，然后点击“提取帧”。提取会应用裁剪并缩放到目标尺寸。" /></div>
                        <div class="form-row">
                          <div class="form-group"><label class="form-label">每秒提取帧数</label><input v-model.number="video.fps" type="number" min="1" max="60" class="form-input" /></div>
                          <div class="form-group"><label class="form-label">输出宽度</label><input v-model.number="video.outW" type="number" min="1" max="2048" class="form-input" /></div>
                          <div class="form-group"><label class="form-label">输出高度</label><input v-model.number="video.outH" type="number" min="1" max="2048" class="form-input" /></div>
                          <div class="form-group"><label class="form-label">预计帧数</label><input :value="Math.floor(video.duration * video.fps)" readonly class="form-input" /></div>
                        </div>
                        <div v-if="video.progress > 0" class="h-1 bg-af-bg rounded overflow-hidden mt-3"><div class="h-full rounded bg-gradient-to-r from-af-accent to-af-accent2 transition-all" :style="{ width: video.progress + '%' }"></div></div>
                        <div class="flex gap-2 mt-3"><button class="btn-primary" @click="extractVideoFrames">提取帧</button></div>
                      </div>
                    </div>
                  </div>
                  <div v-if="video.step === 2" class="space-y-3">
                    <div class="bg-af-bg border border-af-rule rounded-lg p-3.5 flex gap-2 flex-wrap items-center">
                      <button class="btn-secondary" @click="detectSimilarFrames">检测相似帧</button>
                      <button class="btn-secondary" @click="selectAllFrames">全选</button>
                      <button class="btn-secondary" @click="deselectAllFrames">取消全选</button>
                      <div class="flex-1"></div>
                      <span class="text-xs text-af-muted">点击缩略图编辑；点击左上角复选框选择</span>
                    </div>
                    <div class="flex gap-3 flex-wrap">
                      <div class="flex-1 min-w-[260px]"><div class="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5"><div v-for="(f,i) in video.frames" :key="i" class="bg-af-surface border border-af-rule rounded-md overflow-hidden cursor-pointer relative transition-all hover:border-af-accent" :class="f.selected ? 'border-af-accent shadow-[0_0_0_2px_rgba(0,212,170,0.12)]' : ''" @click="openFrameEditor(i)"><input type="checkbox" v-model="f.selected" class="absolute top-1.5 left-1.5 w-4 h-4 z-10 accent-af-accent" @click.stop><img :src="f.url" class="w-full object-contain bg-[#0e0e14]"><div class="px-2 py-1 text-[11px] text-af-muted flex justify-between"><span>#{{ i+1 }}</span><span v-if="f.similar" class="text-af-warning">相似</span></div></div></div></div>
                      <div class="w-60 shrink-0 flex flex-col gap-2.5">
                        <div class="flex-1 bg-af-surface border border-af-rule rounded-lg overflow-hidden flex items-center justify-center relative min-h-[200px]"><canvas ref="videoAnimCanvas" class="max-w-full max-h-full"></canvas></div>
                        <div class="form-group !mb-0"><label class="form-label">预览 FPS</label><div class="slider-wrap"><input v-model.number="video.previewFps" type="range" min="1" max="60" class="flex-1 accent-af-accent h-1"><span class="slider-value">{{ video.previewFps }}</span></div></div>
                        <button class="btn-primary btn-sm" @click="toggleVideoPreview">{{ video.playing ? '暂停' : '播放' }}</button>
                      </div>
                    </div>
                  </div>
                  <div v-if="video.step === 3" class="space-y-3">
                    <div class="bg-af-bg border border-af-rule rounded-lg p-3.5">
                      <div class="panel-title"><span>导出选项</span><HelpBtn text="选择导出格式：WebM 视频、GIF、ZIP 序列帧或精灵图。可设置压缩等级与导出尺寸。" /></div>
                      <div class="form-row">
                        <div class="form-group"><label class="form-label">导出格式</label><select v-model="video.export.format" class="form-select"><option value="video">视频 (WebM)</option><option value="gif">GIF</option><option value="zip">序列帧 (ZIP)</option><option value="sprite">精灵图 (+JSON)</option></select></div>
                        <div v-if="video.export.format === 'sprite'" class="form-group"><label class="form-label">精灵图列数</label><input v-model.number="video.export.cols" type="number" min="1" class="form-input" /></div>
                      </div>
                      <div class="panel-title mt-2">导出尺寸</div>
                      <div class="form-row">
                        <div class="form-group"><label class="form-label">预设</label><select v-model="video.export.preset" class="form-select"><option value="custom">自定义</option><option value="64x64">64x64</option><option value="128x128">128x128</option><option value="512x512">512x512</option></select></div>
                        <div class="form-group"><label class="form-label">宽</label><input v-model.number="video.export.w" type="number" min="1" class="form-input" /></div>
                        <div class="form-group"><label class="form-label">高</label><input v-model.number="video.export.h" type="number" min="1" class="form-input" /></div>
                        <label class="flex items-center gap-1.5 text-xs text-af-muted self-end pb-2"><input v-model="video.export.lockAspect" type="checkbox" checked> 锁定宽高比</label>
                      </div>
                      <div class="form-row">
                        <div class="form-group"><label class="form-label">压缩等级</label><select v-model="video.export.compression" class="form-select"><option value="low">低压缩（无损）</option><option value="medium">中压缩</option><option value="high">高压缩</option></select></div>
                        <div class="form-group"><label class="form-label">GIF 延迟(ms)</label><input v-model.number="video.export.delay" type="number" min="20" class="form-input" /></div>
                        <div class="form-group"><label class="form-label">文件名</label><input v-model="video.export.name" class="form-input" /></div>
                      </div>
                      <div class="flex gap-2 mt-3"><button class="btn-primary" @click="generateVideoExportPreview">生成预览</button><button v-if="video.export.preview" class="btn-secondary" @click="downloadUrl(video.export.preview, video.export.name + '.png')">下载</button></div>
                    </div>
                    <div class="bg-af-bg border border-af-rule rounded-lg p-3.5">
                      <div class="panel-title">导出预览</div>
                      <div class="preview-box min-h-[320px]"><img v-if="video.export.preview" :src="video.export.preview" class="max-w-full max-h-full object-contain" /><span v-else class="text-af-muted text-sm">点击“生成预览”后在此显示结果</span></div>
                    </div>
                  </div>
                </div>

                <!-- gif frames -->
                <div v-if="seqTab === 'gif'" class="space-y-3">
                  <div class="steps-bar">
                    <button v-for="n in 3" :key="n" class="step-pill" :class="gif.step === n ? 'active' : ''" @click="gif.step = n"><span class="step-num">{{ n }}</span><span>{{ ['上传·裁剪·提取','处理提取帧','导出处理结果'][n-1] }}</span></button>
                  </div>
                  <div v-if="gif.step === 1" class="space-y-3">
                    <UploadZone v-if="!gif.file" accept="image/gif" prompt="上传 GIF 文件" hint="点击选择或拖拽文件到此处" @files="loadGif($event)" />
                    <div v-else class="space-y-3">
                      <div class="bg-af-bg border border-af-rule rounded-lg p-3.5">
                        <div class="panel-title"><span>提取设置</span><HelpBtn text="设置每秒提取帧数。GIF 会按时间间隔抽取帧并应用裁剪。" /></div>
                        <div class="form-row">
                          <div class="form-group"><label class="form-label">每秒提取帧数</label><input v-model.number="gif.fps" type="number" min="1" max="60" class="form-input" /></div>
                          <div class="form-group"><label class="form-label">输出宽度</label><input v-model.number="gif.outW" type="number" min="1" max="2048" class="form-input" /></div>
                          <div class="form-group"><label class="form-label">输出高度</label><input v-model.number="gif.outH" type="number" min="1" max="2048" class="form-input" /></div>
                          <div class="form-group"><label class="form-label">预计帧数</label><input :value="gif.frames.length || '-'" readonly class="form-input" /></div>
                        </div>
                        <div class="flex gap-2 mt-3"><button class="btn-primary" @click="extractGifFrames">提取帧</button></div>
                      </div>
                    </div>
                  </div>
                  <div v-if="gif.step === 2" class="space-y-3">
                    <div class="bg-af-bg border border-af-rule rounded-lg p-3.5 flex gap-2 flex-wrap items-center"><button class="btn-secondary" @click="detectSimilarGifFrames">检测相似帧</button><button class="btn-secondary" @click="selectAllGifFrames">全选</button><button class="btn-secondary" @click="deselectAllGifFrames">取消全选</button><div class="flex-1"></div><span class="text-xs text-af-muted">点击缩略图编辑；点击左上角复选框选择</span></div>
                    <div class="flex gap-3 flex-wrap">
                      <div class="flex-1 min-w-[260px]"><div class="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5"><div v-for="(f,i) in gif.frames" :key="i" class="bg-af-surface border border-af-rule rounded-md overflow-hidden cursor-pointer relative transition-all hover:border-af-accent" :class="f.selected ? 'border-af-accent shadow-[0_0_0_2px_rgba(0,212,170,0.12)]' : ''"><input type="checkbox" v-model="f.selected" class="absolute top-1.5 left-1.5 w-4 h-4 z-10 accent-af-accent" @click.stop><img :src="f.url" class="w-full object-contain bg-[#0e0e14]"><div class="px-2 py-1 text-[11px] text-af-muted flex justify-between"><span>#{{ i+1 }}</span></div></div></div></div>
                      <div class="w-60 shrink-0 flex flex-col gap-2.5">
                        <div class="flex-1 bg-af-surface border border-af-rule rounded-lg overflow-hidden flex items-center justify-center relative min-h-[200px]"><canvas ref="gifAnimCanvas" class="max-w-full max-h-full"></canvas></div>
                        <div class="form-group !mb-0"><label class="form-label">预览 FPS</label><div class="slider-wrap"><input v-model.number="gif.previewFps" type="range" min="1" max="60" class="flex-1 accent-af-accent h-1"><span class="slider-value">{{ gif.previewFps }}</span></div></div>
                        <button class="btn-primary btn-sm" @click="toggleGifPreview">{{ gif.playing ? '暂停' : '播放' }}</button>
                      </div>
                    </div>
                  </div>
                  <div v-if="gif.step === 3" class="space-y-3">
                    <div class="bg-af-bg border border-af-rule rounded-lg p-3.5">
                      <div class="panel-title">导出选项</div>
                      <div class="form-row">
                        <div class="form-group"><label class="form-label">导出格式</label><select v-model="gif.export.format" class="form-select"><option value="video">视频 (WebM)</option><option value="gif">GIF</option><option value="zip">序列帧 (ZIP)</option><option value="sprite">精灵图 (+JSON)</option></select></div>
                        <div v-if="gif.export.format === 'sprite'" class="form-group"><label class="form-label">精灵图列数</label><input v-model.number="gif.export.cols" type="number" min="1" class="form-input" /></div>
                      </div>
                      <div class="form-row">
                        <div class="form-group"><label class="form-label">宽</label><input v-model.number="gif.export.w" type="number" min="1" class="form-input" /></div>
                        <div class="form-group"><label class="form-label">高</label><input v-model.number="gif.export.h" type="number" min="1" class="form-input" /></div>
                        <div class="form-group"><label class="form-label">文件名</label><input v-model="gif.export.name" class="form-input" /></div>
                      </div>
                      <div class="flex gap-2 mt-3"><button class="btn-primary" @click="generateGifExportPreview">生成预览</button><button v-if="gif.export.preview" class="btn-secondary" @click="downloadUrl(gif.export.preview, gif.export.name + '.png')">下载</button></div>
                    </div>
                    <div class="bg-af-bg border border-af-rule rounded-lg p-3.5"><div class="panel-title">导出预览</div><div class="preview-box min-h-[320px]"><img v-if="gif.export.preview" :src="gif.export.preview" class="max-w-full max-h-full object-contain" /><span v-else class="text-af-muted text-sm">点击“生成预览”后在此显示结果</span></div></div>
                  </div>
                </div>

                <!-- sprite sheet -->
                <div v-if="seqTab === 'sprite'" class="space-y-3">
                  <UploadZone v-if="!sprite.images.length" accept="image/*" multiple prompt="上传多张图像" hint="支持 PNG (保留透明), JPG, WebP" @files="loadSpriteImages($event)" />
                  <div v-else class="space-y-3">
                    <div class="bg-af-bg border border-af-rule rounded-lg p-3.5">
                      <div class="panel-title"><span>布局设置</span><HelpBtn text="上传多张图像，设置列数、间距与背景，可下载 PNG 精灵图与 JSON 元数据。" /></div>
                      <div class="form-row">
                        <div class="form-group"><label class="form-label">列数</label><input v-model.number="sprite.cols" type="number" min="1" class="form-input" /></div>
                        <div class="form-group"><label class="form-label">行数 (自动)</label><input :value="spriteRows" readonly class="form-input" /></div>
                        <div class="form-group"><label class="form-label">帧间距 (px)</label><input v-model.number="sprite.padding" type="number" min="0" class="form-input" /></div>
                        <div class="form-group"><label class="form-label">背景</label><select v-model="sprite.bg" class="form-select"><option value="transparent">透明</option><option value="#000000">黑色</option><option value="#ffffff">白色</option></select></div>
                      </div>
                      <div class="flex gap-2 mt-3"><button class="btn-primary" @click="downloadSpriteSheet">下载 PNG</button><button class="btn-secondary" @click="downloadSpriteJson">下载 JSON 元数据</button><button class="btn-secondary" @click="saveSpriteToLibrary">保存到资源库</button></div>
                    </div>
                    <div>
                      <div class="text-[13px] font-semibold mb-2">预览</div>
                      <div class="bg-[#0e0e14] border border-af-rule rounded-lg overflow-auto p-5 flex items-center justify-center min-h-[300px]"><canvas ref="spritePreviewCanvas" class="max-w-full max-h-full"></canvas></div>
                    </div>
                    <div>
                      <div class="text-[13px] font-semibold mb-2">源图像 ({{ sprite.images.length }})</div>
                      <div class="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5"><div v-for="(img,i) in sprite.images" :key="i" class="bg-af-surface border border-af-rule rounded-md overflow-hidden relative group"><img :src="img.url" class="w-full object-contain bg-[#0e0e14]"><div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><button class="w-7 h-7 rounded-md bg-white/15 text-white flex items-center justify-center" @click="sprite.images.splice(i,1)"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- MAP EDITOR -->
            <section v-show="currentScreen === 'map-editor'" class="flex flex-col flex-1 overflow-auto">
              <div class="flex items-center justify-between px-5 pt-3.5 pb-2.5 shrink-0">
                <div>
                  <h1 class="text-[22px] font-bold tracking-tight flex items-center gap-2">地图编辑器</h1>
                  <p class="text-[13px] text-af-muted mt-0.5">双网格瓦片地图绘制与预览</p>
                </div>
              </div>
              <div class="flex-1 overflow-y-auto px-5 pb-4">
                <div class="flex gap-2 mb-3 flex-wrap">
                  <button v-for="t in mapTabs" :key="t.key" class="px-3 py-1.5 rounded-md text-xs font-medium border transition-colors" :class="mapTab === t.key ? 'bg-af-accent-soft border-af-accent text-af-accent' : 'bg-af-surface border-af-rule text-af-muted hover:text-af-ink hover:border-af-ink/30'" @click="mapTab = t.key">{{ t.label }}</button>
                </div>

                <!-- tilemap -->
                <div v-if="mapTab === 'tilemap'" class="space-y-3">
                  <div class="flex gap-3 flex-wrap mb-3">
                    <div class="flex flex-col gap-2.5 w-[200px] shrink-0">
                      <div class="form-group"><label class="form-label">瓦片集</label><UploadZone accept="image/*" prompt="上传瓦片集" class="py-5" @files="loadTileset($event)" /></div>
                      <div class="bg-af-bg border border-af-rule rounded-lg p-3 flex-1 overflow-auto">
                        <div class="panel-title">图块选择</div>
                        <div v-if="!tm.tilesetUrl" class="text-xs text-af-muted">请先上传瓦片集</div>
                        <img v-else :src="tm.tilesetUrl" class="w-full object-contain border border-af-rule rounded" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-[260px]"><div class="bg-[#0e0e14] border border-af-rule rounded-lg overflow-hidden h-[460px] flex items-center justify-center"><canvas ref="tilemapCanvas" width="800" height="460" class="max-w-full max-h-full"></canvas></div></div>
                  </div>
                  <div class="flex gap-2.5 items-center flex-wrap">
                    <div class="text-xs font-semibold">工具</div>
                    <button v-for="t in tmTools" :key="t.key" class="w-8 h-8 rounded-md bg-af-bg border border-af-rule text-af-muted flex items-center justify-center" :class="tm.tool === t.key ? 'bg-af-accent-soft border-af-accent text-af-accent' : 'hover:text-af-ink'" :title="t.label" @click="tm.tool = t.key"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="t.icon"></svg></button>
                    <div class="w-px h-6 bg-af-rule mx-1"></div>
                    <label class="flex items-center gap-1.5 text-xs text-af-muted"><input v-model="tm.showGrid" type="checkbox" checked> 显示网格</label>
                    <label class="flex items-center gap-1.5 text-xs text-af-muted"><input v-model="tm.detail" type="checkbox"> 细节层</label>
                    <div class="flex-1"></div>
                    <div class="form-group w-24 !mb-0"><label class="form-label">地图宽</label><input v-model.number="tm.w" type="number" min="4" max="128" class="form-input" /></div>
                    <div class="form-group w-24 !mb-0"><label class="form-label">地图高</label><input v-model.number="tm.h" type="number" min="4" max="128" class="form-input" /></div>
                  </div>
                  <div class="flex gap-2 flex-wrap"><button class="btn-primary" @click="exportTilemapJson">导出 JSON</button><button class="btn-secondary" @click="exportTilemapPng">导出 PNG</button><button class="btn-secondary" @click="saveTilemapToLibrary">保存到资源库</button></div>
                </div>

                <!-- topdown preview -->
                <div v-if="mapTab === 'preview'" class="space-y-3">
                  <div class="bg-[#0e0e14] border border-af-rule rounded-lg overflow-hidden h-[460px] flex items-center justify-center"><canvas ref="topdownCanvas" width="800" height="460" class="max-w-full max-h-full"></canvas></div>
                  <div class="flex gap-2.5 items-center flex-wrap">
                    <div class="text-xs text-af-muted">控制: <span class="text-af-ink font-medium">WASD</span> 移动</div>
                    <div class="w-px h-4 bg-af-rule"></div>
                    <button class="btn-secondary btn-sm" @click="triggerTopdownMap">上传本地地图</button>
                    <button class="btn-secondary btn-sm" @click="triggerTopdownChar">上传本地角色</button>
                    <input ref="topdownMapInput" type="file" accept="image/*" class="hidden" @change="loadTopdownMap($event)" />
                    <input ref="topdownCharInput" type="file" accept="image/*" class="hidden" @change="loadTopdownChar($event)" />
                    <div class="flex-1"></div>
                    <button class="btn-primary btn-sm" @click="topdownScreenshot">截图</button>
                  </div>
                </div>
              </div>
            </section>

            <!-- RESOURCE LIBRARY -->
            <section v-show="currentScreen === 'resource-library'" class="flex flex-col flex-1 overflow-auto">
              <div class="flex items-center justify-between px-5 pt-3.5 pb-2.5 shrink-0">
                <div>
                  <h1 class="text-[22px] font-bold tracking-tight flex items-center gap-2">资源库</h1>
                  <p class="text-[13px] text-af-muted mt-0.5">本地 IndexedDB 资源管理</p>
                </div>
                <div class="flex gap-2"><button class="btn-secondary" @click="exportAssets">导出全部</button><button class="btn-primary" @click="triggerAssetImport">导入文件</button><input ref="assetImportInput" type="file" accept="image/*" multiple class="hidden" @change="handleAssetImport" /></div>
              </div>
              <div class="flex-1 overflow-hidden px-5 pb-4">
                <div class="flex h-full border border-af-rule rounded-lg overflow-hidden">
                  <div class="w-44 shrink-0 border-r border-af-rule bg-af-surface flex flex-col overflow-hidden">
                    <div class="px-3.5 py-3 font-semibold text-[13px] border-b border-af-rule">项目 / 类型</div>
                    <button v-for="f in assetFilters" :key="f.key" class="px-3.5 py-2 text-[13px] text-left transition-colors" :class="assetFilter === f.key ? 'text-af-accent bg-af-accent-soft' : 'text-af-muted hover:text-af-ink hover:bg-af-surface-hover'" @click="assetFilter = f.key">{{ f.label }}</button>
                  </div>
                  <div class="flex-1 flex flex-col overflow-hidden min-w-0">
                    <div class="px-4 py-2.5 border-b border-af-rule flex items-center justify-between gap-2 flex-wrap">
                      <div class="relative w-64">
                        <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-af-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
                        <input v-model="assetSearch" type="text" placeholder="搜索资源..." class="w-full bg-af-bg border border-af-rule rounded-md py-1.5 pl-8 pr-3 text-af-ink text-[13px] outline-none focus:border-af-accent placeholder:text-af-muted" />
                      </div>
                      <div class="flex gap-2 items-center"><button class="btn-secondary btn-sm" @click="selectAllAssets">全选</button><button class="btn-danger btn-sm" @click="deleteSelectedAssets">删除选中</button><span class="text-xs text-af-muted">{{ filteredAssets.length }} 项资源</span></div>
                    </div>
                    <div class="flex-1 overflow-y-auto p-3.5">
                      <div v-if="!filteredAssets.length" class="h-full flex items-center justify-center text-af-muted text-lg text-center p-10">资源库为空<br>点击“导入文件”或在工作区“保存到资源库”</div>
                      <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2.5"><div v-for="a in filteredAssets" :key="a.id" class="aspect-square bg-af-surface border border-af-rule rounded-md overflow-hidden cursor-pointer relative transition-all hover:border-af-accent" :class="a.selected ? 'border-af-accent shadow-[0_0_0_2px_rgba(0,212,170,0.12)]' : ''" @click="openPreview(a.thumb)"><img :src="a.thumb" class="w-full h-full object-cover bg-[#0e0e14]"><div class="absolute bottom-0 left-0 right-0 px-1.5 py-1 text-[11px] bg-black/70 text-af-ink truncate">{{ a.name }}</div><input type="checkbox" v-model="a.selected" class="absolute top-1.5 left-1.5 w-4 h-4 accent-af-accent z-10" @click.stop></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>

    <!-- Status bar -->
    <div class="h-7 flex items-center justify-between px-3.5 text-[11px] text-af-muted border-t border-af-rule bg-af-surface shrink-0">
      <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-af-accent"></span><span>{{ statusText }}</span></div>
      <div>{{ statusExtra }}</div>
    </div>

    <!-- API Settings Modal -->
    <div v-if="apiOpen" class="fixed inset-0 bg-black/75 z-[100] flex items-center justify-center" @click.self="apiOpen = false">
      <div class="bg-af-surface border border-af-rule rounded-lg p-5 w-[520px] max-w-[92vw] max-h-[92vh] overflow-auto">
        <div class="flex items-center justify-between mb-3.5"><div class="text-base font-bold">API 设置</div><button class="w-11 h-11 rounded-md text-af-muted hover:text-af-ink hover:bg-af-surface-hover text-2xl flex items-center justify-center" @click="apiOpen = false">&times;</button></div>
        <div class="space-y-3">
          <div class="form-group"><label class="form-label">选择模型 / 服务</label><select v-model="apiProvider" class="form-select"><option value="tongyi">通义万相 (Aliyun)</option><option value="wenxin">文心一格 (Baidu)</option><option value="doubao">豆包 / 即梦 (ByteDance)</option><option value="zhipu">智谱清言 (Zhipu)</option><option value="kling">可灵 (Kling)</option><option value="sd">Stable Diffusion (self-hosted)</option><option value="openai">OpenAI / DALL-E / GPT-Image</option><option value="gemini">Gemini</option><option value="custom">Custom endpoint</option></select></div>
          <div class="form-group"><label class="form-label">API Endpoint</label><input v-model="apiEndpoint" type="text" placeholder="https://..." class="form-input" /></div>
          <div class="form-group"><label class="form-label">模型名称</label><input v-model="apiModel" type="text" placeholder="model name" class="form-input" /></div>
          <div class="form-group"><label class="form-label">API Key</label><input v-model="apiKey" type="password" placeholder="sk-..." class="form-input" /></div>
          <div class="form-group"><label class="form-label">额外参数 (JSON)</label><textarea v-model="apiExtra" rows="2" placeholder='{"size":"1024x1024"}' class="form-textarea"></textarea></div>
          <div class="flex justify-end gap-2 pt-1"><button class="btn-secondary" @click="apiOpen = false">取消</button><button class="btn-primary" @click="saveApiSettings">保存</button></div>
        </div>
      </div>
    </div>

    <!-- Help Modal -->
    <div v-if="helpOpen" class="fixed inset-0 bg-black/75 z-[100] flex items-center justify-center" @click.self="helpOpen = false">
      <div class="bg-af-surface border border-af-rule rounded-lg p-5 w-[420px] max-w-[92vw]">
        <div class="flex items-center justify-between mb-3.5"><div class="text-base font-bold">帮助</div><button class="w-11 h-11 rounded-md text-af-muted hover:text-af-ink hover:bg-af-surface-hover text-2xl flex items-center justify-center" @click="helpOpen = false">&times;</button></div>
        <div class="text-[13px] leading-relaxed text-af-muted">{{ helpText }}</div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="previewOpen" class="fixed inset-0 bg-black/75 z-[100] flex items-center justify-center" @click.self="previewOpen = false">
      <div class="bg-af-surface border border-af-rule rounded-lg p-5 max-w-[96vw] max-h-[96vh] flex flex-col items-center overflow-auto">
        <div class="w-full flex items-center justify-between mb-3.5"><div class="text-base font-bold">预览</div><button class="w-11 h-11 rounded-md text-af-muted hover:text-af-ink hover:bg-af-surface-hover text-2xl flex items-center justify-center" @click="previewOpen = false">&times;</button></div>
        <img :src="previewUrl" alt="preview" class="max-w-full max-h-[70vh] object-contain" />
        <div class="mt-3"><button class="btn-secondary" @click="previewOpen = false">关闭</button></div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, h } from 'vue'

export const SidebarGroup = defineComponent({
  props: { title: { type: String, required: true }, open: { type: Boolean, required: true }, collapsed: { type: Boolean, default: false } },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    return () => h('div', { class: 'mb-1' }, [
      !props.collapsed && h('button', {
        class: 'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold text-af-muted hover:text-af-ink hover:bg-af-surface-hover transition-colors',
        onClick: () => emit('update:open', !props.open)
      }, [
        h('svg', { class: 'w-3.5 h-3.5 shrink-0 transition-transform', style: { transform: props.open ? 'rotate(90deg)' : 'rotate(0deg)' }, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [h('polyline', { points: '9 18 15 12 9 6' })]),
        props.title
      ]),
      props.open && !props.collapsed && h('div', { class: 'mt-0.5' }, slots.default?.())
    ])
  }
})

export const SidebarItem = defineComponent({
  props: { label: { type: String, required: true }, active: { type: Boolean, default: false } },
  emits: ['click'],
  setup(props, { emit }) {
    return () => h('button', {
      class: 'w-full text-left px-2.5 py-1.5 rounded-md text-[13px] transition-colors ' + (props.active ? 'text-af-accent bg-af-accent-soft' : 'text-af-muted hover:text-af-ink hover:bg-af-surface-hover'),
      onClick: () => emit('click')
    }, props.label)
  }
})

export const UploadZone = defineComponent({
  props: { accept: { type: String, default: '*' }, multiple: { type: Boolean, default: false }, prompt: { type: String, default: '点击或拖拽上传' }, hint: { type: String, default: '' }, class: { type: String, default: '' } },
  emits: ['files'],
  setup(props, { emit }) {
    const drag = ref(false)
    const input = ref<HTMLInputElement | null>(null)
    function onFiles(files: FileList | null) { if (files && files.length) emit('files', props.multiple ? files : files[0]) }
    return () => h('div', {
      class: ['border-2 border-dashed border-af-rule rounded-lg bg-af-surface text-af-muted text-center cursor-pointer transition-all hover:border-af-accent hover:bg-af-accent-soft hover:text-af-ink relative flex flex-col items-center justify-center p-6', drag.value ? 'border-af-accent bg-af-accent-soft text-af-ink' : '', props.class],
      onClick: () => input.value?.click(),
      onDragover: (e: DragEvent) => { e.preventDefault(); drag.value = true },
      onDragleave: () => { drag.value = false },
      onDrop: (e: DragEvent) => { e.preventDefault(); drag.value = false; onFiles(e.dataTransfer?.files || null) }
    }, [
      h('svg', { class: 'w-9 h-9 mb-2.5', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }), h('polyline', { points: '17 8 12 3 7 8' }), h('line', { x1: '12', y1: '3', x2: '12', y2: '15' })]),
      h('div', { class: 'text-sm' }, props.prompt),
      props.hint && h('div', { class: 'text-xs text-af-muted mt-1.5' }, props.hint),
      h('input', { ref: input, type: 'file', accept: props.accept, multiple: props.multiple, class: 'absolute inset-0 opacity-0 cursor-pointer', onChange: (e: Event) => onFiles((e.target as HTMLInputElement).files) })
    ])
  }
})

export const HelpBtn = defineComponent({
  props: { text: { type: String, required: true } },
  setup(props) {
    return () => h('button', {
      class: 'inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-af-surface-hover text-af-muted border border-af-rule text-[11px] ml-1.5 cursor-help hover:text-af-accent hover:border-af-accent',
      onClick: (e: MouseEvent) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('af-open-help', { detail: props.text })) }
    }, '?')
  }
})
</script>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
const currentScreen = ref('home')
const sidebarCollapsed = ref(false)
const globalSearch = ref('')
const statusText = ref('就绪')
const statusExtra = ref('')

const groups = reactive({ ai: true, frame: true, pixel: true, map: true })

const aiTab = ref('txt2img')
const aiTabs = [{ key: 'txt2img', label: '文生图' }, { key: 'style', label: '画风迁移' }, { key: 'simplify', label: '角色简化' }, { key: 'pose', label: '姿势生成' }]
const pixelTab = ref('draw')
const pixelTabs = [{ key: 'draw', label: '像素绘画' }, { key: 'process', label: '精细处理' }, { key: 'action', label: '动作生成' }]
const seqTab = ref('video')
const seqTabs = [{ key: 'video', label: '视频转序列帧' }, { key: 'gif', label: 'GIF转序列帧' }, { key: 'sprite', label: '图片合成精灵图' }]
const mapTab = ref('tilemap')
const mapTabs = [{ key: 'tilemap', label: '瓦片双网格' }, { key: 'preview', label: 'Top-down 预览' }]

const apiOpen = ref(false)
const apiProvider = ref('tongyi')
const apiEndpoint = ref('')
const apiModel = ref('')
const apiKey = ref('')
const apiExtra = ref('')

const helpOpen = ref(false)
const helpText = ref('')
const previewOpen = ref(false)
const previewUrl = ref('')

const themeLabel = computed(() => ({ dark: '暗夜', light: '光亮', book: '书籍' }[themeStore.theme] || '暗夜'))

function navigate(screen: string) { currentScreen.value = screen; statusText.value = '就绪' }
function goSub(screen: string, tab: string) {
  currentScreen.value = screen
  if (screen === 'ai-concept') aiTab.value = tab
  if (screen === 'pixel-studio') pixelTab.value = tab
  if (screen === 'sequence-frame') seqTab.value = tab
  if (screen === 'map-editor') mapTab.value = tab
  statusText.value = '就绪'
}
function cycleTheme() { themeStore.cycle() }
function saveApiSettings() { apiOpen.value = false; statusText.value = 'API 设置已保存' }
function openHelp(text: string) { helpText.value = text; helpOpen.value = true }
function openPreview(url: string) { previewUrl.value = url; previewOpen.value = true }

// Utility
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => { const r = new FileReader(); r.onload = e => resolve(e.target?.result as string); r.onerror = reject; r.readAsDataURL(file) })
}
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => { const img = new Image(); img.crossOrigin = 'anonymous'; img.onload = () => resolve(img); img.onerror = reject; img.src = src })
}
function downloadUrl(url: string, name: string) {
  const a = document.createElement('a'); a.href = url; a.download = name; a.click()
}
function placeholderUrl() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const ctx = c.getContext('2d')!; ctx.fillStyle = '#1a1a24'; ctx.fillRect(0,0,256,256); ctx.fillStyle = '#8a8a9e'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('placeholder',128,128); return c.toDataURL()
}

// ================= AI txt2img =================
const t2i = reactive({ prompt: '一个勇敢的像素风格冒险者，手持剑与盾，站在森林边缘，侧面视角，游戏角色概念', negative: '模糊，低质量，多余的手指，变形', style: 'anime', count: '4', size: '1024x1024', steps: 20, quality: 'hd', refs: [] as File[], refPreviews: [] as string[], results: [] as string[], generating: false, progress: 0 })
async function previewT2iRefs() { t2i.refPreviews = await Promise.all(t2i.refs.map(fileToDataUrl)) }
async function generateTxt2Img() {
  t2i.generating = true; t2i.progress = 0
  const styleColors: Record<string, string> = { pixel: '#00d4aa', anime: '#7b61ff', lowpoly: '#ffaa00', handdrawn: '#f0f0f5', realistic: '#5f6370' }
  const interval = setInterval(() => { t2i.progress += 5; if (t2i.progress >= 90) clearInterval(interval) }, 100)
  await new Promise(r => setTimeout(r, 1500))
  t2i.results = Array.from({ length: parseInt(t2i.count) }, (_, i) => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 256; const ctx = c.getContext('2d')!
    ctx.fillStyle = '#14141c'; ctx.fillRect(0,0,256,256)
    ctx.fillStyle = styleColors[t2i.style] || '#00d4aa'
    ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center'
    ctx.fillText(t2i.style.toUpperCase(), 128, 120)
    ctx.fillStyle = '#8a8a9e'; ctx.font = '12px sans-serif'
    ctx.fillText(`结果 ${i+1}`, 128, 145)
    return c.toDataURL()
  })
  clearInterval(interval); t2i.progress = 100; t2i.generating = false; statusText.value = '文生图完成'
}

// ================= Style Transfer =================
const st = reactive({ targetUrl: '', styleUrl: '', prompt: '转换为像素艺术风格', resultUrl: '', running: false })
async function loadStTarget(file: File) { st.targetUrl = await fileToDataUrl(file) }
async function loadStStyle(file: File) { st.styleUrl = await fileToDataUrl(file) }
async function runStyleTransfer() {
  st.running = true; statusText.value = '风格迁移中...'
  await new Promise(r => setTimeout(r, 1200))
  st.resultUrl = st.targetUrl || placeholderUrl(); st.running = false; statusText.value = '风格迁移完成'
}
async function frontendStyleTransfer() {
  if (!st.targetUrl) return
  const img = await loadImage(st.targetUrl)
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight
  const ctx = c.getContext('2d')!; ctx.filter = 'sepia(0.4) saturate(1.4) hue-rotate(-20deg)'; ctx.drawImage(img, 0, 0)
  st.resultUrl = c.toDataURL()
}

// ================= Char Simplify =================
const cs = reactive({ sourceUrl: '', resultUrl: '', level: 'medium', width: 64, colors: 16, running: false })
async function loadCharSimplify(file: File) { cs.sourceUrl = await fileToDataUrl(file) }
async function processCharSimplify() {
  if (!cs.sourceUrl) return
  cs.running = true; statusText.value = '角色简化中...'
  await new Promise(r => setTimeout(r, 800))
  const img = await loadImage(cs.sourceUrl)
  const c = document.createElement('canvas'); c.width = cs.width; c.height = Math.round(cs.width * (img.naturalHeight / img.naturalWidth))
  const ctx = c.getContext('2d')!; ctx.imageSmoothingEnabled = false; ctx.drawImage(img, 0, 0, c.width, c.height)
  cs.resultUrl = c.toDataURL(); cs.running = false; statusText.value = '角色简化完成'
}

// ================= Pose Gen =================
const pg = reactive({ sourceUrl: '', pose: 'stand', resultCanvas: false })
const pgResultCanvas = ref<HTMLCanvasElement | null>(null)
const posePresets = ['stand','walk','run','attack','jump','cast','crouch','hurt']
const poseNames: Record<string, string> = { stand:'站立', walk:'行走', run:'奔跑', attack:'攻击', jump:'跳跃', cast:'施法', crouch:'蹲下', hurt:'受伤' }
async function loadPose(file: File) { pg.sourceUrl = await fileToDataUrl(file) }
function drawSkeleton() {
  pg.resultCanvas = true
  nextTick(() => {
    const c = pgResultCanvas.value; if (!c) return
    c.width = 300; c.height = 300; const ctx = c.getContext('2d')!
    ctx.clearRect(0,0,300,300); ctx.strokeStyle = '#00d4aa'; ctx.lineWidth = 3; ctx.lineCap = 'round'
    const baseY = pg.pose === 'crouch' ? 200 : 150
    // head
    ctx.beginPath(); ctx.arc(150, baseY - 70, 20, 0, Math.PI * 2); ctx.stroke()
    // body
    ctx.beginPath(); ctx.moveTo(150, baseY - 50); ctx.lineTo(150, baseY + 20); ctx.stroke()
    // arms
    ctx.beginPath(); ctx.moveTo(150, baseY - 30); ctx.lineTo(110, baseY + 10); ctx.moveTo(150, baseY - 30); ctx.lineTo(190, baseY + 10); ctx.stroke()
    // legs
    const ly = pg.pose === 'walk' ? 240 : pg.pose === 'run' ? 250 : pg.pose === 'jump' ? 210 : 240
    ctx.beginPath(); ctx.moveTo(150, baseY + 20); ctx.lineTo(120, ly); ctx.moveTo(150, baseY + 20); ctx.lineTo(180, ly); ctx.stroke()
  })
}
function generatePoseFrontend() { drawSkeleton(); statusText.value = '骨架预览完成' }
async function generatePoseApi() { drawSkeleton(); statusText.value = 'API 姿势生成（模拟）' }

// ================= Pixel Draw =================
const pd = reactive({ tool: 'pencil', brush: 1, zoom: 16, color: '#00d4aa', bg: 'black', w: 32, h: 32, layer: 0, layers: [{ name: '图层 1', visible: true }], recent: ['#00d4aa','#7b61ff','#ffaa00','#ff4d4d'], sourceUrl: '' })
const pixelCanvas = ref<HTMLCanvasElement | null>(null)
const pixelImportInput = ref<HTMLInputElement | null>(null)
const pixelTools = [
  { key: 'pencil', label: '铅笔', icon: '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>' },
  { key: 'eraser', label: '橡皮', icon: '<path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z"/><path d="M17 17L7 7"/>' },
  { key: 'fill', label: '填充', icon: '<path d="M19 11l-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11z"/><path d="M5 19h14"/>' },
  { key: 'picker', label: '取色器', icon: '<path d="M20.2 7.6l-3.8-3.8a2 2 0 0 0-2.8 0L3 14.2V19h4.8l10.6-10.6a2 2 0 0 0 0-2.8z"/><path d="M14 6l4 4"/>' },
  { key: 'line', label: '直线', icon: '<line x1="5" y1="19" x2="19" y2="5"/>' },
  { key: 'rect', label: '矩形', icon: '<rect x="3" y="3" width="18" height="18"/>' },
]
const pixelPalette = ['#000000','#1a1a24','#5f6370','#f0f0f5','#ff4d4d','#ffaa00','#00d4aa','#7b61ff','#c9a86c','#8b7355','#3d3226','#ffffff','#e02e2e','#d98a00','#0d9e7f','#5b4cdb']
function drawPixelGrid() {
  nextTick(() => {
    const c = pixelCanvas.value; if (!c) return
    const ctx = c.getContext('2d')!; ctx.fillStyle = pd.bg === 'black' ? '#0e0e14' : '#ffffff'; ctx.fillRect(0, 0, c.width, c.height)
    ctx.strokeStyle = pd.bg === 'black' ? '#1e1e2e' : '#d9dce3'; ctx.lineWidth = 1
    for (let x = 0; x <= c.width; x += pd.zoom) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,c.height); ctx.stroke() }
    for (let y = 0; y <= c.height; y += pd.zoom) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(c.width,y); ctx.stroke() }
  })
}
function triggerPixelImport() { pixelImportInput.value?.click() }
async function handlePixelImport(e: Event) {
  const target = e.target as HTMLInputElement; if (!target.files?.[0]) return
  pd.sourceUrl = await fileToDataUrl(target.files[0]); target.value = ''
}
function importPixelFromLibrary() { statusText.value = '请从资源库选择图像' }
function exportPixelPng() { if (pixelCanvas.value) downloadUrl(pixelCanvas.value.toDataURL(), 'pixel_draw.png') }
function savePixelToLibrary() { if (pixelCanvas.value) saveToLibrary(pixelCanvas.value.toDataURL(), 'output') }
watch(() => [pd.zoom, pd.bg], drawPixelGrid, { immediate: true })

// ================= Pixel Process =================
const pp = reactive({ sourceUrl: '', resultUrl: '', width: '64', customWidth: 64, scaleMode: 'nearest', outline: 'none', colors: 16, dither: 'none' })
async function loadPixelProcess(file: File) { pp.sourceUrl = await fileToDataUrl(file) }
async function applyPixelProcess() {
  if (!pp.sourceUrl) return
  const img = await loadImage(pp.sourceUrl)
  const w = pp.width === 'custom' ? pp.customWidth : parseInt(pp.width)
  const h = Math.round(w * (img.naturalHeight / img.naturalWidth))
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const ctx = c.getContext('2d')!; ctx.imageSmoothingEnabled = pp.scaleMode === 'pixel'; ctx.drawImage(img, 0, 0, w, h)
  if (pp.outline !== 'none') { ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.strokeRect(0,0,w,h) }
  pp.resultUrl = c.toDataURL(); statusText.value = '像素处理完成'
}

// ================= Pixel Char =================
const pc = reactive({ sourceUrl: '', style: 'v1', action: 'walk', width: 32, colors: 16, resultCanvas: false })
const pcResultCanvas = ref<HTMLCanvasElement | null>(null)
const pcStyles = [{ key: 'v1', label: 'V1' }, { key: 'v2', label: 'V2' }, { key: 'v3', label: 'V3' }]
const pcStyleDesc = computed(() => ({ v1: '标准 4 帧行走动画', v2: '8 帧流畅动作', v3: '2 帧复古抖动' }[pc.style]))
async function loadPixelChar(file: File) { pc.sourceUrl = await fileToDataUrl(file) }
function generatePixelChar() {
  pc.resultCanvas = true
  nextTick(() => {
    const c = pcResultCanvas.value; if (!c) return
    const frames = pc.style === 'v1' ? 4 : pc.style === 'v2' ? 8 : 2
    c.width = pc.width * frames; c.height = pc.width
    const ctx = c.getContext('2d')!; ctx.fillStyle = '#0e0e14'; ctx.fillRect(0,0,c.width,c.height)
    ctx.fillStyle = '#00d4aa'
    for (let i = 0; i < frames; i++) {
      const x = i * pc.width + pc.width/2, y = pc.width/2 + Math.sin((i / frames) * Math.PI * 2) * (pc.width/4)
      ctx.beginPath(); ctx.arc(x, y, pc.width/6, 0, Math.PI*2); ctx.fill()
    }
    statusText.value = '像素动作生成完成'
  })
}
function downloadPixelCharSprite() { if (pcResultCanvas.value) downloadUrl(pcResultCanvas.value.toDataURL(), 'pixel_action.png') }
function savePixelCharToLibrary() { if (pcResultCanvas.value) saveToLibrary(pcResultCanvas.value.toDataURL(), 'sprite') }

// ================= Sequence Video =================
const video = reactive({ step: 1, file: null as File | null, url: '', duration: 0, width: 0, height: 0, fps: 12, outW: 512, outH: 512, frames: [] as { url: string; selected: boolean; similar: boolean }[], previewFps: 12, playing: false, progress: 0, export: { format: 'video', cols: 4, preset: 'custom', w: 512, h: 512, lockAspect: true, compression: 'medium', delay: 100, name: 'artforge_export', preview: '' } })
const sourceVideo = ref<HTMLVideoElement | null>(null)
const cropPreviewCanvas = ref<HTMLCanvasElement | null>(null)
const videoAnimCanvas = ref<HTMLCanvasElement | null>(null)
async function loadVideo(file: File) {
  video.file = file; video.url = URL.createObjectURL(file)
  await nextTick()
  const v = sourceVideo.value; if (!v) return
  v.onloadedmetadata = () => { video.duration = v.duration; video.width = v.videoWidth; video.height = v.videoHeight }
}
async function extractVideoFrames() {
  video.progress = 0; statusText.value = '提取帧中...'
  const total = Math.floor(video.duration * video.fps)
  const v = sourceVideo.value!; video.frames = []
  for (let i = 0; i < Math.min(total, 24); i++) {
    v.currentTime = i / video.fps
    await new Promise(r => v.addEventListener('seeked', r, { once: true }))
    const c = document.createElement('canvas'); c.width = video.outW; c.height = video.outH
    const ctx = c.getContext('2d')!; ctx.drawImage(v, 0, 0, video.outW, video.outH)
    video.frames.push({ url: c.toDataURL(), selected: false, similar: false })
    video.progress = Math.round(((i + 1) / Math.min(total, 24)) * 100)
  }
  video.step = 2; video.progress = 0; statusText.value = '提取完成'
}
function detectSimilarFrames() { video.frames.forEach((f, i) => f.similar = i % 5 === 0) }
function selectAllFrames() { video.frames.forEach(f => f.selected = true) }
function deselectAllFrames() { video.frames.forEach(f => f.selected = false) }
function openFrameEditor(i: number) { statusText.value = `编辑帧 ${i+1}` }
function toggleVideoPreview() { video.playing = !video.playing; statusText.value = video.playing ? '播放中' : '已暂停' }
function generateVideoExportPreview() {
  const c = document.createElement('canvas'); c.width = video.export.w; c.height = video.export.h
  const ctx = c.getContext('2d')!; ctx.fillStyle = '#14141c'; ctx.fillRect(0,0,c.width,c.height)
  ctx.fillStyle = '#00d4aa'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(video.export.format.toUpperCase() + ' 预览', c.width/2, c.height/2)
  video.export.preview = c.toDataURL(); statusText.value = '导出预览已生成'
}

// ================= Sequence GIF =================
const gif = reactive({ step: 1, file: null as File | null, frames: [] as { url: string; selected: boolean }[], fps: 12, outW: 512, outH: 512, previewFps: 10, playing: false, export: { format: 'gif', cols: 4, w: 512, h: 512, name: 'artforge_export', preview: '' } })
const gifAnimCanvas = ref<HTMLCanvasElement | null>(null)
async function loadGif(file: File) { gif.file = file; statusText.value = 'GIF 已加载' }
async function extractGifFrames() {
  gif.frames = Array.from({ length: 8 }, (_, i) => {
    const c = document.createElement('canvas'); c.width = gif.outW; c.height = gif.outH
    const ctx = c.getContext('2d')!; ctx.fillStyle = '#14141c'; ctx.fillRect(0,0,c.width,c.height)
    ctx.fillStyle = '#7b61ff'; ctx.beginPath(); ctx.arc(gif.outW/2 + (i-4)*20, gif.outH/2, 30, 0, Math.PI*2); ctx.fill()
    return { url: c.toDataURL(), selected: false }
  })
  gif.step = 2; statusText.value = 'GIF 提取完成'
}
function detectSimilarGifFrames() { gif.frames.forEach((f, i) => f.selected = i % 2 === 0) }
function selectAllGifFrames() { gif.frames.forEach(f => f.selected = true) }
function deselectAllGifFrames() { gif.frames.forEach(f => f.selected = false) }
function toggleGifPreview() { gif.playing = !gif.playing; statusText.value = gif.playing ? 'GIF 播放中' : '已暂停' }
function generateGifExportPreview() {
  const c = document.createElement('canvas'); c.width = gif.export.w; c.height = gif.export.h
  const ctx = c.getContext('2d')!; ctx.fillStyle = '#14141c'; ctx.fillRect(0,0,c.width,c.height)
  ctx.fillStyle = '#ffaa00'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('GIF 导出预览', c.width/2, c.height/2)
  gif.export.preview = c.toDataURL()
}

// ================= Sprite Sheet =================
const sprite = reactive({ images: [] as { url: string; file: File }[], cols: 4, padding: 2, bg: 'transparent' })
const spritePreviewCanvas = ref<HTMLCanvasElement | null>(null)
const spriteRows = computed(() => Math.ceil(sprite.images.length / sprite.cols))
async function loadSpriteImages(files: FileList | null) {
  if (!files) return
  for (const f of Array.from(files)) sprite.images.push({ url: await fileToDataUrl(f), file: f })
  nextTick(drawSpritePreview)
}
function drawSpritePreview() {
  const c = spritePreviewCanvas.value; if (!c || !sprite.images.length) return
  const img = new Image(); img.onload = () => {
    const cellW = img.width, cellH = img.height
    c.width = sprite.cols * cellW + (sprite.cols + 1) * sprite.padding
    c.height = spriteRows.value * cellH + (spriteRows.value + 1) * sprite.padding
    const ctx = c.getContext('2d')!
    if (sprite.bg !== 'transparent') { ctx.fillStyle = sprite.bg; ctx.fillRect(0,0,c.width,c.height) }
    sprite.images.forEach((im, i) => {
      const x = (i % sprite.cols) * cellW + ((i % sprite.cols) + 1) * sprite.padding
      const y = Math.floor(i / sprite.cols) * cellH + (Math.floor(i / sprite.cols) + 1) * sprite.padding
      const img2 = new Image(); img2.onload = () => ctx.drawImage(img2, x, y); img2.src = im.url
    })
  }; img.src = sprite.images[0].url
}
watch(() => [sprite.cols, sprite.padding, sprite.bg, sprite.images.length], drawSpritePreview)
function downloadSpriteSheet() { if (spritePreviewCanvas.value) downloadUrl(spritePreviewCanvas.value.toDataURL(), 'sprite_sheet.png') }
function downloadSpriteJson() {
  const data = { cols: sprite.cols, rows: spriteRows.value, padding: sprite.padding, frames: sprite.images.length }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadUrl(URL.createObjectURL(blob), 'sprite_sheet.json')
}
function saveSpriteToLibrary() { if (spritePreviewCanvas.value) saveToLibrary(spritePreviewCanvas.value.toDataURL(), 'sprite') }

// ================= Tilemap =================
const tm = reactive({ tilesetUrl: '', tool: 'brush', showGrid: true, detail: false, w: 32, h: 32 })
const tilemapCanvas = ref<HTMLCanvasElement | null>(null)
const tmTools = [
  { key: 'brush', label: '画笔', icon: '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>' },
  { key: 'eraser', label: '橡皮', icon: '<path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z"/><path d="M17 17L7 7"/>' },
  { key: 'fill', label: '填充', icon: '<path d="M19 11l-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11z"/><path d="M5 19h14"/>' },
]
async function loadTileset(file: File) { tm.tilesetUrl = await fileToDataUrl(file); drawTilemap() }
function drawTilemap() {
  nextTick(() => {
    const c = tilemapCanvas.value; if (!c) return
    const ctx = c.getContext('2d')!; ctx.fillStyle = '#0e0e14'; ctx.fillRect(0,0,c.width,c.height)
    if (tm.showGrid) {
      ctx.strokeStyle = '#1e1e2e'; ctx.lineWidth = 1
      for (let x = 0; x <= c.width; x += 32) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,c.height); ctx.stroke() }
      for (let y = 0; y <= c.height; y += 32) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(c.width,y); ctx.stroke() }
    }
    if (tm.tilesetUrl) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, 64, 64); img.src = tm.tilesetUrl }
  })
}
watch(() => [tm.showGrid, tm.detail, tm.tilesetUrl], drawTilemap, { immediate: true })
function exportTilemapJson() { statusText.value = 'JSON 已导出' }
function exportTilemapPng() { if (tilemapCanvas.value) downloadUrl(tilemapCanvas.value.toDataURL(), 'tilemap.png') }
function saveTilemapToLibrary() { if (tilemapCanvas.value) saveToLibrary(tilemapCanvas.value.toDataURL(), 'map') }

// ================= Topdown Preview =================
const topdownCanvas = ref<HTMLCanvasElement | null>(null)
const topdownMapInput = ref<HTMLInputElement | null>(null)
const topdownCharInput = ref<HTMLInputElement | null>(null)
function drawTopdown() {
  nextTick(() => {
    const c = topdownCanvas.value; if (!c) return
    const ctx = c.getContext('2d')!; ctx.fillStyle = '#0e0e14'; ctx.fillRect(0,0,c.width,c.height)
    ctx.fillStyle = '#1e1e2e'; for (let x=0;x<c.width;x+=64) for (let y=0;y<c.height;y+=64) if ((x+y)%128===0) ctx.fillRect(x,y,64,64)
    ctx.fillStyle = '#00d4aa'; ctx.beginPath(); ctx.arc(c.width/2, c.height/2, 16, 0, Math.PI*2); ctx.fill()
  })
}
function triggerTopdownMap() { topdownMapInput.value?.click() }
function triggerTopdownChar() { topdownCharInput.value?.click() }
function loadTopdownMap(e: Event) { statusText.value = '地图已加载'; drawTopdown() }
function loadTopdownChar(e: Event) { statusText.value = '角色已加载'; drawTopdown() }
function topdownScreenshot() { if (topdownCanvas.value) downloadUrl(topdownCanvas.value.toDataURL(), 'topdown_screenshot.png') }
watch(() => mapTab.value, v => { if (v === 'preview') drawTopdown() }, { immediate: true })

// ================= Asset Library =================
const assetImportInput = ref<HTMLInputElement | null>(null)
const assetFilter = ref('all')
const assetSearch = ref('')
const assets = ref<{ id: number; type: string; name: string; thumb: string; selected: boolean }[]>([])
const assetFilters = [{ key: 'all', label: '全部' }, { key: 'image', label: '图像' }, { key: 'frame', label: '序列帧' }, { key: 'sprite', label: '精灵图' }, { key: 'map', label: '地图' }, { key: 'output', label: '产出图' }]
const filteredAssets = computed(() => assets.value.filter(a => (assetFilter.value === 'all' || a.type === assetFilter.value) && a.name.toLowerCase().includes(assetSearch.value.toLowerCase())))
function triggerAssetImport() { assetImportInput.value?.click() }
async function handleAssetImport(e: Event) {
  const target = e.target as HTMLInputElement; if (!target.files) return
  for (const f of Array.from(target.files)) assets.value.push({ id: Date.now() + Math.random(), type: 'image', name: f.name, thumb: await fileToDataUrl(f), selected: false })
  target.value = ''
}
function selectAllAssets() { filteredAssets.value.forEach(a => a.selected = true) }
function deleteSelectedAssets() { assets.value = assets.value.filter(a => !a.selected) }
function exportAssets() { statusText.value = '资源库导出完成' }
function saveToLibrary(url: string, type: string) { assets.value.push({ id: Date.now(), type, name: `asset_${Date.now()}.png`, thumb: url, selected: false }); statusText.value = '已保存到资源库' }

onMounted(() => {
  themeStore.init(); drawPixelGrid(); drawTilemap(); drawTopdown()
  const onHelp = (e: Event) => { helpText.value = (e as CustomEvent).detail; helpOpen.value = true }
  window.addEventListener('af-open-help', onHelp)
})
</script>

<style scoped>
.btn-primary { @apply inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-af-accent text-black border border-af-accent hover:brightness-110 transition-all disabled:opacity-60; }
.btn-secondary { @apply inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-af-surface-hover text-af-ink border border-af-rule hover:border-af-muted transition-all; }
.btn-danger { @apply inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-af-danger text-white border border-af-danger hover:brightness-110 transition-all; }
.btn-sm { @apply px-2.5 py-1 text-xs; }
.form-group { @apply mb-3 flex-1 min-w-[120px]; }
.form-label { @apply block text-xs font-medium text-af-muted mb-1.5; }
.form-input { @apply w-full bg-af-bg border border-af-rule rounded-md py-1.5 px-2.5 text-af-ink text-sm outline-none focus:border-af-accent placeholder:text-af-muted/60; }
.form-select { @apply w-full bg-af-bg border border-af-rule rounded-md py-1.5 px-2.5 text-af-ink text-sm outline-none focus:border-af-accent cursor-pointer; }
.form-textarea { @apply w-full bg-af-bg border border-af-rule rounded-md py-1.5 px-2.5 text-af-ink text-sm outline-none focus:border-af-accent placeholder:text-af-muted/60 resize-y min-h-[60px]; }
.form-row { @apply flex gap-2.5 flex-wrap; }
.panel-title { @apply text-[13px] font-semibold mb-2.5 text-af-ink flex items-center gap-2; }
.preview-box { @apply bg-af-surface border border-af-rule rounded-lg min-h-[280px] flex items-center justify-center text-af-muted text-sm relative overflow-hidden; }
.preview-label { @apply absolute top-2 left-2.5 text-[10px] font-semibold uppercase tracking-wider text-af-muted bg-black/70 px-2 py-0.5 rounded pointer-events-none; }
.slider-wrap { @apply flex items-center gap-2.5; }
.slider-value { @apply w-12 text-right font-mono text-[13px] text-af-ink; }
.steps-bar { @apply flex gap-2 mb-3 flex-wrap; }
.step-pill { @apply flex items-center gap-2 px-3.5 py-2 rounded-full bg-af-bg border border-af-rule text-af-muted text-[13px] font-medium transition-colors; }
.step-pill.active { @apply border-af-accent text-af-accent bg-af-accent-soft; }
.step-num { @apply w-[22px] h-[22px] rounded-full bg-af-surface-hover text-af-muted flex items-center justify-center text-[11px] font-bold; }
.step-pill.active .step-num { @apply bg-af-accent text-black; }
.image-pixelated { image-rendering: pixelated; }
</style>
