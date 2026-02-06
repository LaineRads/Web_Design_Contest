// Homepage //
function toggleTheme() {
document.body.classList.toggle('dark-mode');
const isDark = document.body.classList.contains('dark-mode');
localStorage.setItem('theme', isDark ? 'dark' : 'light');
updateThemeIcon();
}
function updateThemeIcon() {
const icon = document.querySelector('.theme-icon');

if (document.body.classList.contains('dark-mode')) {
icon.textContent = "\u{2600}\u{FE0F}"; 
} 
else {
    icon.textContent = "\u{1F319}";
}
        }
        document.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('theme') || 'light';
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                updateThemeIcon();
            }
        });

// Quiz Mode //
let quizQuestions = [];         
let currentQuestionIndex = 0;   
let selectedOption = null;      
let quizCorrect = 0;           
let quizWrong = 0;             
let quizAnswers = [];          
let currentQuizCategory = 'all'; 

document.addEventListener('DOMContentLoaded', () => {
    renderQuizCategories();     
    updateTotalCardsInfo();     
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon();
    }
});

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
        if (document.body.classList.contains('dark-mode')) {
            icon.textContent = "\u{2600}\u{FE0F}";
        } else {
            icon.textContent = "\u{1F319}";   
        }
    }

function renderQuizCategories() {
    const list = document.getElementById('categoriesList');

    if (!categories.length) {
        list.innerHTML = `
            <div class="empty-state">
                <p>No categories available</p>
                <p class="empty-subtitle">Create flashcards first!</p>
                <a href="study-updated.html" class="btn btn-primary btn-full empty-redirect-btn">
                    Go to Study Page
                </a>
            </div>`;
        return;
    }

    list.innerHTML = `
        <div class="category-item ${currentQuizCategory === 'all' ? 'active':''}"
             onclick="selectQuizCategory('all')"
             style="border-left:4px solid #667eea">
            <div>
                <div class="category-name-text">All Categories</div>
                <div class="category-count">${flashcards.length} cards</div>
            </div>
        </div>
    ` + categories.map(cat => {
        const count = flashcards.filter(c => c.categoryId === cat.id).length;
        return `
        <div class="category-item ${currentQuizCategory === cat.id ? 'active':''}"
             onclick="selectQuizCategory('${cat.id}')"
             style="border-left:4px solid ${cat.color}">
            <div>
                <div class="category-name-text">${cat.name}</div>
                <div class="category-count">${count} cards</div>
            </div>
        </div>`;
    }).join('');
}

function selectQuizCategory(id) {
    currentQuizCategory = id;
    renderQuizCategories();      
    updateTotalCardsInfo();      
}

function updateTotalCardsInfo() {
    const deck = currentQuizCategory === 'all'
        ? flashcards
        : flashcards.filter(c => c.categoryId === currentQuizCategory);
    document.getElementById('totalCardsInfo').textContent = deck.length;
}

function startQuiz() {
    const deck = currentQuizCategory === 'all'
        ? [...flashcards]
        : flashcards.filter(c => c.categoryId === currentQuizCategory);
    if (deck.length === 0) {
        alert('No cards available in this category!');
        return;
    }

    const shuffled = deck.sort(() => Math.random() - 0.5);

    quizQuestions = shuffled.map(card => {
        const correctAnswer = card.answer;
        const wrongAnswers = generateWrongAnswers(card, deck);
        const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
        
        return {
            id: card.id,
            question: card.question,
            options: allOptions,
            correctAnswer: correctAnswer,
            selectedAnswer: null,
            isCorrect: null
        };
    });

    currentQuestionIndex = 0;
    quizCorrect = 0;
    quizWrong = 0;
    quizAnswers = [];
    selectedOption = null;

    document.querySelector('.main-container').classList.add('quiz-active');
    document.querySelector('.left-panel').style.display = 'none';
    document.getElementById('quizStartScreen').style.display = 'none';
    document.getElementById('quizActiveScreen').style.display = 'grid';
    document.getElementById('quizResultsScreen').style.display = 'none';
    displayQuestion();
    updateQuizProgress();
}

function generateWrongAnswers(currentCard, allCards) {
    const otherAnswers = allCards
        .filter(c => c.id !== currentCard.id && c.answer !== currentCard.answer)
        .map(c => c.answer);

    if (otherAnswers.length >= 2) {
        const shuffled = otherAnswers.sort(() => Math.random() - 0.5);
        return [shuffled[0], shuffled[1]];
    }
    
    const wrongAnswers = [];
    if (otherAnswers.length > 0) {
        wrongAnswers.push(otherAnswers[0]);
    } else {
        wrongAnswers.push("Option A (generated)");
    }
    wrongAnswers.push("This is not the correct answer");
    
    return wrongAnswers;
}

