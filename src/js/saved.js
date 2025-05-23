// 从本地存储获取保存的内容
function getSavedItems() {
    // 从localStorage获取数据
    const savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
    const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
    const savedSongs = JSON.parse(localStorage.getItem('savedSongs') || '[]');
    
    // 如果缓存中没有数据，使用默认数据
    const savedData = {
        images: savedImages.length > 0 ? savedImages : [
            { src: "./images/happy/1.jpg", alt: "Happy moment 1" },
            { src: "./images/sad/2.jpg", alt: "Calming scene 2" },
            { src: "./images/anxious/3.jpg", alt: "Peaceful scene 3" },
            { src: "./images/happy/4.jpg", alt: "Happy moment 4" },
            { src: "./images/fear/5.jpg", alt: "Courage scene 5" },
            { src: "./images/angry/6.jpg", alt: "Peaceful scene 6" }
        ],
        quotes: savedQuotes.length > 0 ? savedQuotes : [
            { 
                text: "\"For every minute you remain angry, you give up sixty seconds of peace of mind.\"", 
                author: "- Ralph Waldo Emerson"
            },
            { 
                text: "\"Life is not a problem to be solved, but a reality to be experienced.\"", 
                author: "- Søren Kierkegaard"
            },
            { 
                text: "\"There is a crack in everything. That's how the light gets in.\"", 
                author: "- Leonard Cohen"
            },
            { 
                text: "\"Nothing diminishes anxiety faster than action.\"", 
                author: "— Walter Anderson"
            }
        ],
        songs: savedSongs.length > 0 ? savedSongs : [
            {
                title: "You'd Never Know",
                artist: "BLU EYES",
                cover: "./images/bt.jpg"
            }
        ]
    };
    
    return savedData;
}

// 渲染保存的图片
function renderSavedImages(images) {
    const container = document.getElementById('saved-images');
    container.innerHTML = '';
    
    images.forEach(image => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        imageItem.innerHTML = `
            <img src="${image.src}" alt="${image.alt}">
        `;
        
        container.appendChild(imageItem);
    });
}

// 渲染保存的名言
function renderSavedQuotes(quotes) {
    const container = document.getElementById('saved-quotes');
    container.innerHTML = '';
    
    quotes.forEach((quote, index) => {
        const quoteItem = document.createElement('div');
        quoteItem.className = 'quote-item';
        
        quoteItem.innerHTML = `
            <div class="quote-content">
                <div class="quote-text">${quote.text}</div>
                <div class="quote-author">${quote.author}</div>
            </div>
            <button class="save-button saved">
                <i class="fas fa-heart"></i> Save
            </button>
        `;
        
        container.appendChild(quoteItem);
    });
    
    // 为保存按钮添加点击事件
    document.querySelectorAll('.save-button').forEach((btn, index) => {
        btn.addEventListener('click', function() {
            // 从localStorage中删除该项目
            const quoteItem = this.closest('.quote-item');
            quoteItem.style.opacity = '0';
            
            setTimeout(() => {
                // 获取当前保存的名言
                const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
                // 删除指定索引的名言
                savedQuotes.splice(index, 1);
                // 更新localStorage
                localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
                
                quoteItem.remove();
            }, 300);
        });
    });
}

// 渲染保存的歌曲
function renderSavedSongs(songs) {
    const container = document.getElementById('saved-songs');
    container.innerHTML = '';
    
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        
        songItem.innerHTML = `
            <div class="song-info">
                <div class="song-icon">
                    <i class="fas fa-music"></i>
                </div>
                <div class="song-details">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
            </div>
            <div class="song-controls">
                <button class="play-button">
                    <i class="fas fa-play"></i>
                </button>
                <button class="remove-song-button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(songItem);
    });
    
    // 为播放按钮添加点击事件
    document.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', function() {
            // 这里实际应用中会播放歌曲
            const playIcon = this.querySelector('i');
            
            if (playIcon.classList.contains('fa-play')) {
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
            } else {
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
            }
        });
    });
    
    // 为删除按钮添加点击事件
    document.querySelectorAll('.remove-song-button').forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const songItem = this.closest('.song-item');
            songItem.style.opacity = '0';
            
            setTimeout(() => {
                // 获取当前保存的歌曲
                const savedSongs = JSON.parse(localStorage.getItem('savedSongs') || '[]');
                // 删除指定索引的歌曲
                savedSongs.splice(index, 1);
                // 更新localStorage
                localStorage.setItem('savedSongs', JSON.stringify(savedSongs));
                
                songItem.remove();
            }, 300);
        });
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    const savedItems = getSavedItems();
    
    renderSavedImages(savedItems.images);
    renderSavedQuotes(savedItems.quotes);
    renderSavedSongs(savedItems.songs);
}); 