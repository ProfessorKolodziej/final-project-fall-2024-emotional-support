// 获取URL参数
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        type: params.get('type') || 'happy'
    };
}

// 设置CSS变量
function setThemeColors(primaryColor, secondaryColor) {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
}

// 加载名言
function loadQuotes(quotes) {
    const quotesContainer = document.getElementById('quotes-container');
    quotesContainer.innerHTML = '';
    
    quotes.forEach(quote => {
        const quoteCard = document.createElement('div');
        quoteCard.className = 'quote-card';
        
        // 检查名言是否已保存
        const isSaved = isItemSaved('savedQuotes', quote);
        const heartClass = isSaved ? 'fas' : 'far';
        const buttonClass = isSaved ? 'save-button saved' : 'save-button';
        
        quoteCard.innerHTML = `
            <div class="quote-content">
                <div class="quote-text">${quote.text}</div>
                <div class="quote-author">${quote.author}</div>
            </div>
            <button class="${buttonClass}">
                <i class="${heartClass} fa-heart"></i> Save
            </button>
        `;
        
        quotesContainer.appendChild(quoteCard);
    });
    
    // 为保存按钮添加点击事件
    document.querySelectorAll('.save-button').forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const quoteItem = this.closest('.quote-card');
            const quoteText = quoteItem.querySelector('.quote-text').textContent;
            const quoteAuthor = quoteItem.querySelector('.quote-author').textContent;
            
            const quoteData = {
                text: quoteText,
                author: quoteAuthor
            };
            
            if (icon.classList.contains('far')) {
                // 保存到localStorage
                if (saveItem('savedQuotes', quoteData)) {
                    // 更新UI
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.classList.add('saved');
                    this.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
                    
                    // 显示保存成功提示
                    showToast('Quote saved successfully!');
                }
            } else {
                // 从localStorage中删除
                const savedQuotes = window.getSavedItems('savedQuotes');
                const quoteIndex = savedQuotes.findIndex(q => q.text === quoteData.text);
                
                if (quoteIndex !== -1 && removeItem('savedQuotes', quoteIndex)) {
                    // 更新UI
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    this.classList.remove('saved');
                    this.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
                    
                    // 显示删除成功提示
                    showToast('Quote removed from saved items');
                }
            }
        });
    });
}

// 显示提示信息
function showToast(message) {
    // 检查是否已有toast
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // 设置消息并显示
    toast.textContent = message;
    toast.classList.add('show');
    
    // 2秒后隐藏
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// 初始化页面
function initPage() {
    const params = getUrlParams();
    const emotionType = params.type;
    
    fetch('./emotions.json')
        .then(response => response.json())
        .then(data => {
            const emotionData = data[emotionType];
            if (!emotionData) {
                console.error('Emotion type not found in configuration');
                return;
            }
            
            // 设置页面标题
            document.title = emotionData.sections.quotes.title + ' - 情绪支持应用';
            document.getElementById('page-title').textContent = emotionData.sections.quotes.title;
            
            // 设置主题颜色
            setThemeColors(emotionData.primaryColor, emotionData.secondaryColor);
            
            // 更新后退链接
            document.getElementById('back-link').href = `emotion.html?type=${emotionType}`;
            
            // 加载名言
            loadQuotes(emotionData.sections.quotes.allQuotes);
            
        })
        .catch(error => {
            console.error('Error loading emotion data:', error);
        });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initPage); 