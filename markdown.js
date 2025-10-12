// BonziWORLD Markdown System v1.6.2
// Supports: Bold, Italics, Underline, Strikethrough, Big Text, Rainbow, Spoiler, Code

class BonziMarkdown {
    constructor() {
        this.patterns = [
            // Rainbow text: $r$text$r$
            {
                regex: /\$r\$(.*?)\$r\$/g,
                replacement: '<span class="rainbow">$1</span>'
            },
            // Bold: **text**
            {
                regex: /\*\*(.*?)\*\*/g,
                replacement: '<strong>$1</strong>'
            },
            // Italics: ~~text~~
            {
                regex: /~~(.*?)~~/g,
                replacement: '<em>$1</em>'
            },
            // Underline: __text__
            {
                regex: /__(.*?)__/g,
                replacement: '<u>$1</u>'
            },
            // Strikethrough: --text--
            {
                regex: /--(.*?)--/g,
                replacement: '<s>$1</s>'
            },
            // Big text: ^^text^^
            {
                regex: /\^\^(.*?)\^\^/g,
                replacement: '<span class="big-text">$1</span>'
            },
            // Spoiler: ||text||
            {
                regex: /\|\|(.*?)\|\|/g,
                replacement: '<span class="spoiler" onclick="this.classList.toggle(\'revealed\')">$1</span>'
            },
            // Code: ``code``
            {
                regex: /``(.*?)``/g,
                replacement: '<code>$1</code>'
            }
        ];
    }

    // Parse markdown text and return HTML
    parse(text) {
        if (!text || typeof text !== 'string') return text;
        
        let parsed = this.escapeHtml(text);
        
        // Apply each markdown pattern
        this.patterns.forEach(pattern => {
            parsed = parsed.replace(pattern.regex, pattern.replacement);
        });
        
        return parsed;
    }

    // Escape HTML to prevent XSS attacks
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize rainbow animation
    initRainbow() {
        const style = document.createElement('style');
        style.textContent = `
            .rainbow {
                background: linear-gradient(
                    90deg,
                    #ff0000,
                    #ff7f00,
                    #ffff00,
                    #00ff00,
                    #0000ff,
                    #4b0082,
                    #9400d3
                );
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: rainbow-slide 3s linear infinite;
                font-weight: bold;
            }

            @keyframes rainbow-slide {
                0% { background-position: 0% center; }
                100% { background-position: 200% center; }
            }

            .big-text {
                font-size: 1.5em;
                font-weight: bold;
            }

            .spoiler {
                background: #2c2c2c;
                color: transparent;
                cursor: pointer;
                padding: 2px 4px;
                border-radius: 3px;
                transition: all 0.3s ease;
                user-select: none;
            }

            .spoiler:hover {
                background: #3c3c3c;
            }

            .spoiler.revealed {
                background: transparent;
                color: inherit;
            }

            code {
                background: #f4f4f4;
                color: #333;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
            }
        `;
        document.head.appendChild(style);
    }
}

// Create global instance
const bonziMarkdown = new BonziMarkdown();

// Initialize on page load
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            bonziMarkdown.initRainbow();
        });
    } else {
        bonziMarkdown.initRainbow();
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BonziMarkdown;
}
