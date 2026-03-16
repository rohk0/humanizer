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

function humanizeText() {
    const text = aiTextarea.value.trim();
    if (!text) {
        showToast('Please enter some text first.');
        aiTextarea.focus();
        return;
    }

    // Show loading state
    humanizeBtn.disabled = true;
    humanizeBtn.innerHTML = '<span class="spinner"></span>Humanizing...';

    // Simulate processing delay
    setTimeout(() => {
        const humanized = applyHumanization(text);
        resultOutput.textContent = humanized;
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Reset button
        humanizeBtn.disabled = false;
        humanizeBtn.textContent = 'Humanize';
    }, 1200 + Math.random() * 800);
}

// Core humanization logic
function applyHumanization(text) {
    let result = text;

    // Replace common AI phrases with more natural alternatives
    const replacements = [
        [/\bIt is important to note that\b/gi, 'Worth noting,'],
        [/\bIt's important to note that\b/gi, 'Worth noting,'],
        [/\bIt is worth mentioning that\b/gi, 'Also,'],
        [/\bIn today's world\b/gi, 'These days'],
        [/\bIn today's digital age\b/gi, 'Nowadays'],
        [/\bIn the realm of\b/gi, 'In'],
        [/\bIn conclusion\b/gi, 'All in all'],
        [/\bFurthermore\b/gi, 'Plus'],
        [/\bMoreover\b/gi, 'On top of that'],
        [/\bAdditionally\b/gi, 'Also'],
        [/\bConsequently\b/gi, 'So'],
        [/\bNevertheless\b/gi, 'Still'],
        [/\bSubsequently\b/gi, 'Then'],
        [/\bUtilize\b/gi, 'use'],
        [/\butilize\b/g, 'use'],
        [/\bUtilization\b/gi, 'use'],
        [/\bLeverage\b/gi, 'Use'],
        [/\bleverage\b/g, 'use'],
        [/\bFacilitate\b/gi, 'Help with'],
        [/\bfacilitate\b/g, 'help with'],
        [/\bEnhance\b/gi, 'Improve'],
        [/\benhance\b/g, 'improve'],
        [/\bOptimize\b/gi, 'Improve'],
        [/\boptimize\b/g, 'improve'],
        [/\bImplement\b/gi, 'Set up'],
        [/\bimplement\b/g, 'set up'],
        [/\bDelve into\b/gi, 'Look into'],
        [/\bdelve into\b/g, 'look into'],
        [/\bDelve\b/gi, 'Dig'],
        [/\bdelve\b/g, 'dig'],
        [/\bPlethora of\b/gi, 'Lots of'],
        [/\bplethora of\b/g, 'lots of'],
        [/\bA myriad of\b/gi, 'Many'],
        [/\ba myriad of\b/g, 'many'],
        [/\bMyriad\b/gi, 'Many'],
        [/\bEnsure\b/gi, 'Make sure'],
        [/\bensure\b/g, 'make sure'],
        [/\bCommence\b/gi, 'Start'],
        [/\bcommence\b/g, 'start'],
        [/\bTerminate\b/gi, 'End'],
        [/\bterminate\b/g, 'end'],
        [/\bPrior to\b/gi, 'Before'],
        [/\bprior to\b/g, 'before'],
        [/\bSubsequent to\b/gi, 'After'],
        [/\bIn order to\b/gi, 'To'],
        [/\bin order to\b/g, 'to'],
        [/\bDue to the fact that\b/gi, 'Because'],
        [/\bdue to the fact that\b/g, 'because'],
        [/\bAt the end of the day\b/gi, 'Ultimately'],
        [/\bIt goes without saying\b/gi, 'Obviously'],
        [/\bAs a matter of fact\b/gi, 'In fact'],
        [/\bFor the purpose of\b/gi, 'For'],
        [/\bfor the purpose of\b/g, 'for'],
        [/\bIn the event that\b/gi, 'If'],
        [/\bin the event that\b/g, 'if'],
        [/\bWith regard to\b/gi, 'About'],
        [/\bwith regard to\b/g, 'about'],
        [/\bWith respect to\b/gi, 'About'],
        [/\bTake into consideration\b/gi, 'Consider'],
        [/\bIt is essential to\b/gi, 'You need to'],
        [/\bIt is crucial to\b/gi, 'You really need to'],
        [/\bPlays a pivotal role\b/gi, 'matters a lot'],
        [/\bplays a pivotal role\b/g, 'matters a lot'],
        [/\bPlays a crucial role\b/gi, 'is really important'],
        [/\bplays a crucial role\b/g, 'is really important'],
        [/\bVast array of\b/gi, 'Wide range of'],
        [/\bvast array of\b/g, 'wide range of'],
        [/\bSeamlessly\b/gi, 'Smoothly'],
        [/\bseamlessly\b/g, 'smoothly'],
        [/\bRobust\b/gi, 'Strong'],
        [/\brobust\b/g, 'strong'],
        [/\bCutting-edge\b/gi, 'Latest'],
        [/\bcutting-edge\b/g, 'latest'],
        [/\bState-of-the-art\b/gi, 'Modern'],
        [/\bstate-of-the-art\b/g, 'modern'],
        [/\bGamechanger\b/gi, 'Big deal'],
        [/\bGame-changer\b/gi, 'Big deal'],
        [/\bParadigm shift\b/gi, 'Big change'],
        [/\bSynergy\b/gi, 'Teamwork'],
        [/\bsynergy\b/g, 'teamwork'],
        [/\bHolistic\b/gi, 'Overall'],
        [/\bholistic\b/g, 'overall'],
    ];

    for (const [pattern, replacement] of replacements) {
        result = result.replace(pattern, replacement);
    }

    // Break up overly long sentences (split at conjunctions if sentence > 200 chars)
    result = result.replace(/([^.!?]{200,?})(, (?:and|but|which|where|while) )/g, '$1. ');

    // Add slight variation: occasionally shorten "do not" to "don't", etc.
    const contractions = [
        [/\bdo not\b/g, "don't"],
        [/\bDo not\b/g, "Don't"],
        [/\bcannot\b/g, "can't"],
        [/\bCannot\b/g, "Can't"],
        [/\bwill not\b/g, "won't"],
        [/\bWill not\b/g, "Won't"],
        [/\bshould not\b/g, "shouldn't"],
        [/\bShould not\b/g, "Shouldn't"],
        [/\bwould not\b/g, "wouldn't"],
        [/\bWould not\b/g, "Wouldn't"],
        [/\bcould not\b/g, "couldn't"],
        [/\bCould not\b/g, "Couldn't"],
        [/\bit is\b/g, "it's"],
        [/\bIt is\b/g, "It's"],
        [/\bthat is\b/g, "that's"],
        [/\bThat is\b/g, "That's"],
        [/\bthey are\b/g, "they're"],
        [/\bThey are\b/g, "They're"],
        [/\bwe are\b/g, "we're"],
        [/\bWe are\b/g, "We're"],
        [/\byou are\b/g, "you're"],
        [/\bYou are\b/g, "You're"],
        [/\bI am\b/g, "I'm"],
        [/\bI have\b/g, "I've"],
    ];

    for (const [pattern, replacement] of contractions) {
        result = result.replace(pattern, replacement);
    }

    // Remove excessive exclamation marks
    result = result.replace(/!{2,}/g, '!');

    // Trim double spaces
    result = result.replace(/ {2,}/g, ' ');

    return result;
}

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    const text = resultOutput.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(() => {
        // Fallback
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
