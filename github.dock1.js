// 更新日期: 2026-01-30，更新内容: 恢复双重链接模式 (通用代理 + jsDelivr)

// 用户配置区域开始 =================================
// ALLOWED_HOSTS: 定义允许代理的域名
const ALLOWED_HOSTS = [
  'quay.io',
  'gcr.io',
  'k8s.gcr.io',
  'registry.k8s.io',
  'ghcr.io',
  'docker.cloudsmith.io',
  'registry-1.docker.io',
  'github.com',
  'api.github.com',
  'raw.githubusercontent.com',
  'gist.github.com',
  'gist.githubusercontent.com',
  'docker.yifzz.xx.kg'
];

// RESTRICT_PATHS: 控制是否限制 GitHub 和 Docker 请求的路径
const RESTRICT_PATHS = false;

// ALLOWED_PATHS: 定义允许路径关键字
const ALLOWED_PATHS = [
  'library',
  'user-id-1',
  'user-id-2',
];
// 用户配置区域结束 =================================

// 闪电 SVG 图标
const LIGHTNING_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
</svg>`;

// 首页 HTML
// 注意：因作为字符串被 JS 处理，内部的反引号需小心使用，推荐使用单引号或转义。
const HOMEPAGE_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloudflare 加速</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(LIGHTNING_SVG)}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* 基础设定 */
    body {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      transition: background-color 0.4s ease, color 0.4s ease;
      padding: 1.5rem;
    }

    /* 亮色模式 */
    .light-mode {
      background: #f8fafc; /* Slate-50: 极淡的灰白色背景，干净清爽 */
      color: #334155;      /* Slate-700 */
    }
    .light-mode .main-card {
      background: rgba(255, 255, 255, 0.85); /* 磨砂玻璃感 */
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 20px 40px -10px rgba(148, 163, 184, 0.15); /* 柔和阴影 */
    }
    .light-mode .input-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      color: #1e293b;
    }
    .light-mode .input-box:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }
    .light-mode .result-area {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
    }

    /* 暗色模式 */
    .dark-mode {
      // background: #0f172a; /* Slate-900: 深邃的蓝黑色 */
      background: #111;     /* 也可以纯黑一点 */
      color: #cbd5e1;       /* Slate-300 */
    }
    .dark-mode .main-card {
      background: rgba(30, 41, 59, 0.75); /* Slate-800 semi-transparent */
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.08); /* 微弱边框 */
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3);
    }
    .dark-mode .input-box {
      background: #0f172a;  /* Slate-900 */
      border: 1px solid #334155;
      color: #e2e8f0;
    }
    .dark-mode .input-box::placeholder {
      color: #64748b;
    }
    .dark-mode .input-box:focus {
      border-color: #60a5fa; /* Blue-400 */
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }
    .dark-mode .result-area {
      background: #1e293b; /* Slate-800 */
      border: 1px solid #334155;
    }

    /* 通用组件 */
    .main-card {
      width: 100%;
      max-width: 720px;
      border-radius: 1.5rem; /* 更圆润的角 */
      padding: 2.5rem;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      font-weight: 500;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }
    .btn-primary:active {
      transform: translateY(1px);
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
    }
    .btn-primary:disabled {
      background: #94a3b8;
      cursor: not-allowed;
      box-shadow: none;
    }
    .btn-icon {
      transition: all 0.2s;
      border-radius: 0.5rem;
    }
    .light-mode .btn-icon:hover { background: #e2e8f0; color: #0f172a; }
    .dark-mode .btn-icon:hover { background: #334155; color: #f1f5f9; }

    /* 动画 */
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up {
      animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      opacity: 0;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      background: rgba(15, 23, 42, 0.9);
      color: white;
      font-size: 0.9rem;
      backdrop-filter: blur(4px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 100;
      pointer-events: none;
    }
    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    .theme-toggle {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        font-size: 1.25rem;
        cursor: pointer;
        transition: transform 0.5s ease;
    }
    .theme-toggle:hover {
        transform: rotate(15deg);
    }
  </style>
</head>
<body class="light-mode">
  <div class="theme-toggle" onclick="toggleTheme()" title="切换主题">
    <span class="sun">☀️</span><span class="moon hidden">🌙</span>
  </div>

  <div class="main-card animate-slide-up">
    <!-- Header -->
    <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        </div>
        <h1 class="text-2xl font-bold tracking-tight mb-2">资源加速服务</h1>
        <p class="text-sm opacity-60">GitHub 文件 & Docker 镜像一键加速</p>
    </div>
    
    <!-- GitHub 模块 -->
    <div class="mb-10">
      <div class="flex items-center gap-2 mb-3">
        <h2 class="text-lg font-semibold">GitHub 加速</h2>
        <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 font-medium">双线</span>
      </div>
      
      <div class="relative group">
        <input id="github-url" type="text" placeholder="粘贴 GitHub 文件链接 (例如 blob/main/file.zip)" 
          class="input-box w-full p-3 pl-4 pr-24 rounded-xl outline-none transition-all text-sm font-medium"
          onkeypress="handleKeyPress(event)">
        <button onclick="convertGithubUrl()" class="absolute right-1.5 top-1.5 bottom-1.5 btn-primary px-5 rounded-lg text-sm shadow-sm hover:shadow-md">
          转换
        </button>
      </div>

      <!-- GitHub 结果 -->
      <div id="github-result-group" class="mt-5 hidden flex flex-col gap-3 animate-slide-up">
        <!-- 代理 -->
        <div class="result-area rounded-xl p-3 flex items-center gap-3 transition-colors">
            <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                <span class="text-xs font-bold">1</span>
            </div>
            <div class="flex-grow min-w-0">
                <div class="text-xs font-medium opacity-50 mb-0.5">通用代理 (推荐)</div>
                <code id="res-proxy" class="block text-sm font-mono truncate select-all text-blue-600 dark:text-blue-400"></code>
            </div>
            <div class="flex gap-1">
                <button onclick="copyText('res-proxy')" class="btn-icon p-2" title="复制链接">📋</button>
                <button onclick="openLink('res-proxy')" class="btn-icon p-2" title="打开链接">🔗</button>
            </div>
        </div>
        
        <!-- CDN -->
        <div class="result-area rounded-xl p-3 flex items-center gap-3 transition-colors">
            <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                 <span class="text-xs font-bold">2</span>
            </div>
            <div class="flex-grow min-w-0">
                <div class="text-xs font-medium opacity-50 mb-0.5">jsDelivr CDN</div>
                <code id="res-jsdelivr" class="block text-sm font-mono truncate select-all text-green-600 dark:text-green-400"></code>
                <div id="jsdelivr-error" class="text-xs text-red-500 hidden mt-1">不支持此格式</div>
            </div>
            <div class="flex gap-1" id="jsdelivr-btns">
                <button onclick="copyText('res-jsdelivr')" class="btn-icon p-2" title="复制链接">📋</button>
                <button onclick="openLink('res-jsdelivr')" class="btn-icon p-2" title="打开链接">🔗</button>
            </div>
        </div>
      </div>
    </div>
    
    <!-- Docker 模块 -->
    <div class="mb-2">
      <div class="flex items-center gap-2 mb-3">
         <h2 class="text-lg font-semibold">Docker 镜像</h2>
      </div>
      <div class="flex gap-2">
        <div class="flex-grow relative">
             <input id="docker-image" type="text" placeholder="镜像地址 (如 nginx:latest)" 
              class="input-box w-full p-3 pl-4 rounded-xl outline-none transition-all text-sm font-medium">
        </div>
        <button onclick="convertDockerImage()" class="btn-primary px-6 rounded-xl text-sm shadow-sm hover:shadow-md whitespace-nowrap">
          获取命令
        </button>
      </div>
      
      <!-- Docker 结果 -->
      <div id="docker-result-group" class="mt-4 hidden animate-slide-up">
        <div class="result-area rounded-xl p-3 flex items-center gap-3">
             <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
                <span class="text-lg">🐳</span>
            </div>
            <code id="res-docker" class="flex-grow text-sm font-mono truncate select-all text-purple-600 dark:text-purple-400"></code>
            <button onclick="copyText('res-docker')" class="btn-icon p-2">📋</button>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center">
        <p class="text-xs opacity-40 hover:opacity-100 transition-opacity duration-300">
            Powered by<a href="https://github.com/fscarmen2/Cloudflare-Accel" class="text-blue-500 hover:underline">fscarmen2/Cloudflare-Accel</a>; Mod by djkyc
        </p>
    </div>
  </div>

  <div id="toast" class="toast"></div>

  <script>
    const currentDomain = window.location.hostname;
    const currentProtocol = window.location.protocol;

    function toggleTheme() {
      const body = document.body;
      const sun = document.querySelector('.sun');
      const moon = document.querySelector('.moon');
      if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        sun.classList.add('hidden'); moon.classList.remove('hidden');
        localStorage.setItem('theme', 'dark');
      } else {
        body.classList.replace('dark-mode', 'light-mode');
        moon.classList.add('hidden'); sun.classList.remove('hidden');
        localStorage.setItem('theme', 'light');
      }
    }
    if (localStorage.getItem('theme') === 'dark') toggleTheme();

    function showToast(msg, isError = false) {
      const t = document.getElementById('toast');
      t.innerText = msg;
      t.className = 'toast show ' + (isError ? 'bg-red-500' : 'bg-green-500');
      setTimeout(() => t.classList.remove('show'), 3000);
    }

    function copyText(id) {
      const text = document.getElementById(id).innerText;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => showToast('已复制')).catch(() => {
          const ta = document.createElement('textarea');
          ta.value = text; document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); showToast('已复制'); } catch(e) { showToast('复制失败', true); }
          document.body.removeChild(ta);
      });
    }

    function openLink(id) {
      const url = document.getElementById(id).innerText;
      if (url && url.startsWith('http')) window.open(url, '_blank');
    }
    
    function handleKeyPress(e) { if (e.key === 'Enter') convertGithubUrl(); }

    // GitHub URL Parsing
    function parseGithubParts(urlStr) {
        try {
            const url = new URL(urlStr);
            const pathParts = url.pathname.split('/').filter(p => p);
            
            // 1. github.com/user/repo/blob/branch/path
            if (url.hostname === 'github.com') {
                if (pathParts.length >= 4 && pathParts[2] === 'blob') {
                    return { user: pathParts[0], repo: pathParts[1], branch: pathParts[3], path: pathParts.slice(4).join('/') };
                }
                if (pathParts.length >= 4 && pathParts[2] === 'raw') {
                    return { user: pathParts[0], repo: pathParts[1], branch: pathParts[3], path: pathParts.slice(4).join('/') };
                }
            }
            // 2. raw.githubusercontent.com/user/repo/branch/path
            if (url.hostname === 'raw.githubusercontent.com') {
                if (pathParts.length >= 3) {
                    // Handle refs/heads/branch if present
                    if (pathParts[2] === 'refs' && pathParts[3] === 'heads' && pathParts.length >= 5) {
                        return { user: pathParts[0], repo: pathParts[1], branch: pathParts[4], path: pathParts.slice(5).join('/') };
                    }
                    return { user: pathParts[0], repo: pathParts[1], branch: pathParts[2], path: pathParts.slice(3).join('/') };
                }
            }
            return null;
        } catch (e) { return null; }
    }

    function convertGithubUrl() {
      const inputEl = document.getElementById('github-url');
      const resultGroup = document.getElementById('github-result-group');
      const proxyEl = document.getElementById('res-proxy');
      const jsdelivrEl = document.getElementById('res-jsdelivr');
      const jsdelivrErr = document.getElementById('jsdelivr-error');
      
      const input = inputEl.value.trim();
      if (!input) { showToast('请输入 GitHub 链接', true); return; }
      if (!input.startsWith('http')) { showToast('链接必须以 http(s) 开头', true); return; }

      // 1. Universal Proxy
      // Use string concatenation to ensure no template literal syntax errors in the worker response
      const proxyUrl = currentProtocol + '//' + currentDomain + '/' + input;
      proxyEl.innerText = proxyUrl;
      
      // 2. jsDelivr
      const parts = parseGithubParts(input);
      const jsdelivrContainer = jsdelivrEl.parentElement;
      const jsdelivrBtns = jsdelivrContainer.querySelectorAll('button');
      
      if (parts) {
          const cdnUrl = 'https://cdn.jsdelivr.net/gh/' + parts.user + '/' + parts.repo + '@' + parts.branch + '/' + parts.path;
          jsdelivrEl.innerText = cdnUrl;
          jsdelivrEl.classList.remove('text-gray-400', 'italic');
          jsdelivrEl.classList.add('text-green-600', 'dark:text-green-400');
          jsdelivrErr.classList.add('hidden');
          jsdelivrBtns.forEach(function(b){ b.disabled = false; });
      } else {
          jsdelivrEl.innerText = "不支持此链接格式 (仅支持文件 Raw 链接)";
          jsdelivrEl.classList.remove('text-green-600', 'dark:text-green-400');
          jsdelivrEl.classList.add('text-gray-400', 'italic');
          jsdelivrErr.classList.remove('hidden');
          jsdelivrBtns.forEach(function(b){ b.disabled = true; });
      }

      resultGroup.classList.remove('hidden');
    }

    function convertDockerImage() {
      const input = document.getElementById('docker-image').value.trim();
      if (!input) { showToast('请输入镜像地址', true); return; }
      const cmd = 'docker pull ' + currentDomain + '/' + input;
      document.getElementById('res-docker').innerText = cmd;
      document.getElementById('docker-result-group').classList.remove('hidden');
    }
  </script>
</body>
</html>
`;


