const apiKeyInput = document.getElementById('api-key');
const toggleKeyBtn = document.getElementById('toggle-key');
const aiTextarea = document.getElementById('ai-text');
const charCount = document.getElementById('char-count');
const humanizeBtn = document.getElementById('humanize-btn');
const clearBtn = document.getElementById('clear-btn');
const resultSection = document.getElementById('result-section');
const resultOutput = document.getElementById('result-output');
const copyBtn = document.getElementById('copy-btn');
const retryBtn = document.getElementById('retry-btn');
const feedbackText = document.getElementById('feedback-text');
const feedbackBtn = document.getElementById('feedback-btn');
const feedbackResponse = document.getElementById('feedback-response');
const toast = document.getElementById('toast');

// Load saved API key from localStorage
apiKeyInput.value = localStorage.getItem('groq_api_key') || '';

// Save API key when changed
apiKeyInput.addEventListener('change', () => {
    localStorage.setItem('groq_api_key', apiKeyInput.value.trim());
});

// Also save on input so programmatic changes persist
apiKeyInput.addEventListener('input', () => {
    localStorage.setItem('groq_api_key', apiKeyInput.value.trim());
});

// Toggle API key visibility
toggleKeyBtn.addEventListener('click', () => {
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleKeyBtn.textContent = 'Hide';
    } else {
        apiKeyInput.type = 'password';
        toggleKeyBtn.textContent = 'Show';
    }
});

// Character count
aiTextarea.addEventListener('input', () => {
    charCount.textContent = aiTextarea.value.length;
});

// Clear button
clearBtn.addEventListener('click', () => {
    aiTextarea.value = '';
    charCount.textContent = '0';
    resultSection.classList.add('hidden');
    aiTextarea.focus();
});

// Humanize button
humanizeBtn.addEventListener('click', () => humanizeText());
retryBtn.addEventListener('click', () => humanizeText());

async function humanizeText() {
    const text = aiTextarea.value.trim();
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        showToast('Please enter your Groq API key first.');
        apiKeyInput.focus();
        return;
    }

    if (!text) {
        showToast('Please enter some text first.');
        aiTextarea.focus();
        return;
    }

    // Show loading state
    humanizeBtn.disabled = true;
    retryBtn.disabled = true;
    humanizeBtn.innerHTML = '<span class="spinner"></span>Humanizing...';

    try {
        const humanized = await callGroqAPI(apiKey, text);
        resultOutput.textContent = humanized;
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
        resultOutput.textContent = 'Error: ' + (error.message || 'Something went wrong. Please try again.');
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } finally {
        humanizeBtn.disabled = false;
        retryBtn.disabled = false;
        humanizeBtn.textContent = 'Humanize';
    }
}

async function callGroqAPI(apiKey, text) {
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: `You are a text humanizer. Rewrite the user's AI-generated text to sound like it was written by a real person. Follow these rules strictly:

1. Use natural, conversational language — the way a human would actually write.
2. Replace formal or robotic phrases with casual equivalents.
3. Use contractions (don't, it's, we're, etc.).
4. Vary sentence length — mix short punchy sentences with longer ones.
5. Keep the original meaning, facts, and structure intact.
6. Do NOT add any commentary, explanations, or notes — just return the rewritten text.
7. Do NOT wrap the output in quotes or add a label like "Here's the rewritten text".`
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.9,
            max_tokens: 4096
        })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 401) throw new Error('Invalid API key. Please check your Groq key.');
        if (response.status === 429) throw new Error('Rate limit reached. Please wait a moment and try again.');
        throw new Error(err.error?.message || `API error (${response.status})`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    if (!result) throw new Error('No response from Groq. Please try again.');

    return result.trim();
}

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    const text = resultOutput.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard!');
    });
});

// Feedback submission
feedbackBtn.addEventListener('click', () => {
    const feedback = feedbackText.value.trim();
    if (!feedback) {
        showToast('Please enter your feedback first.');
        feedbackText.focus();
        return;
    }

    feedbackBtn.disabled = true;
    feedbackBtn.innerHTML = '<span class="spinner"></span>Submitting...';

    setTimeout(() => {
        feedbackResponse.textContent = `Thanks for your feedback! We've noted your request: "${feedback}". Our team will review and apply changes in the next update.`;
        feedbackResponse.classList.remove('hidden');
        feedbackBtn.disabled = false;
        feedbackBtn.textContent = 'Submit Feedback';
        feedbackText.value = '';
    }, 1000);
});

// Toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2500);
}
