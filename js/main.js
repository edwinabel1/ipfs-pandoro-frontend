// 默认语言设置
const defaultLang = 'en';

// 获取用户语言
function getUserLanguage() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) return savedLang;

    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('zh') ? 'zh' : 'en'; // 默认语言为英文
}

// 保存用户选择的语言
function setUserLanguage(lang) {
    localStorage.setItem('language', lang);
}

// 加载语言包
function loadLanguage(lang) {
    fetch(`lang/${lang}.json`)
        .then(response => {
            if (!response.ok) throw new Error(`Language file for '${lang}' not found`);
            return response.json();
        })
        .then(data => {
            document.querySelectorAll('[data-lang-key]').forEach(el => {
                const key = el.getAttribute('data-lang-key');
                el.innerText = data[key] || el.innerText; // 替换为语言包中的内容
            });
        })
        .catch(error => {
            console.error('Error loading language:', error);
        });
}

function initLanguageSwitcher() {
    const languageDropdown = document.getElementById('language-dropdown');
    if (!languageDropdown) {
        console.warn('Language selector not found on this page.');
        return; // 如果没有语言选择器，则直接返回
    }

    const currentLang = getUserLanguage();

    // 设置下拉菜单的当前值
    languageDropdown.value = currentLang;

    // 监听语言切换
    languageDropdown.addEventListener('change', (event) => {
        const selectedLang = event.target.value;
        setUserLanguage(selectedLang);
        loadLanguage(selectedLang);
    });
}

// 初始化页面语言
function initLanguage() {
    const userLang = getUserLanguage();
    loadLanguage(userLang);
    initLanguageSwitcher();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initLanguage);
