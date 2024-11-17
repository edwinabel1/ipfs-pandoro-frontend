document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('redeemForm');
    const errorMessage = document.getElementById('errorMessage');

    // 后端 API 地址
    const API_URL = 'https://ipfs-pandoro-tienda-api.edwin-abel-3.workers.dev/api/codes/redeem';

    // 动态加载语言包内容
    async function getLangStrings() {
        const currentLang = localStorage.getItem('language') || 'en';
        try {
            const response = await fetch(`lang/${currentLang}.json`);
            return await response.json();
        } catch (error) {
            console.error(`Failed to load language file for ${currentLang}:`, error);
            return {};
        }
    }

    // 提交表单处理兑换逻辑
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const codeInput = document.getElementById('code');
        const code = codeInput.value.trim();

        // 加载当前语言提示内容
        const langStrings = await getLangStrings();

        // 校验输入
        if (!code) {
            displayError(langStrings['error-empty'] || 'Code cannot be empty.');
            return;
        }

        // 调用后端 API 验证兑换码
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                displayError(result.message || langStrings['error-redeem-failed'] || 'Redeem failed. Please try again.');
                return;
            }

            // 如果兑换成功，生成结果页链接并跳转
            const { session_id, quota_remaining } = result.data;
            const uploadLink = 'https://app.ipfs-pandoro.link';
            const resultUrl = `result.html?session_id=${encodeURIComponent(session_id)}&quota=${encodeURIComponent(quota_remaining)}&upload_link=${encodeURIComponent(uploadLink)}`;
            window.location.href = resultUrl;
        } catch (error) {
            console.error('Redeem request error:', error);
            displayError(langStrings['error-unexpected'] || 'An unexpected error occurred. Please try again later.');
        }
    });

    // 显示错误信息
    function displayError(message) {
        errorMessage.innerText = message;
        errorMessage.style.color = 'red';
        errorMessage.style.display = 'block';
    }
});
