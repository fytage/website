for(const text of document.querySelectorAll(".modal-action-text")) {
  const letters = text.textContent.split("");
  
  text.innerHTML = "";  
  
  letters.forEach((letter, index) => {
    const span = document.createElement("span");
    
    span.className = "modal-action-text-letter";
    
    span.style.animationDelay = `${index * 300}ms`;
    span.style.animationDuration = `${(letters.length * 300) + 1000}ms`;
    
    span.innerHTML = letter;
    
    text.appendChild(span);
  });
}

/* --- Magic mouse effect --- */

let start = new Date().getTime();

const originPosition = { x: 0, y: 0 };

const container = document.getElementById("magic-mouse-container"),
      cursor = document.getElementById("cursor");

const last = {
  starTimestamp: start,
  starPosition: originPosition,
  mousePosition: originPosition
}

const config = {
  starAnimationDuration: 1500,
  minimumTimeBetweenStars: 250,
  minimumDistanceBetweenStars: 75,
  glowDuration: 75,
  maximumGlowPointSpacing: 10,
  colors: ["245 245 245", "59 130 246"],
  sizes: ["1.4rem", "1rem", "0.6rem"],
  animations: ["fall-1", "fall-2", "fall-3"]
}

let count = 0;
  
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
      selectRandom = items => items[rand(0, items.length - 1)];

const withUnit = (value, unit) => `${value}${unit}`,
      px = value => withUnit(value, "px"),
      ms = value => withUnit(value, "ms");

const calcDistance = (a, b) => {
  const diffX = b.x - a.x,
        diffY = b.y - a.y;
  
  return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
}

const calcElapsedTime = (start, end) => end - start;

const appendElement = element => container.appendChild(element),
      removeElement = (element, delay) => setTimeout(() => container.removeChild(element), delay);

const pastelColors = [
  'rgb(255, 218, 185)',   // Peach
  'rgb(173, 216, 230)',   // Light Blue
  'rgb(240, 230, 140)',   // Khaki
  'rgb(221, 160, 221)',   // Lavender
  'rgb(144, 238, 144)',   // Light Green
  'rgb(255, 192, 203)'    // Pink
];

const createStar = position => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        path = document.createElementNS("http://www.w3.org/2000/svg", "path"),
        pastelColor = selectRandom(pastelColors);

  path.setAttribute("d", "M7.94838 0.778719C7.86415 0.60805 7.69034 0.5 7.50001 0.5C7.30969 0.5 7.13587 0.60805 7.05165 0.778719L5.00476 4.92621L0.42816 5.59081C0.239806 5.61816 0.0833166 5.75008 0.0244934 5.93109C-0.0343298 6.1121 0.0147161 6.31081 0.151008 6.44366L3.46277 9.67185L2.68076 14.2306C2.64858 14.4182 2.72569 14.6078 2.87966 14.7196C3.03364 14.8315 3.23778 14.8463 3.40624 14.7577L7.50001 12.6054L11.5938 14.7577C11.7623 14.8463 11.9664 14.8315 12.1204 14.7196C12.2743 14.6078 12.3515 14.4182 12.3193 14.2306L11.5373 9.67185L14.849 6.44366C14.9853 6.31081 15.0344 6.1121 14.9755 5.93109C14.9167 5.75008 14.7602 5.61816 14.5719 5.59081L9.99527 4.92621L7.94838 0.778719Z");
  path.style.fill = pastelColor;

  svg.setAttribute("width", "15");
  svg.setAttribute("height", "15");
  svg.setAttribute("viewBox", "0 0 15 15");
  svg.appendChild(path);

  svg.style.position = 'absolute';
  svg.style.left = px(position.x);
  svg.style.top = px(position.y);
  svg.style.filter = `drop-shadow(0px 0px 1.5rem rgba(${pastelColor}, 0.5))`; // Mimics textShadow effect

  svg.style.animationName = config.animations[count++ % 3];
  svg.style.animationDuration = ms(config.starAnimationDuration);

  appendElement(svg);

  removeElement(svg, config.starAnimationDuration);
}



const createGlowPoint = position => {
  const glow = document.createElement("div");
  
  glow.className = "glow-point";
  
  glow.style.left = px(position.x);
  glow.style.top = px(position.y);
  
  appendElement(glow)
  
  removeElement(glow, config.glowDuration);
}

const determinePointQuantity = distance => Math.max(
  Math.floor(distance / config.maximumGlowPointSpacing),
  1
);

const createGlow = (last, current) => {
  const distance = calcDistance(last, current),
        quantity = determinePointQuantity(distance);
  
  const dx = (current.x - last.x) / quantity,
        dy = (current.y - last.y) / quantity;
  
  Array.from(Array(quantity)).forEach((_, index) => { 
    const x = last.x + dx * index, 
          y = last.y + dy * index;
    
    createGlowPoint({ x, y });
  });
}

const updateLastStar = position => {
  last.starTimestamp = new Date().getTime();

  last.starPosition = position;
}

const updateLastMousePosition = position => last.mousePosition = position;

const adjustLastMousePosition = position => {
  if(last.mousePosition.x === 0 && last.mousePosition.y === 0) {
    last.mousePosition = position;
  }
};

const moveCursor = e => {  
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
}

const handleOnMove = e => {
  const mousePosition = { x: e.clientX, y: e.clientY }
  
  moveCursor(e);
  
  adjustLastMousePosition(mousePosition);
  
  const now = new Date().getTime(),
        hasMovedFarEnough = calcDistance(last.starPosition, mousePosition) >= config.minimumDistanceBetweenStars,
        hasBeenLongEnough = calcElapsedTime(last.starTimestamp, now) > config.minimumTimeBetweenStars;
  
  if(hasMovedFarEnough || hasBeenLongEnough) {
    createStar(mousePosition);
    
    updateLastStar(mousePosition);
  }
  
  createGlow(last.mousePosition, mousePosition);
  
  updateLastMousePosition(mousePosition);
}

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);

document.body.onmouseleave = () => updateLastMousePosition(originPosition);

const createClickEffect = (position) => {
  const clickEffect = document.createElement("div");

  clickEffect.className = "click-effect";
  clickEffect.style.left = px(position.x - 10); // Adjust to center the effect
  clickEffect.style.top = px(position.y - 10);  // Adjust to center the effect
  
  appendElement(clickEffect);

  removeElement(clickEffect, 500); // Match duration with animation duration
};

const handleOnClick = (e) => {
  const clickPosition = { x: e.clientX, y: e.clientY };
  createClickEffect(clickPosition);
};

window.onclick = (e) => handleOnClick(e);
window.ontouchend = (e) => handleOnClick(e.touches[0]); // For touch devices

document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.modal-action');

  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const url = this.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank'); // Open URL in a new tab
        // Alternatively, you can navigate to the URL in the same tab:
        // window.location.href = url;
      }
    });
  });
});

