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

// 加载图片
function loadImages(images) {
    const imageGrid = document.getElementById('image-grid');
    imageGrid.innerHTML = '';
    
    images.forEach(image => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        // 检查图片是否已保存
        const isSaved = isItemSaved('savedImages', image);
        const heartClass = isSaved ? 'fas' : 'far';
        
        imageItem.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <div class="image-overlay">
                <button class="save-button ${isSaved ? 'saved' : ''}">
                    <i class="${heartClass} fa-heart"></i>
                </button>
            </div>
        `;
        
        // 添加点击事件以全屏查看图片
        const imgElement = imageItem.querySelector('img');
        imgElement.addEventListener('click', function() {
            openFullscreen(image.src, image.alt);
        });
        
        // 添加保存按钮点击事件
        const saveButton = imageItem.querySelector('.save-button');
        saveButton.addEventListener('click', function(e) {
            e.stopPropagation(); // 防止触发全屏查看
            
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // 保存图片
                if (saveItem('savedImages', image)) {
                    // 更新UI
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.classList.add('saved');
                    
                    // 显示保存成功提示
                    showToast('Image saved successfully!');
                }
            } else {
                // 从保存中移除
                const savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
                const imageIndex = savedImages.findIndex(img => img.src === image.src);
                
                if (imageIndex !== -1 && removeItem('savedImages', imageIndex)) {
                    // 更新UI
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    this.classList.remove('saved');
                    
                    // 显示移除成功提示
                    showToast('Image removed from saved items');
                }
            }
        });
        
        imageGrid.appendChild(imageItem);
    });
}

// 全屏查看图片
function openFullscreen(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    
    overlay.innerHTML = `
        <div class="fullscreen-image-container">
            <img src="${src}" alt="${alt}">
            <button class="close-button">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // 禁止滚动
    document.body.style.overflow = 'hidden';
    
    // 添加关闭事件
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target.closest('.close-button')) {
            document.body.removeChild(overlay);
            document.body.style.overflow = '';
        }
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
            document.title = emotionData.sections.images.title + ' - 情绪支持应用';
            document.getElementById('page-title').textContent = emotionData.sections.images.title;
            
            // 设置主题颜色
            setThemeColors(emotionData.primaryColor, emotionData.secondaryColor);
            
            // 更新后退链接
            document.getElementById('back-link').href = `emotion.html?type=${emotionType}`;
            
            // 加载图片
            loadImages(emotionData.sections.images.galleryImages);
            
        })
        .catch(error => {
            console.error('Error loading emotion data:', error);
        });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initPage); 