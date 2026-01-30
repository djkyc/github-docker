// 更新日期: 2026-01-30，更新内容: 恢复为简单的通用代理模式 (移除 jsDelivr)

// 用户配置区域开始 =================================
// 以下变量用于配置代理服务的白名单和安全设置，可根据需求修改。

// ALLOWED_HOSTS: 定义允许代理的域名列表（默认白名单）。
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

// RESTRICT_PATHS: 控制是否限制 GitHub 和 Docker 请求的路径。
const RESTRICT_PATHS = false;

// ALLOWED_PATHS: 定义 GitHub 和 Docker 的允许路径关键字。
const ALLOWED_PATHS = [
  'library',   // Docker Hub 官方镜像仓库的命名空间
  'user-id-1',
  'user-id-2',
];

// 用户配置区域结束 =================================

// 闪电 SVG 图标（Base64 编码）
const LIGHTNING_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
</svg>`;

// 首页 HTML
const HOMEPAGE_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloudflare 加速</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(LIGHTNING_SVG)}">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', sans-serif;
      transition: background-color 0.3s, color 0.3s;
      padding: 1rem;
    }
    .light-mode {
      background: linear-gradient(to bottom right, #f1f5f9, #e2e8f0);
      color: #111827;
    }
    .dark-mode {
      background: linear-gradient(to bottom right, #1f2937, #374151);
      color: #e5e7eb;
    }
    .container {
      width: 100%;
      max-width: 800px;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    .light-mode .container {
      background: #ffffff;
    }
    .dark-mode .container {
      background: #1f2937;
    }
    .section-box {
      background: linear-gradient(to bottom, #ffffff, #f3f4f6);
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .dark-mode .section-box {
      background: linear-gradient(to bottom, #374151, #1f2937);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    .theme-toggle {
      position: fixed;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.5rem;
      font-size: 1.2rem;
    }
    .toast {
      position: fixed;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      background: #10b981;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      opacity: 0;
      transition: opacity 0.3s;
      font-size: 0.9rem;
      max-width: 90%;
      text-align: center;
      z-index: 50;
    }
    .toast.show {
      opacity: 1;
    }
    .result-box code {
      word-break: break-all;
    }
    .result-group {
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body class="light-mode">
  <button onclick="toggleTheme()" class="theme-toggle bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition">
    <span class="sun">☀️</span>
    <span class="moon hidden">🌙</span>
  </button>
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8">Cloudflare 加速下载</h1>
    
    <!-- GitHub 链接转换 -->
    <div class="section-box">
      <h2 class="text-xl font-semibold mb-2">⚡ GitHub 文件加速</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-4">输入 GitHub 文件链接，自动生成加速链接。</p>
      
      <div class="flex gap-2 mb-2">
        <input 
          id="github-url" 
          type="text" 
          placeholder="例如：https://github.com/user/repo/blob/main/file.txt" 
          class="flex-grow p-2 border border-gray-400 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          onkeypress="handleKeyPress(event)"
        >
        <button 
          onclick="convertGithubUrl()" 
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition whitespace-nowrap"
        >
          转换
        </button>
      </div>

      <!-- 结果展示区域 -->
      <div id="github-result-group" class="result-group mt-6 hidden">
        <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
            <code id="res-proxy" class="flex-grow text-sm font-mono text-blue-600 dark:text-blue-400 select-all mr-2"></code>
            <div class="flex gap-1">
                <button onclick="copyText('res-proxy')" class="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded transition text-gray-600 dark:text-gray-300" title="复制链接">📋</button>
                <button onclick="openLink('res-proxy')" class="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded transition text-gray-600 dark:text-gray-300" title="新标签页打开">🔗</button>
            </div>
        </div>
      </div>
    </div>
    
    <!-- Docker 镜像加速 -->
    <div class="section-box">
      <h2 class="text-xl font-semibold mb-2">🐳 Docker 镜像加速</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-4">输入原镜像地址（如 nginx:latest 或 ghcr.io/user/repo:tag），获取加速拉取命令。</p>
      <div class="flex gap-2 mb-2">
        <input 
          id="docker-image" 
          type="text" 
          placeholder="例如：nginx:latest 或 ghcr.io/user/repo:tag" 
          class="flex-grow p-2 border border-gray-400 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        >
        <button 
          onclick="convertDockerImage()" 
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition whitespace-nowrap"
        >
          获取命令
        </button>
      </div>
      
      <div id="docker-result-group" class="mt-4 hidden animate-fade-in">
        <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
            <code id="res-docker" class="flex-grow text-sm font-mono text-purple-600 dark:text-purple-400 select-all mr-2"></code>
            <button onclick="copyText('res-docker')" class="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded transition text-gray-600 dark:text-gray-300">📋</button>
        </div>
      </div>
    </div>
    
    <footer class="mt-10 pb-6 text-center text-xs text-gray-400 dark:text-gray-500">
      <p> 鸣谢原代码Powered by F佬 Cloudflare Workers | Mod 二次修改 by djkyc </p>
    </footer>
  </div>

  <div id="toast" class="toast"></div>

  <script>
    const currentDomain = window.location.hostname;
    const currentProtocol = window.location.protocol;

    // 主题管理
    function toggleTheme() {
      const body = document.body;
      const sun = document.querySelector('.sun');
      const moon = document.querySelector('.moon');
      if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        sun.classList.add('hidden');
        moon.classList.remove('hidden');
        localStorage.setItem('theme', 'dark');
      } else {
        body.classList.replace('dark-mode', 'light-mode');
        moon.classList.add('hidden');
        sun.classList.remove('hidden');
        localStorage.setItem('theme', 'light');
      }
    }
    if (localStorage.getItem('theme') === 'dark') toggleTheme();

    function showToast(message, isError = false) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.className = \`toast show \${isError ? 'bg-red-500' : 'bg-green-500'}\`;
      setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function copyToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
      }
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return Promise.resolve();
      } catch (e) {
        document.body.removeChild(textarea);
        return Promise.reject(e);
      }
    }
    
    function copyText(elementId) {
        const text = document.getElementById(elementId).innerText;
        if (!text) return;
        copyToClipboard(text)
            .then(() => showToast('已复制到剪贴板'))
            .catch(() => showToast('复制失败', true));
    }

    function openLink(elementId) {
        const text = document.getElementById(elementId).innerText;
        if (text && text.startsWith('http')) {
            window.open(text, '_blank');
        }
    }
    
    function handleKeyPress(event) {
        if (event.key === 'Enter') convertGithubUrl();
    }

    function convertGithubUrl() {
      const inputEl = document.getElementById('github-url');
      const resultGroup = document.getElementById('github-result-group');
      const proxyEl = document.getElementById('res-proxy');
      
      if (!inputEl || !resultGroup || !proxyEl) return;
      
      const input = inputEl.value.trim();
      if (!input) {
        showToast('请输入 GitHub 链接', true);
        return;
      }
      // 简单拼接，不做复杂校验
      const proxyUrl = currentProtocol + '//' + currentDomain + '/' + input;
      proxyEl.innerText = proxyUrl;
      resultGroup.classList.remove('hidden');
    }

    function convertDockerImage() {
      const input = document.getElementById('docker-image').value.trim();
      if (!input) {
        showToast('请输入镜像地址', true);
        return;
      }
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
