// 保存项目到localStorage
function saveItem(type, item) {
    // 从localStorage获取已保存的项目
    const savedItems = JSON.parse(localStorage.getItem(type) || '[]');
    
    // 检查项目是否已存在（防止重复）
    const isDuplicate = savedItems.some(savedItem => {
        if (type === 'savedImages') {
            return savedItem.src === item.src;
        } else if (type === 'savedQuotes') {
            return savedItem.text === item.text;
        } else if (type === 'savedSongs') {
            return savedItem.title === item.title && savedItem.artist === item.artist;
        }
        return false;
    });
    
    // 如果项目不存在，则添加到保存列表
    if (!isDuplicate) {
        savedItems.push(item);
        localStorage.setItem(type, JSON.stringify(savedItems));
        return true; // 保存成功
    }
    
    return false; // 项目已存在
}

// 删除已保存的项目
function removeItem(type, index) {
    const savedItems = JSON.parse(localStorage.getItem(type) || '[]');
    
    if (index >= 0 && index < savedItems.length) {
        savedItems.splice(index, 1);
        localStorage.setItem(type, JSON.stringify(savedItems));
        return true; // 删除成功
    }
    
    return false; // 索引无效
}

// 检查项目是否已保存
function isItemSaved(type, item) {
    const savedItems = JSON.parse(localStorage.getItem(type) || '[]');
    
    return savedItems.some(savedItem => {
        if (type === 'savedImages') {
            return savedItem.src === item.src;
        } else if (type === 'savedQuotes') {
            return savedItem.text === item.text;
        } else if (type === 'savedSongs') {
            return savedItem.title === item.title && savedItem.artist === item.artist;
        }
        return false;
    });
}

// 获取所有保存的项目
function getSavedItems(type) {
    return JSON.parse(localStorage.getItem(type) || '[]');
}

// 本地存储键名
const SAVED_QUOTES_KEY = 'saved_emotion_quotes';

// 获取已保存的引言
function getSavedQuotes() {
    const savedQuotesJson = localStorage.getItem(SAVED_QUOTES_KEY);
    return savedQuotesJson ? JSON.parse(savedQuotesJson) : [];
}

// 保存引言
function saveQuote(quote) {
    const savedQuotes = getSavedQuotes();
    
    // 检查是否已经保存过该引言
    if (!isQuoteSaved(quote)) {
        savedQuotes.push(quote);
        localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(savedQuotes));
        return true;
    }
    return false;
}

// 移除已保存的引言
function removeQuote(quote) {
    const savedQuotes = getSavedQuotes();
    const index = savedQuotes.findIndex(q => 
        q.content === quote.content && q.author === quote.author);
    
    if (index !== -1) {
        savedQuotes.splice(index, 1);
        localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(savedQuotes));
        return true;
    }
    return false;
}

// 检查引言是否已保存
function isQuoteSaved(quote) {
    const savedQuotes = getSavedQuotes();
    return savedQuotes.some(q => 
        q.content === quote.content && q.author === quote.author);
} 