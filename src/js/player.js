// 获取URL参数
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        type: params.get('type') || 'happy',
        index: parseInt(params.get('index') || '0')
    };
}

// 格式化时间为分钟:秒
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 播放器状态
let currentEmotion = 'happy';
let currentSongs = [];
let currentIndex = 0;
let isPlaying = false;

// 获取DOM元素
const audioPlayer = document.getElementById('audio-player');
const playButton = document.getElementById('play-button');
const playIcon = document.getElementById('play-icon');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const albumCover = document.getElementById('album-cover');
const songName = document.getElementById('song-name');
const artistName = document.getElementById('artist-name');
const songTitle = document.getElementById('song-title');
const favoriteButton = document.getElementById('favorite-button');
const backLink = document.getElementById('back-link');
const playlistContainer = document.getElementById('playlist-container');

// 播放或暂停
function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    } else {
        audioPlayer.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
}

// 播放上一首
function playPrevious() {
    if (currentIndex > 0) {
        currentIndex--;
        loadSong();
    }
}

// 播放下一首
function playNext() {
    if (currentIndex < currentSongs.length - 1) {
        currentIndex++;
        loadSong();
    }
}

// 更新进度条
function updateProgress() {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
}

// 设置播放时间
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

// 加载并播放歌曲
function loadSong() {
    if (currentSongs.length <= 0 || currentIndex < 0 || currentIndex >= currentSongs.length) {
        return;
    }
    
    const song = currentSongs[currentIndex];
    
    // 更新URL以反映当前歌曲
    const newUrl = `music_player.html?type=${currentEmotion}&index=${currentIndex}`;
    window.history.replaceState({}, '', newUrl);
    
    // 更新页面元素
    songName.textContent = song.title;
    artistName.textContent = song.artist;
    songTitle.textContent = song.title;
    albumCover.src = song.coverSrc;
    
    // 设置音频源
    audioPlayer.src = song.audioSrc;
    
    // 设置总时长
    totalTimeEl.textContent = song.duration;
    
    // 如果之前是播放状态，则自动开始播放
    if (isPlaying) {
        audioPlayer.play();
    }
    
    // 更新后退链接
    backLink.href = `emotion.html?type=${currentEmotion}`;
    
    // 更新播放列表高亮
    updatePlaylistHighlight();
    
    // 检查当前歌曲是否已保存
    updateFavoriteButton(song);
}

// 更新收藏按钮状态
function updateFavoriteButton(song) {
    const songData = {
        title: song.title,
        artist: song.artist,
        cover: song.coverSrc
    };
    
    const isSaved = isItemSaved('savedSongs', songData);
    const icon = favoriteButton.querySelector('i');
    
    if (isSaved) {
        icon.classList.remove('far');
        icon.classList.add('fas');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
    }
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

// 加载播放列表
function loadPlaylist() {
    playlistContainer.innerHTML = '';
    
    if (currentSongs.length <= 0) {
        return;
    }
    
    currentSongs.forEach((song, index) => {
        if (index === currentIndex) return; // 跳过当前播放的歌曲
        
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.dataset.index = index;
        
        playlistItem.innerHTML = `
            <div class="playlist-image">
                <img src="${song.coverSrc}" alt="${song.title}">
            </div>
            <div class="playlist-info">
                <div class="playlist-title">${song.title}</div>
                <div class="playlist-artist">${song.artist}</div>
            </div>
        `;
        
        playlistItem.addEventListener('click', function() {
            currentIndex = parseInt(this.dataset.index);
            loadSong();
            togglePlay();
        });
        
        playlistContainer.appendChild(playlistItem);
    });
}

// 更新播放列表高亮
function updatePlaylistHighlight() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach(item => {
        const index = parseInt(item.dataset.index);
        if (index === currentIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 初始化页面
function initPlayer() {
    const params = getUrlParams();
    currentEmotion = params.type;
    currentIndex = params.index;
    
    fetch('./emotions.json')
        .then(response => response.json())
        .then(data => {
            const emotionData = data[currentEmotion];
            if (!emotionData) {
                console.error('Emotion type not found in configuration');
                return;
            }
            
            // 获取歌曲列表
            currentSongs = emotionData.sections.music.items;
            
            // 加载选中的歌曲
            loadSong();
            
            // 加载播放列表
            loadPlaylist();
            
        })
        .catch(error => {
            console.error('Error loading emotion data:', error);
        });
}

// 初始化事件监听
function initEvents() {
    // 播放/暂停按钮
    playButton.addEventListener('click', togglePlay);
    
    // 上一首/下一首
    prevButton.addEventListener('click', playPrevious);
    nextButton.addEventListener('click', playNext);
    
    // 音频事件
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', playNext);
    
    // 进度条点击
    document.querySelector('.progress-bar').addEventListener('click', setProgress);
    
    // 收藏按钮
    favoriteButton.addEventListener('click', function() {
        const icon = this.querySelector('i');
        const isSaved = icon.classList.contains('fas');
        
        if (!isSaved && currentSongs.length > 0) {
            const song = currentSongs[currentIndex];
            const songData = {
                title: song.title,
                artist: song.artist,
                cover: song.coverSrc
            };
            
            if (saveItem('savedSongs', songData)) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showToast('Song saved to favorites');
            }
        } else if (isSaved && currentSongs.length > 0) {
            const song = currentSongs[currentIndex];
            const songData = {
                title: song.title,
                artist: song.artist,
                cover: song.coverSrc
            };
            
            const savedSongs = JSON.parse(localStorage.getItem('savedSongs') || '[]');
            const songIndex = savedSongs.findIndex(s => s.title === songData.title && s.artist === songData.artist);
            
            if (songIndex !== -1 && removeItem('savedSongs', songIndex)) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showToast('Song removed from favorites');
            }
        }
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initPlayer();
    initEvents();
}); 