function displayQuestion() {
    const question = quizQuestions[currentQuestionIndex];

    document.getElementById('questionNum').textContent = currentQuestionIndex + 1;
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = quizQuestions.length;
    document.getElementById('questionText').textContent = question.question;

    document.getElementById('optionA').textContent = question.options[0];
    document.getElementById('optionB').textContent = question.options[1];
    document.getElementById('optionC').textContent = question.options[2];

    const options = document.querySelectorAll('.option-item');
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'wrong', 'disabled');
    });

    document.getElementById('feedbackContainer').style.display = 'none';
    document.getElementById('submitAnswerBtn').style.display = 'block';
    document.getElementById('nextQuestionBtn').style.display = 'none';
    selectedOption = null;
}

function selectOption(option)
    {
    selectedOption = option;
    document.querySelectorAll('.option-item').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    const selectedElement = document.querySelector(`[data-option="${option}"]`);
    selectedElement.classList.add('selected');
}

function submitAnswer() {
    if (!selectedOption) {
        alert('Please select an answer!');
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    const selectedIndex = selectedOption.charCodeAt(0) - 65;
    const selectedAnswer = question.options[selectedIndex];
    const isCorrect = selectedAnswer === question.correctAnswer;
    question.selectedAnswer = selectedAnswer;
    question.isCorrect = isCorrect;
    quizAnswers.push({
        question: question.question,
        selected: selectedAnswer,
        correct: question.correctAnswer,
        isCorrect: isCorrect
    });

    if (isCorrect) {
        quizCorrect++;
    } else {
        quizWrong++;
    }

    const feedbackContainer = document.getElementById('feedbackContainer');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const correctAnswerInfo = document.getElementById('correctAnswerInfo');

    if (isCorrect) {

        feedbackContainer.className = 'feedback-container correct';
        feedbackMessage.textContent = ' Correct! Well done!';
        correctAnswerInfo.style.display = 'none';
        const selectedElement = document.querySelector(`[data-option="${selectedOption}"]`);
        selectedElement.classList.remove('selected');
        selectedElement.classList.add('correct');
    } else {
       
        feedbackContainer.className = 'feedback-container wrong';
        feedbackMessage.textContent = ' Incorrect!';
        correctAnswerInfo.textContent = `Correct answer: ${question.correctAnswer}`;
        correctAnswerInfo.style.display = 'block';

        const selectedElement = document.querySelector(`[data-option="${selectedOption}"]`);
        selectedElement.classList.remove('selected');
        selectedElement.classList.add('wrong');
        
        const correctIndex = question.options.indexOf(question.correctAnswer);
        const correctLetter = String.fromCharCode(65 + correctIndex);
        const correctElement = document.querySelector(`[data-option="${correctLetter}"]`);
        correctElement.classList.add('correct');
    }

    feedbackContainer.style.display = 'block';

    document.querySelectorAll('.option-item').forEach(opt => {
        opt.classList.add('disabled');
    });

    document.getElementById('submitAnswerBtn').style.display = 'none';
    document.getElementById('nextQuestionBtn').style.display = 'block';
    updateQuizProgress();
}

function nextQuestion() {
    
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        displayQuestion();
    } else {
        showResults(); 
    }
}

function showResults() {
    document.getElementById('quizActiveScreen').style.display = 'none';
    document.getElementById('quizResultsScreen').style.display = 'block';
    const score = Math.round((quizCorrect / quizQuestions.length) * 100);
    

    document.getElementById('scorePercentage').textContent = score + '%';
    document.getElementById('correctAnswersResult').textContent = quizCorrect;
    document.getElementById('wrongAnswersResult').textContent = quizWrong;
    document.getElementById('totalQuestionsResult').textContent = quizQuestions.length;
}


function retakeQuiz() {
    startQuiz();
}


function backToStart() {
    document.querySelector('.main-container').classList.remove('quiz-active');
    document.querySelector('.left-panel').style.display = 'block';
    document.querySelector('.right-panel').style.display = 'block';
    document.getElementById('quizStartScreen').style.display = 'flex';
    document.getElementById('quizActiveScreen').style.display = 'none';
    document.getElementById('quizResultsScreen').style.display = 'none';
    updateQuizProgress();
}

function updateQuizProgress() {
    const total = quizQuestions.length;
    const current = quizAnswers.length;
    
    if (total > 0) {
        const percent = Math.round((current / total) * 100);
        document.getElementById('quizProgressFill').style.width = percent + '%';
        document.getElementById('quizProgressPercent').textContent = percent + '%';
    } else {
        document.getElementById('quizProgressFill').style.width = '0%';
        document.getElementById('quizProgressPercent').textContent = '0%';
    }
    
    document.getElementById('currentCorrect').textContent = quizCorrect;
    document.getElementById('currentWrong').textContent = quizWrong;
    
    const accuracy = (quizCorrect + quizWrong) > 0 
        ? Math.round((quizCorrect / (quizCorrect + quizWrong)) * 100)
        : 0;
    document.getElementById('currentAccuracy').textContent = accuracy + '%';
}

