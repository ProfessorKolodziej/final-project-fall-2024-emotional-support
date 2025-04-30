// 从URL获取情绪类型
function getEmotionType() {
    const urlParams = new URLSearchParams(window.location.search);
    const emotionType = urlParams.get('type');
    return emotionType || 'happy'; // 默认为happy
}

// 设置CSS变量
function setThemeColors(primaryColor, secondaryColor) {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
}

// 渲染音乐部分
function renderMusicSection(musicData) {
    const container = document.getElementById('music-container');
    container.innerHTML = '';
    
    document.getElementById('music-title').textContent = musicData.title;
    
    // Use event listener instead of inline onclick
    document.getElementById('music-more').addEventListener('click', function() {
        window.location.href = musicData.moreLink;
    });
    
    musicData.items.forEach((music, index) => {
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        
        // Use event listener instead of inline onclick
        musicItem.addEventListener('click', function() {
            window.location.href = `music_player.html?type=${getEmotionType()}&index=${index}`;
        });
        
        musicItem.innerHTML = `
            <div class="music-icon">
                <i class="fas ${music.icon}"></i>
            </div>
            <div class="music-details">
                <div class="music-title">${music.title}</div>
                <div class="music-artist">${music.artist}</div>
            </div>
            <div class="play-button">
                <i class="fas fa-play"></i>
            </div>
        `;
        
        container.appendChild(musicItem);
    });
}

// 渲染图片部分
function renderImagesSection(imagesData) {
    const container = document.getElementById('images-container');
    container.innerHTML = '';
    
    document.getElementById('images-title').textContent = imagesData.title;
    
    // Use event listener instead of inline onclick
    document.getElementById('images-more').addEventListener('click', function() {
        window.location.href = `emotion_images.html?type=${getEmotionType()}`;
    });
    
    imagesData.items.forEach(imageUrl => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        imageItem.innerHTML = `<img src="${imageUrl}" alt="Emotion image">`;
        
        container.appendChild(imageItem);
    });
}

// 渲染名言部分
function renderQuotesSection(quotesData) {
    const container = document.getElementById('quotes-container');
    container.innerHTML = '';
    
    document.getElementById('quotes-title').textContent = quotesData.title;
    
    // Use event listener instead of inline onclick
    document.getElementById('quotes-more').addEventListener('click', function() {
        window.location.href = `emotion_quotes.html?type=${getEmotionType()}`;
    });
    
    quotesData.items.forEach(quote => {
        const quoteItem = document.createElement('div');
        quoteItem.className = 'affirmation';
        
        quoteItem.innerHTML = `
            <div class="quote">${quote.text}</div>
            <div class="author">${quote.author}</div>
            <button class="save-button">
                <i class="fas fa-heart"></i> Save
            </button>
        `;
        
        container.appendChild(quoteItem);
    });
}

// 处理保存按钮点击事件
function handleSaveButtonClicks() {
    document.addEventListener('click', function(event) {
        if (event.target.closest('.save-button')) {
            const saveButton = event.target.closest('.save-button');
            const icon = saveButton.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                saveButton.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                saveButton.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
            }
        }
    });
}

// 初始化页面
function initPage() {
    const emotionType = getEmotionType();
    
    fetch('./emotions.json')
        .then(response => response.json())
        .then(data => {
            const emotionData = data[emotionType];
            if (!emotionData) {
                console.error('Emotion type not found in configuration');
                return;
            }
            
            // 设置页面标题
            document.title = emotionData.title + ' - 情绪支持应用';
            document.getElementById('page-title').textContent = emotionData.title;
            
            // 设置主题颜色
            setThemeColors(emotionData.primaryColor, emotionData.secondaryColor);
            
            // 渲染各部分内容
            renderMusicSection(emotionData.sections.music);
            renderImagesSection(emotionData.sections.images);
            renderQuotesSection(emotionData.sections.quotes);
        })
        .catch(error => {
            console.error('Error loading emotion data:', error);
        });
}

// 执行初始化
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    handleSaveButtonClicks();
}); 