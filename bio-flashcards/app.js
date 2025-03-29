// 初始化数据
let allTerms = [];
let currentDeck = [];
let touchStartX = 0;

// 加载数据
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    allTerms = data.chapters.flatMap(chapter => 
      chapter.terms.map(term => ({
        ...term,
        chapterId: chapter.id,
        chapterTitle: chapter.title
      }))
    );
    initChapterSelect(data.chapters);
    renderCards(allTerms);
  });

// 更多交互代码...（完整代码见之前的回复）