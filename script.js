// Loading Screen Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('loader-hidden');
    }, 1500); // 1.5s simulated loading time
});

document.addEventListener('DOMContentLoaded', () => {
    // Typing Effect
    const text = "Initializing Project Database...";
    const typingElement = document.getElementById('typing-text');
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            typingElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        } else {
            setTimeout(() => {
                typingElement.classList.add('blink-caret');
            }, 500);
        }
    }

    typeWriter();

    // Project Data (Easy to Add New Projects)
    const projects = [
        {
            title: "Cyber Security Dashboard",
            description: "Real-time threat monitoring interface with animated data visualization.",
            link: "#",
            image: null
        },
        {
            title: "Neon Commerce",
            description: "E-commerce platform featuring a dark mode aesthetic and seamless animations.",
            link: "#",
            image: null
        },
        {
            title: "AI Chat Interface",
            description: "Minimalist conversational UI powered by advanced language models.",
            link: "#",
            image: null
        },
        {
            title: "Portfolio v1",
            description: "Legacy portfolio archive. See how the design evolved over time.",
            link: "https://alexdevweb80.github.io/alexdevweb80-alexis-leroi-portfolio-cv.github.io/",
            image: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmtjZmh5eDIxYW1ldXppdm85bGxhbWY5YTE1eGkyZGN3bmhucDA2OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VVbHH3GYePZrEFBRNj/giphy.gif"
        },
        {
            title: "Crypto Tracker",
            description: "Live cryptocurrency price tracker with websocket integration.",
            link: "#",
            image: null
        },
        {
            title: "Task Master",
            description: "Productivity app with gamification elements and cyber rewards.",
            link: "#",
            image: null
        }
    ];

    const grid = document.getElementById('project-grid');

    // Generate Project Cards
    projects.forEach(project => {
        const card = document.createElement('div');
        card.classList.add('project-card');

        const imageContent = project.image
            ? `<img src="${project.image}" alt="${project.title}" class="card-img" />`
            : `<span style="color: var(--neon-blue); font-family: var(--font-primary);">[ IMG_PLACEHOLDER ]</span>`;

        card.innerHTML = `
            <div class="card-image">
                ${imageContent}
            </div>
            <div class="card-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <a href="${project.link}" class="card-btn">Access System</a>
            </div>
        `;

        grid.appendChild(card);
    });

    // 3D Tilt Effect on Hover
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Contact Form AJAX Submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // UI Feedback: Sending
            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = "TRANSMITTING...";
            submitBtn.disabled = true;
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            // Collect Data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Discord Webhook URL
                const webhookUrl = 'https://discordapp.com/api/webhooks/1474035966359507096/Ummuc7s5uJ39UhG4jPxft5bbyrXHBTIKA4VtK3pi3qnag4s9qRtAsSrr1XLz6EptF4B7';

                // Construct Discord Payload (Embed)
                const payload = {
                    username: "Nexus Contact Bot",
                    avatar_url: "https://i.imgur.com/4M34hi2.png", // Optional: Add a bot avatar
                    embeds: [
                        {
                            title: "📨 New Transmission Received",
                            color: 0x00ffcc, // Neon Blue/Green
                            fields: [
                                {
                                    name: "👤 Identifyer (Name)",
                                    value: data.name || "Unknown",
                                    inline: true
                                },
                                {
                                    name: "📧 Comms Link (Email)",
                                    value: data.email || "Unknown",
                                    inline: true
                                },
                                {
                                    name: "📝 Transmission Data (Message)",
                                    value: data.message || "No content provided."
                                }
                            ],
                            footer: {
                                text: "Secure System Notification • " + new Date().toLocaleString()
                            }
                        }
                    ]
                };

                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Discord API is happy with JSON
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok || response.status === 204) { // Success (Discord returns 204)
                    formStatus.textContent = "> TRANSMISSION SUCCESSFUL. LINK ESTABLISHED.";
                    formStatus.classList.add('status-success');
                    contactForm.className = 'cyber-form success';
                    contactForm.reset();
                } else { // Server Error
                    throw new Error(`Discord API Error: ${response.status} ${response.statusText}`);
                }

            } catch (error) {
                console.error('Error:', error);
                formStatus.textContent = "> ERROR: TRANSMISSION FAILED. " + error.message;
                formStatus.classList.add('status-error');
            } finally {
                // Reset Button
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
});
