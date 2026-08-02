const optimizeBtn = document.getElementById('optimizeBtn');
const promptInput = document.getElementById('promptInput');
const terminalBody = document.getElementById('terminalBody');
const copyBtn = document.getElementById('copyBtn');
const demoError = document.getElementById('demoError');

const toneDescriptors = {
    Professional: 'clear, polished, and businesslike',
    Casual: 'relaxed, conversational, and approachable',
    Persuasive: 'compelling, confident, and benefit-driven',
};

const roleFraming = {
    'Expert Consultant': 'a seasoned expert consultant with deep industry experience',
    'Copywriter': 'a professional copywriter skilled at persuasive, engaging writing',
    'Software Engineer': 'a senior software engineer who writes precise, technical explanations',
    'Data Analyst': 'a data analyst who backs up points with structure and clarity',
    'Teacher': 'a patient teacher who explains things simply and step by step',
};

function buildOptimizedPrompt(rawPrompt, tone, role) {
    const toneDesc = toneDescriptors[tone] || tone.toLowerCase();
    const roleDesc = roleFraming[role] || role;

    return `Act as ${roleDesc}.

Task: ${rawPrompt.trim()}

Write your response in a ${toneDesc} tone. Be specific and concrete rather than generic — include real examples, numbers, or details where relevant. Structure the response clearly (short paragraphs or bullet points), and if any important detail is missing from the task above, briefly state your assumption before proceeding.`;
}

optimizeBtn.addEventListener('click', () => {
    const rawPrompt = promptInput.value.trim();
    demoError.textContent = '';

    if (!rawPrompt) {
        demoError.textContent = 'Type a prompt first.';
        return;
    }

    const tone = document.getElementById('toneSelect').value;
    const role = document.getElementById('roleSelect').value;

    optimizeBtn.disabled = true;
    optimizeBtn.textContent = 'Optimizing...';
    copyBtn.hidden = true;
    terminalBody.textContent = 'Optimizing...';

    setTimeout(() => {
        const optimizedPrompt = buildOptimizedPrompt(rawPrompt, tone, role);
        terminalBody.textContent = optimizedPrompt;
        copyBtn.hidden = false;
        optimizeBtn.disabled = false;
        optimizeBtn.textContent = 'Optimize Prompt';
    }, 500);
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(terminalBody.textContent);
    copyBtn.textContent = 'Copied ✓';
    setTimeout(() => { copyBtn.textContent = 'Copy to Clipboard'; }, 1500);
});
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mzdnlago";

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMessage').value.trim();

    document.getElementById('err-name').textContent = '';
    document.getElementById('err-email').textContent = '';
    document.getElementById('err-message').textContent = '';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    let valid = true;

    if (!name) {
        document.getElementById('err-name').textContent = 'Please enter your name.';
        valid = false;
    }
    if (!email) {
        document.getElementById('err-email').textContent = 'Please enter your email.';
        valid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById('err-email').textContent = 'That email doesn\'t look right.';
        valid = false;
    }
    if (!message) {
        document.getElementById('err-message').textContent = 'Please enter a message.';
        valid = false;
    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name, email, message }),
        });

        if (res.ok) {
            formStatus.textContent = '✓ Message sent — thanks for reaching out!';
            formStatus.className = 'form-status success';
            contactForm.reset();
        } else {
            formStatus.textContent = '✗ Something went wrong. Try again.';
            formStatus.className = 'form-status error';
        }
    } catch (err) {
        formStatus.textContent = '✗ Network error. Check your connection.';
        formStatus.className = 'form-status error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});