// Study contains function //
let categories = [];          
let flashcards = [];         
let currentDeck = [];       
let currentCardIndex = 0;    
let isFlipped = false;      
let currentCategory = 'all'; 
let editingCategoryId = null; 
let editingCardId = null;    


document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();    
    renderCategories();       
    updateCategorySelect();   
    selectCategory('all');    
    updateAllStats();        
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon();
    }
});


function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}


function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
        if (document.body.classList.contains('dark-mode')) {
            icon.textContent = "\u{2600}\u{FE0F}"; 
        } else {
            icon.textContent = "\u{1F319}";   
        }
    }


function saveToLocalStorage() {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    localStorage.setItem('categories', JSON.stringify(categories));
}


function loadFromLocalStorage() {
    const savedCards = localStorage.getItem('flashcards');
    const savedCategories = localStorage.getItem('categories');

    flashcards = savedCards ? JSON.parse(savedCards) : [
        { id: 1, categoryId: 'demo', question: 'What is JavaScript?', answer: 'Programming language for the web.', known: false }
    ];

    categories = savedCategories ? JSON.parse(savedCategories) : [
        { id: 'demo', name: 'JavaScript Basics', color: '#667eea' }
    ];
}


function renderCategories() {
    const list = document.getElementById('categoriesList');

    if (!categories.length) {
        list.innerHTML = `<div class="empty-state">No categories yet</div>`;
        return;
    }

    list.innerHTML = categories.map(cat => {
        const count = flashcards.filter(c => c.categoryId === cat.id).length;
        return `
        <div class="category-item ${currentCategory === cat.id ? 'active':''}"
             onclick="selectCategory('${cat.id}')"
             style="border-left:4px solid ${cat.color}">
            <div>
                <div class="category-name-text">${cat.name}</div>
                <div class="category-count">${count} cards</div>
            </div>
            <div class="category-actions">
                <button onclick="event.stopPropagation(); editCategory('${cat.id}')"><section id="pen">&#9999;</section></button>
                <button onclick="event.stopPropagation(); deleteCategory('${cat.id}')"><section id="trash">&#128465;</section></button>
            </div>
        </div>`;
    }).join('');
}


function selectCategory(id) {
    currentCategory = id;
    currentCardIndex = 0;

    currentDeck = id === 'all'
        ? [...flashcards]
        : flashcards.filter(c => c.categoryId === id);

    document.getElementById('currentDeckTitle').textContent =
        id === 'all'
            ? 'All Cards'
            : categories.find(c=>c.id===id)?.name || 'Deck';

    renderCategories();
    displayCard();
    updateAllStats();
}

function showAddCategoryModal() {
    editingCategoryId = null;
    document.getElementById('categoryForm').reset();
    document.getElementById('addCategoryModal').style.display = 'flex';
}

function editCategory(id) {
    editingCategoryId = id;
    const cat = categories.find(c=>c.id===id);
    document.getElementById('categoryNameInput').value = cat.name;
    document.getElementById('categoryColorInput').value = cat.color;
    document.getElementById('addCategoryModal').style.display = 'flex';
}

function handleCategorySubmit(e) {
    e.preventDefault();

    const name = categoryNameInput.value.trim();
    const color = categoryColorInput.value;

    if (editingCategoryId) {
        const c = categories.find(x=>x.id===editingCategoryId);
        c.name = name;
        c.color = color;
    } else {
        categories.push({ id:'cat_'+Date.now(), name, color });
    }

    saveToLocalStorage();
    renderCategories();
    updateCategorySelect();
    closeCategoryModal();
}

function deleteCategory(id) {
    if (!confirm("Delete category and its cards?")) return;
    categories = categories.filter(c=>c.id!==id);
    flashcards = flashcards.filter(c=>c.categoryId!==id);
    saveToLocalStorage();
    selectCategory('all');
}

function closeCategoryModal() {
    addCategoryModal.style.display = 'none';
    editingCategoryId = null;
}

function updateCategorySelect() {
    categorySelect.innerHTML =
        '<option value="">Choose a category...</option>' +
        categories.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
}

function editSelectedCategory() {
    const id = categorySelect.value;
    if (id) editCategory(id);
}