async function handleToken(realm, service, scope) {
  const tokenUrl = `${realm}?service=${service}&scope=${scope}`;
  console.log(`Fetching token from: ${tokenUrl}`);
  try {
    const tokenResponse = await fetch(tokenUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!tokenResponse.ok) {
      console.log(`Token request failed: ${tokenResponse.status} ${tokenResponse.statusText}`);
      return null;
    }
    const tokenData = await tokenResponse.json();
    const token = tokenData.token || tokenData.access_token;
    if (!token) {
      console.log('No token found in response');
      return null;
    }
    console.log('Token acquired successfully');
    return token;
  } catch (error) {
    console.log(`Error fetching token: ${error.message}`);
    return null;
  }
}

async function handleRequest(request, redirectCount = 0) {
  const url = new URL(request.url);
  let path = url.pathname;

  console.log(`Request: ${request.method} ${path}`);

  // 首页路由
  if (path === '/' || path === '') {
    return new Response(HOMEPAGE_HTML, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // 处理 Docker V2 API
  let isV2Request = false;
  if (path.startsWith('/v2/')) {
    isV2Request = true;
    path = path.replace('/v2/', '');
  }

  // =========================================================
  // 核心解析逻辑重构：支持通用代理前缀 (https://proxy/TargetUrl)
  // =========================================================

  let targetDomain = '';
  let targetPath = '';
  let isDockerRequest = false;

  // 1. 尝试解析为完整 URL (去掉开头的 /)
  // 兼容 /https://domain... 和 /https:/domain...
  let rawPath = path.substring(1);
  let targetUrlStr = '';

  // 检查开头是否为 http:/ 或 https:/ (忽略掉可能的第二个斜杠缺失)
  if (/^https?:\//i.test(rawPath)) {
    // 修复可能被规范化掉的双斜杠
    if (rawPath.startsWith('http:/') && !rawPath.startsWith('http://')) {
      targetUrlStr = rawPath.replace('http:/', 'http://');
    } else if (rawPath.startsWith('https:/') && !rawPath.startsWith('https://')) {
      targetUrlStr = rawPath.replace('https:/', 'https://');
    } else {
      targetUrlStr = rawPath;
    }

    // 加上 query string
    targetUrlStr += url.search;
  }

  if (targetUrlStr) {
    // ---> 这是一个符合通用格式的代理请求
    try {
      const targetObj = new URL(targetUrlStr);
      targetDomain = targetObj.hostname;
      targetPath = targetObj.pathname + targetObj.search;

      // 根据域名判断是否是 Docker 相关
      isDockerRequest = [
        'quay.io',
        'gcr.io',
        'k8s.gcr.io',
        'registry.k8s.io',
        'ghcr.io',
        'docker.cloudsmith.io',
        'registry-1.docker.io'
      ].includes(targetDomain);

    } catch (e) {
      return new Response('Error: Invalid target URL format.\n', { status: 400 });
    }
  } else {
    // ---> 不是完整 URL，可能是 Docker Short Form 或 域名/路径 格式
    const pathParts = path.split('/').filter(part => part);
    if (pathParts.length < 1) {
      return new Response('Invalid request: target domain or path required\n', { status: 400 });
    }

    // 检查第一部分是否为支持的域名
    if (!ALLOWED_HOSTS.includes(pathParts[0])) {
      // 默认为 Docker Hub 的 library (如 /nginx -> library/nginx)
      isDockerRequest = true;
      targetDomain = 'registry-1.docker.io';
      targetPath = isV2Request ? 'v2/' + pathParts.join('/') : `library/${pathParts.join('/')}`;

      // 注意：如果是 v2 请求，上面的逻辑可能需要微调，保持原有逻辑即可
      if (isV2Request) {
        // 如果是 /v2/nginx/manifests/... -> 原始 path 是 nginx/manifests/...
        // 此时 pathParts 是 ['nginx', 'manifests'...]
        // targetPath 应该是 v2/nginx/manifests...
        targetPath = 'v2/' + pathParts.join('/');
      }
    } else {
      // 显式域名 (如 /ghcr.io/user/repo)
      targetDomain = pathParts[0];
      targetPath = pathParts.slice(1).join('/') + url.search;
      isDockerRequest = ['quay.io', 'gcr.io', 'k8s.gcr.io', 'registry.k8s.io', 'ghcr.io', 'docker.cloudsmith.io', 'registry-1.docker.io'].includes(targetDomain);
    }
  }

  // 白名单检查
  if (!ALLOWED_HOSTS.includes(targetDomain)) {
    console.log(`Blocked: Domain ${targetDomain} not in allowed list`);
    return new Response(`Error: Invalid target domain ${targetDomain}.\n`, { status: 400 });
  }

  // 路径限制检查
  if (RESTRICT_PATHS) {
    // ... (保持原有逻辑)
  }

  // 构建最终目标 URL
  let finalTargetUrl = '';
  if (targetUrlStr) {
    finalTargetUrl = targetUrlStr; // 已经包含了 query
  } else {
    finalTargetUrl = `https://${targetDomain}/${targetPath}`;
  }

  console.log(`Target URL: ${finalTargetUrl}`);

  // 后续构建 Request 逻辑保持不变...
  const newRequestHeaders = new Headers(request.headers);
  newRequestHeaders.set('Host', targetDomain);
  newRequestHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'); // 建议固定 UA

  const newRequest = new Request(finalTargetUrl, {
    method: request.method,
    headers: newRequestHeaders,
    body: request.body,
    redirect: 'follow'
  });

  try {
    let response = await fetch(newRequest);
    console.log(`Initial response: ${response.status}`);

    // Docker 401 Challenge 处理 (保持不变)
    if (isDockerRequest && response.status === 401) {
      // ... (保持原有 token 处理逻辑)
      const wwwAuth = response.headers.get('WWW-Authenticate');
      if (wwwAuth) {
        const authMatch = wwwAuth.match(/Bearer realm="([^"]+)",service="([^"]*)",scope="([^"]*)"/);
        if (authMatch) {
          const [, realm, service, scope] = authMatch;
          const token = await handleToken(realm, service || targetDomain, scope);

          if (token) {
            const authHeaders = new Headers(newRequestHeaders);
            authHeaders.set('Authorization', `Bearer ${token}`);
            const authRequest = new Request(finalTargetUrl, {
              method: request.method,
              headers: authHeaders,
              body: request.body,
              redirect: 'follow'
            });
            response = await fetch(authRequest);
          }
        }
      }
    }

    // 处理 S3 重定向 (Docker 层)
    if (isDockerRequest && (response.status === 307 || response.status === 302)) {
      const redirectUrl = response.headers.get('Location');
      if (redirectUrl) {
        const redirectRequest = new Request(redirectUrl, {
          method: request.method,
          headers: newRequestHeaders, // 或只保留必要头
          body: request.body,
          redirect: 'follow'
        });
        response = await fetch(redirectRequest);
      }
    }

    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
    if (isDockerRequest) {
      newResponse.headers.set('Docker-Distribution-API-Version', 'registry/2.0');
    }
    return newResponse;

  } catch (error) {
    return new Response(`Error fetching ${finalTargetUrl}: ${error.message}`, { status: 500 });
  }
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  }
};
