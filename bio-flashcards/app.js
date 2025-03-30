class FlashcardSystem {
    constructor() {
        this.data = biologyData;
        this.bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        this.currentDeck = [];
        this.currentIndex = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderHome();
    }

    setupEventListeners() {
        document.getElementById('search').addEventListener('input', (e) => {
            this.searchHandler(e.target.value);
        });
    }

    renderHome() {
        const content = `
            <div class="mode-select">
                <button class="mode-btn" onclick="app.renderChapterSelection()">章节模式</button>
                <button class="mode-btn" onclick="app.startQuiz('random')">随机模式</button>
                <button class="mode-btn" onclick="app.startQuiz('bookmarked')">收藏模式</button>
            </div>
        `;
        document.getElementById('content').innerHTML = content;
    }

    renderChapterSelection() {
        const chapters = this.data.chapters.map(chapter => `
            <button class="mode-btn" onclick="app.startQuiz('chapter', ${chapter.id})">
                ${chapter.name}
            </button>
        `).join('');
        document.getElementById('content').innerHTML = `
            <div class="mode-select">${chapters}</div>
        `;
    }

    startQuiz(mode, chapterId) {
        switch(mode) {
            case 'chapter':
                this.currentDeck = this.data.chapters.find(c => c.id === chapterId).words;
                break;
            case 'random':
                this.currentDeck = this.data.chapters.flatMap(c => c.words)
                    .sort(() => Math.random() - 0.5);
                break;
            case 'bookmarked':
                this.currentDeck = this.bookmarks;
                break;
        }
        this.renderModeSelection();
    }

    renderModeSelection() {
        const content = `
            <div class="mode-select">
                <button class="mode-btn" onclick="app.renderGrid()">速查模式</button>
                <button class="mode-btn" onclick="app.startTest()">考查模式</button>
            </div>
        `;
        document.getElementById('content').innerHTML = content;
    }

    renderGrid() {
        const cards = this.currentDeck.map(word => `
            <div class="flashcard" onclick="app.flipCard(this)">
                <div class="card-front">${word.en}</div>
                <div class="card-back">
                    <strong>${word.cn}</strong>
                    <p>${word.definition}</p>
                    <div class="bookmark" onclick="app.toggleBookmark(event, ${JSON.stringify(word)})">
                        ${this.bookmarks.some(b => b.en === word.en) ? '❤️' : '🤍'}
                    </div>
                </div>
            </div>
        `).join('');
        document.getElementById('content').innerHTML = `
            <div class="grid-container">${cards}</div>
        `;
    }

    startTest() {
        this.currentIndex = 0;
        this.renderTestCard();
    }

    renderTestCard() {
        const word = this.currentDeck[this.currentIndex];
        if (!word) {
            document.getElementById('content').innerHTML = `
                <div class="quiz-mode">
                    <h2>学习完成！</h2>
                    <button onclick="app.renderHome()">返回首页</button>
                </div>
            `;
            return;
        }

        document.getElementById('content').innerHTML = `
            <div class="quiz-mode">
                <div class="flashcard">
                    <div class="card-front">${word.en}</div>
                    <div class="card-back">
                        <strong>${word.cn}</strong>
                        <p>${word.definition}</p>
                        <div class="bookmark" onclick="app.toggleBookmark(event, ${JSON.stringify(word)})">
                            ${this.bookmarks.some(b => b.en === word.en) ? '❤️' : '🤍'}
                        </div>
                    </div>
                </div>
                <div class="controls">
                    <button onclick="app.nextCard()">Skip</button>
                    <button onclick="app.flipCard(document.querySelector('.flashcard'))">Flip</button>
                </div>
                <div>进度: ${this.currentIndex + 1}/${this.currentDeck.length}</div>
            </div>
        `;
    }

    flipCard(element) {
        element.classList.toggle('flipped');
    }

    nextCard() {
        this.currentIndex++;
        this.renderTestCard();
    }

    toggleBookmark(event, word) {
        event.stopPropagation();
        const index = this.bookmarks.findIndex(b => b.en === word.en);
        
        if (index === -1) {
            this.bookmarks.push(word);
        } else {
            this.bookmarks.splice(index, 1);
        }
        
        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
        event.target.innerHTML = index === -1 ? '❤️' : '🤍';
    }

    searchHandler(keyword) {
        const filtered = this.data.chapters.flatMap(c => c.words)
            .filter(word => word.en.toLowerCase().includes(keyword.toLowerCase()) || 
                          word.cn.includes(keyword));
        
        this.currentDeck = filtered;
        this.renderGrid();
    }
}

// 初始化系统
const app = new FlashcardSystem();