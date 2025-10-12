// js/markdown.js
// BonziWORLD Refoundation — Markdown + Animated Rainbow (v1.6.2)
// Supports **bold**, ~~italic~~, __underline__, --strike--, ^^big^^, $r$rainbow$r$,
// ||spoiler||, `code`, ++secret++, ==admin==

// Inject rainbow CSS once
(function injectRainbowCSS() {
  if (document.getElementById("rainbow-style")) return;
  const css = `
    @keyframes rainbowColorCycle {
      0% { color: hsl(0, 100%, 60%); }
      20% { color: hsl(60, 100%, 60%); }
      40% { color: hsl(120, 100%, 60%); }
      60% { color: hsl(180, 100%, 60%); }
      80% { color: hsl(240, 100%, 60%); }
      100% { color: hsl(300, 100%, 60%); }
    }
    .rainbow-text {
      animation: rainbowColorCycle 3s linear infinite;
      font-weight: bold;
    }
  `;
  const style = document.createElement("style");
  style.id = "rainbow-style";
  style.textContent = css;
  document.head.appendChild(style);
})();

function bonziMarkdown(text) {
  if (!text) return "";

  // Escape HTML to prevent XSS
  text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Markdown patterns
  const replacements = [
    { regex: /\*\*(.*?)\*\*/g, replace: "<b>$1</b>" }, // Bold
    { regex: /~~(.*?)~~/g, replace: "<i>$1</i>" }, // Italic
    { regex: /__(.*?)__/g, replace: "<u>$1</u>" }, // Underline
    { regex: /--(.*?)--/g, replace: "<s>$1</s>" }, // Strikethrough
    { regex: /\^\^(.*?)\^\^/g, replace: '<span style="font-size:1.5em">$1</span>' }, // Big
    {
      regex: /\|\|(.*?)\|\|/g,
      replace:
        '<span style="background:#444;color:#444;border-radius:3px;padding:0 3px" onmouseover="this.style.color=\'#fff\'" onmouseout="this.style.color=\'#444\'">$1</span>',
    }, // Spoiler
    {
      regex: /`([^`]+)`/g,
      replace:
        '<code style="background:#222;padding:2px 4px;border-radius:3px;color:#0f0;font-family:monospace">$1</code>',
    }, // Code
    {
      regex: /\+\+(.*?)\+\+/g,
      replace:
        '<span style="filter:blur(2px);transition:filter 0.2s" onmouseover="this.style.filter=\'blur(0px)\'" onmouseout="this.style.filter=\'blur(2px)\'">$1</span>',
    }, // Secret
    {
      regex: /==(.*?)==/g,
      replace:
        '<span style="color:#ff4444;font-weight:bold">[ADMIN] $1</span>',
    }, // Admin highlight
  ];

  // Apply all replacements
  for (const { regex, replace } of replacements) {
    text = text.replace(regex, replace);
  }

  // Rainbow (animated)
  text = text.replace(/\$r\$(.*?)\$r\$/g, (_, content) => {
    const uniqueId = "rainbow-" + Math.random().toString(36).substr(2, 9);
    requestAnimationFrame(() => jsAnimateRainbow(uniqueId));
    return `<span class="rainbow-text" id="${uniqueId}">${content}</span>`;
  });

  return text;
}

// JS enhancement — smoothly cycles hue for each rainbow span
function jsAnimateRainbow(id) {
  const el = document.getElementById(id);
  if (!el) return;
  let hue = 0;
  setInterval(() => {
    hue = (hue + 5) % 360;
    el.style.color = `hsl(${hue}, 100%, 60%)`;
  }, 80);
}
