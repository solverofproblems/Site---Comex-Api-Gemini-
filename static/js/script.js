// Configurações do chatbot
const GOOGLE_GEMINI_API_KEY = "AIzaSyAj64eDz0VvQQLxLFGsIEqJZzPzrJ-KcPw";

// Elementos do DOM
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendMessage');
const typingIndicator = document.getElementById('typingIndicator');
const clearChatBtn = document.getElementById('clearChat');
const exportChatBtn = document.getElementById('exportChat');

// Estado do chat
let chatHistory = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    setupNavigation();
});

// Configurar event listeners
function setupEventListeners() {
    // Enviar mensagem com Enter
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Enviar mensagem com botão
    sendButton.addEventListener('click', sendMessage);

    // Limpar chat
    clearChatBtn.addEventListener('click', clearChat);

    // Exportar chat
    exportChatBtn.addEventListener('click', exportChat);

    // Focar no input quando a página carrega
    userInput.focus();
}

// Configurar navegação suave
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Scroll suave para a seção
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função principal para enviar mensagem
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Adicionar mensagem do usuário
    addMessage(message, 'user');
    
    // Limpar input
    userInput.value = '';
    
    // Mostrar indicador de digitação
    showTypingIndicator();
    
    try {
        // Fazer requisição para o backend Python
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                api_key: GOOGLE_GEMINI_API_KEY
            })
        });
        
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        
        const data = await response.json();
        
        // Esconder indicador de digitação
        hideTypingIndicator();
        
        // Adicionar resposta do bot
        addMessage(data.response, 'bot');
        
    } catch (error) {
        console.error('Erro:', error);
        hideTypingIndicator();
        
        // Mensagem de erro amigável
        addMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.', 'bot');
    }
}

// Adicionar mensagem ao chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    const icon = document.createElement('i');
    icon.className = sender === 'bot' ? 'fas fa-robot' : 'fas fa-user';
    avatar.appendChild(icon);
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    content.appendChild(paragraph);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    
    // Adicionar ao histórico
    chatHistory.push({
        sender: sender,
        text: text,
        timestamp: new Date().toISOString()
    });
    
    // Scroll para a última mensagem
    scrollToBottom();
}

// Mostrar indicador de digitação
function showTypingIndicator() {
    typingIndicator.style.display = 'flex';
    scrollToBottom();
}

// Esconder indicador de digitação
function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// Scroll para o final do chat
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Limpar chat
function clearChat() {
    if (confirm('Tem certeza que deseja limpar todo o histórico do chat?')) {
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>Olá! Sou o TradeBot Pro, seu assistente especializado em Comércio Exterior. Como posso ajudá-lo hoje?</p>
                </div>
            </div>
        `;
        chatHistory = [];
    }
}

// Exportar chat
function exportChat() {
    if (chatHistory.length === 0) {
        alert('Não há mensagens para exportar.');
        return;
    }
    
    const chatText = chatHistory.map(msg => {
        const time = new Date(msg.timestamp).toLocaleString('pt-BR');
        const sender = msg.sender === 'bot' ? 'TradeBot Pro' : 'Você';
        return `[${time}] ${sender}: ${msg.text}`;
    }).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradebot-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Detectar scroll para mostrar/esconder header
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > lastScrollTop && currentScroll > 100) {
        // Scroll para baixo
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scroll para cima
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = currentScroll;
});

// Animações de entrada
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.about-card, .feature');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Efeito de partículas no background (opcional)
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--primary-green);
            border-radius: 50%;
            opacity: 0.3;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        hero.appendChild(particle);
    }
}

// Adicionar CSS para partículas
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
        }
        50% {
            opacity: 0.6;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Inicializar partículas
document.addEventListener('DOMContentLoaded', createParticles); 