function displayCard() {
    flashcard.classList.remove('flipped');
    isFlipped = false;

    if (!currentDeck.length) {
        cardFront.textContent = 'No cards yet';
        cardBack.textContent = '';
        currentCard.textContent = 0;
        totalCards.textContent = 0;
        return;
    }

    const c = currentDeck[currentCardIndex];
    cardFront.textContent = c.question;
    cardBack.textContent = c.answer;

    currentCard.textContent = currentCardIndex+1;
    totalCards.textContent = currentDeck.length;

    updateProgressBar();
}

function flipCard() {
    if (!currentDeck.length) return;
    flashcard.classList.toggle('flipped');
}

function nextCard() {
    if (!currentDeck.length) return;
    currentCardIndex = (currentCardIndex+1)%currentDeck.length;
    displayCard();
}

function prevCard() {
    if (!currentDeck.length) return;
    currentCardIndex = (currentCardIndex-1+currentDeck.length)%currentDeck.length;
    displayCard();
}

function markKnown() {
    if (!currentDeck.length) return;
    const id = currentDeck[currentCardIndex].id;
    const c = flashcards.find(x=>x.id===id);
    c.known = true;
    saveToLocalStorage();
    updateAllStats();
    nextCard();
}

function shuffleDeck() {
    currentDeck.sort(()=>Math.random()-0.5);
    currentCardIndex = 0;
    displayCard();
}

function resetProgress() {
    if (!confirm("Reset progress?")) return;
    flashcards.forEach(c=>c.known=false);
    saveToLocalStorage();
    updateAllStats();
}


function showAddCardModal() {
    editingCardId = null;
    cardForm.reset();
    categorySelect.value = currentCategory !== 'all' ? currentCategory : '';
    addCardModal.style.display = 'flex';
}

function editCurrentCard() {
    if (!currentDeck.length) return;
    const c = currentDeck[currentCardIndex];
    editingCardId = c.id;
    categorySelect.value = c.categoryId;
    questionInput.value = c.question;
    answerInput.value = c.answer;
    addCardModal.style.display = 'flex';
}

function handleCardSubmit(e) {
    e.preventDefault();

    const categoryId = categorySelect.value;
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (!categoryId || !question || !answer) {
        alert("Fill all fields");
        return;
    }

    let savedId;

    if (editingCardId) {
        const c = flashcards.find(x=>x.id===editingCardId);
        c.categoryId = categoryId;
        c.question = question;
        c.answer = answer;
        savedId = c.id;
    } else {
        const newCard = {
            id: Date.now(),
            categoryId,
            question,
            answer,
            known:false
        };
        flashcards.push(newCard);
        savedId = newCard.id;
    }

    saveToLocalStorage();

    currentDeck = currentCategory === 'all'
        ? [...flashcards]
        : flashcards.filter(c=>c.categoryId===currentCategory);

    currentCardIndex = currentDeck.findIndex(c=>c.id===savedId);

    renderCategories();
    displayCard();
    updateAllStats();
    closeCardModal();
}

function deleteCurrentCard() {
    if (!currentDeck.length) return;
    if (!confirm("Delete card?")) return;

    const id = currentDeck[currentCardIndex].id;
    flashcards = flashcards.filter(c=>c.id!==id);
    selectCategory(currentCategory);
    saveToLocalStorage();
}

function closeCardModal() {
    addCardModal.style.display = 'none';
    cardForm.reset();
    editingCardId = null;
}


function updateAllStats() {
    updateProgressBar();

    const known = flashcards.filter(c=>c.known).length;
    const total = flashcards.length;

    knownCount.textContent = known;
    learningCount.textContent = total-known;
    masteryRate.textContent = total ? Math.round(known/total*100)+"%" : "0%";
}

function updateProgressBar() {
    if (!currentDeck.length) {
        progressFill.style.width = '0%';
        progressPercent.textContent = '0%';
        return;
    }

    const pct = ((currentCardIndex+1)/currentDeck.length)*100;
    progressFill.style.width = pct+'%';
    progressPercent.textContent = Math.round(pct)+'%';
}


document.addEventListener('keydown', e=>{
    if (e.target.tagName==='INPUT' || e.target.tagName==='TEXTAREA') return;

    if (e.key===' ') flipCard();
    if (e.key==='ArrowRight') nextCard();
    if (e.key==='ArrowLeft') prevCard();
    if (e.key==='k') markKnown();
});


window.onclick = e=>{
    if (e.target===addCardModal) closeCardModal();
    if (e.target===addCategoryModal) closeCategoryModal();
};

        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon();
        }

        function updateThemeIcon() {
        const icon = document.querySelector('.theme-icon');
            if (document.body.classList.contains('dark-mode')) {
                icon.textContent = "\u{2600}\u{FE0F}";
            } else {
                icon.textContent = "\u{1F319}";   
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('theme') || 'light';
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                updateThemeIcon();
            }
        });