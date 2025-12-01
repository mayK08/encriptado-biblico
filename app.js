class BibleApp {
    constructor() {
        this.cipher = new BibleCipher();
        this.books = [
            // Antiguo Testamento
            'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
            'joshua', 'judges', 'ruth', '1 samuel', '2 samuel',
            '1 kings', '2 kings', '1 chronicles', '2 chronicles', 'ezra',
            'nehemiah', 'esther', 'job', 'psalms', 'proverbs',
            'ecclesiastes', 'song of solomon', 'isaiah', 'jeremiah', 'lamentations',
            'ezekiel', 'daniel', 'hosea', 'joel', 'amos',
            'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk',
            'zephaniah', 'haggai', 'zechariah', 'malachi',
            
            // Nuevo Testamento
            'matthew', 'mark', 'luke', 'john', 'acts',
            'romans', '1 corinthians', '2 corinthians', 'galatians', 'ephesians',
            'philippians', 'colossians', '1 thessalonians', '2 thessalonians', '1 timothy',
            '2 timothy', 'titus', 'philemon', 'hebrews', 'james',
            '1 peter', '2 peter', '1 john', '2 john', '3 john',
            'jude', 'revelation'
        ];
        
        this.init();
    }

    init() {
        this.loadBooks();
        this.setupEventListeners();
    }

    loadBooks() {
        const bookSelect = document.getElementById('book');
        const decryptBookSelect = document.getElementById('decryptBook');
        
        // Limpiar selects primero
        bookSelect.innerHTML = '<option value="">Selecciona un libro...</option>';
        decryptBookSelect.innerHTML = '<option value="">Selecciona un libro...</option>';
        
        this.books.forEach(book => {
            const formattedBook = this.formatBookName(book);
            
            const option = document.createElement('option');
            option.value = book;
            option.textContent = formattedBook;
            bookSelect.appendChild(option);
            
            const option2 = document.createElement('option');
            option2.value = book;
            option2.textContent = formattedBook;
            decryptBookSelect.appendChild(option2);
        });
    }

    formatBookName(bookName) {
        return bookName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    async loadChapters() {
        const bookSelect = document.getElementById('book');
        const chapterSelect = document.getElementById('chapter');
        const verseSelect = document.getElementById('verse');
        
        const book = bookSelect.value;
        if (!book) return;
        
        chapterSelect.innerHTML = '<option value="">Selecciona un capítulo...</option>';
        verseSelect.innerHTML = '<option value="">Selecciona un versículo...</option>';
        
        this.showLoading();
        
        try {
            // Para simplificar, asumimos que cada libro tiene 50 capítulos
            for (let i = 1; i <= 50; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Capítulo ${i}`;
                chapterSelect.appendChild(option);
            }
            
            // También cargar capítulos en el panel de descifrado
            this.loadDecryptChapters(book);
        } catch (error) {
            console.error('Error cargando capítulos:', error);
        } finally {
            this.hideLoading();
        }
    }

    async loadVerses() {
        const bookSelect = document.getElementById('book');
        const chapterSelect = document.getElementById('chapter');
        const verseSelect = document.getElementById('verse');
        
        const book = bookSelect.value;
        const chapter = chapterSelect.value;
        
        if (!book || !chapter) return;
        
        verseSelect.innerHTML = '<option value="">Selecciona un versículo...</option>';
        
        this.showLoading();
        
        try {
            // Para simplificar, asumimos 30 versículos por capítulo
            for (let i = 1; i <= 30; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Versículo ${i}`;
                verseSelect.appendChild(option);
            }
            
            // También cargar versículos en el panel de descifrado
            this.loadDecryptVerses(book, chapter);
        } catch (error) {
            console.error('Error cargando versículos:', error);
        } finally {
            this.hideLoading();
        }
    }

    async loadDecryptChapters(book = null) {
        const decryptBookSelect = document.getElementById('decryptBook');
        const decryptChapterSelect = document.getElementById('decryptChapter');
        
        const selectedBook = book || decryptBookSelect.value;
        if (!selectedBook) return;
        
        decryptChapterSelect.innerHTML = '<option value="">Selecciona un capítulo...</option>';
        
        for (let i = 1; i <= 50; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Capítulo ${i}`;
            decryptChapterSelect.appendChild(option);
        }
    }

    async loadDecryptVerses(book = null, chapter = null) {
        const decryptBookSelect = document.getElementById('decryptBook');
        const decryptChapterSelect = document.getElementById('decryptChapter');
        const decryptVerseSelect = document.getElementById('decryptVerse');
        
        const selectedBook = book || decryptBookSelect.value;
        const selectedChapter = chapter || decryptChapterSelect.value;
        
        if (!selectedBook || !selectedChapter) return;
        
        decryptVerseSelect.innerHTML = '<option value="">Selecciona un versículo...</option>';
        
        for (let i = 1; i <= 30; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Versículo ${i}`;
            decryptVerseSelect.appendChild(option);
        }
    }

    async showSelectedVerse() {
        const book = document.getElementById('book').value;
        const chapter = document.getElementById('chapter').value;
        const verse = document.getElementById('verse').value;
        
        if (!book || !chapter || !verse) return;
        
        const reference = `${book}+${chapter}:${verse}`;
        const verseDisplay = document.getElementById('verseDisplay');
        
        verseDisplay.innerHTML = '<em>Cargando versículo...</em>';
        
        try {
            const verseText = await this.cipher.getVerse(reference);
            verseDisplay.textContent = `"${verseText}"`;
        } catch (error) {
            verseDisplay.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
        }
    }

    setupEventListeners() {
        // Event listeners para el panel de descifrado
        document.getElementById('decryptBook').addEventListener('change', () => {
            this.loadDecryptChapters();
        });
        
        document.getElementById('decryptChapter').addEventListener('change', () => {
            this.loadDecryptVerses();
        });
    }

    syncBookSelection() {
        const encryptBook = document.getElementById('book').value;
        const decryptBook = document.getElementById('decryptBook');
        
        decryptBook.value = encryptBook;
        
        // Actualizar capítulos y versículos en el panel de descifrado
        if (encryptBook) {
            this.loadDecryptChapters(encryptBook);
        }
    }

    async encryptMessage() {
        const book = document.getElementById('book').value;
        const chapter = document.getElementById('chapter').value;
        const verse = document.getElementById('verse').value;
        const message = document.getElementById('messageToEncrypt').value.trim();
        
        if (!book || !chapter || !verse) {
            this.showError('Por favor selecciona un libro, capítulo y versículo');
            return;
        }
        
        if (!message) {
            this.showError('Por favor escribe un mensaje para cifrar');
            return;
        }
        
        this.showLoading();
        
        try {
            const reference = `${book}+${chapter}:${verse}`;
            const result = await this.cipher.encrypt(message, reference);
            
            document.getElementById('encryptedResult').textContent = result.encrypted;
            this.showSuccess('Mensaje cifrado exitosamente!');
            
            // Mostrar la referencia usada para ayudar al descifrado
            document.getElementById('encryptedResult').innerHTML = 
                `<strong>Texto cifrado:</strong><br>${result.encrypted}<br><br>
                 <strong>Referencia usada:</strong> ${this.formatBookName(book)} ${chapter}:${verse}`;
            
        } catch (error) {
            this.showError(`Error al cifrar: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    async decryptMessage() {
        const encryptedText = document.getElementById('encryptedMessage').value.trim();
        const book = document.getElementById('decryptBook').value;
        const chapter = document.getElementById('decryptChapter').value;
        const verse = document.getElementById('decryptVerse').value;
        
        if (!encryptedText) {
            this.showError('Por favor pega el texto cifrado');
            return;
        }
        
        if (!book || !chapter || !verse) {
            this.showError('Por favor selecciona el libro, capítulo y versículo usados para el cifrado');
            return;
        }
        
        this.showLoading();
        
        try {
            const reference = `${book}+${chapter}:${verse}`;
            const result = await this.cipher.decrypt(encryptedText, reference);
            
            document.getElementById('decryptedResult').innerHTML = 
                `<strong>Mensaje descifrado:</strong><br>${result.decrypted}<br><br>
                 <strong>Versículo usado:</strong> "${result.verseUsed}"`;
            this.showSuccess('Mensaje descifrado exitosamente!');
            
        } catch (error) {
            this.showError(`Error al descifrar: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = type === 'error' ? 'error' : 'success';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '1000';
        notification.style.padding = '15px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.bibleApp = new BibleApp();
});

// Funciones globales para los event listeners del HTML
function loadChapters() {
    window.bibleApp.loadChapters();
}

function loadVerses() {
    window.bibleApp.loadVerses();
}

function showSelectedVerse() {
    window.bibleApp.showSelectedVerse();
}

function encryptMessage() {
    window.bibleApp.encryptMessage();
}

function decryptMessage() {
    window.bibleApp.decryptMessage();
}

// Nueva función para sincronizar la selección automáticamente
function syncToDecrypt() {
    const book = document.getElementById('book').value;
    const chapter = document.getElementById('chapter').value;
    const verse = document.getElementById('verse').value;
    
    if (book) {
        document.getElementById('decryptBook').value = book;
        window.bibleApp.loadDecryptChapters(book);
    }
    
    if (chapter) {
        document.getElementById('decryptChapter').value = chapter;
        window.bibleApp.loadDecryptVerses(book, chapter);
    }
    
    if (verse) {
        document.getElementById('decryptVerse').value = verse;
    }
}