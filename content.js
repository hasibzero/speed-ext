// content.js
// Supports YouTube (native control bar injection) and Facebook (overlay injection)

// --- Configuration ---
const YT_CONTAINER_CLASS = 'ytp-right-controls';
const YT_WRAPPER_ID = 'yt-speed-wrapper';

const FB_OVERLAY_CLASS = 'fb-speed-overlay';

const MIN_SPEED = 0.5;
const MAX_SPEED = 4.0;
const STEP = 0.25; 

// GLOBAL SPEED SETTING
// This ensures that when you scroll to a new video, it remembers your last choice.
let currentGlobalSpeed = 1.0; 

// --- Helper: Create UI Elements ---

function createSpeedSlider(onChange, initialValue) {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = MIN_SPEED;
    slider.max = MAX_SPEED;
    slider.step = STEP;
    slider.value = initialValue;
    slider.title = "Adjust Playback Speed";
    
    // Slider Styling
    slider.style.cssText = `
        width: 80px;
        height: 4px;
        background: #555;
        cursor: pointer;
        border-radius: 2px;
        appearance: none;
        -webkit-appearance: none;
        vertical-align: middle;
    `;
    
    // Inject Custom Style for Slider Thumb if not present
    const styleId = 'custom-slider-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 12px;
                height: 12px;
                background: #fff;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 2px rgba(0,0,0,0.5);
            }
        `;
        document.head.appendChild(style);
    }

    slider.addEventListener('input', onChange);
    slider.addEventListener('click', (e) => e.stopPropagation()); // Prevent pausing video on click
    slider.addEventListener('mousedown', (e) => e.stopPropagation()); // Stop drag event propagation
    return slider;
}

function createDisplay(initialValue) {
    const display = document.createElement('span');
    display.textContent = `${initialValue.toFixed(2)}x`;
    display.style.cssText = `
        color: white;
        font-size: 12px;
        font-weight: bold;
        margin-right: 8px;
        min-width: 35px;
        text-shadow: 0 0 2px black;
    `;
    return display;
}

// --- YouTube Logic (Inject into Control Bar) ---

function handleYouTube() {
    const controlsContainer = document.querySelector(`.${YT_CONTAINER_CLASS}`);
    const video = document.querySelector('video');

    if (controlsContainer && video && !document.getElementById(YT_WRAPPER_ID)) {
        const wrapper = document.createElement('div');
        wrapper.id = YT_WRAPPER_ID;
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginRight = '10px';

        const display = createDisplay(video.playbackRate);
        const slider = createSpeedSlider((e) => {
            const rate = parseFloat(e.target.value);
            video.playbackRate = rate;
            display.textContent = `${rate.toFixed(2)}x`;
        }, video.playbackRate);

        wrapper.appendChild(display);
        wrapper.appendChild(slider);
        
        controlsContainer.insertBefore(wrapper, controlsContainer.firstChild);

        // Sync if changed elsewhere
        video.addEventListener('ratechange', () => {
            slider.value = video.playbackRate;
            display.textContent = `${video.playbackRate.toFixed(2)}x`;
        });
    }
}

// --- Facebook Logic (Floating Overlay at Bottom-Right) ---

function handleFacebook() {
    // Find all video elements on the page
    const videos = document.querySelectorAll('video');

    videos.forEach((video) => {
        // Skip if already processed
        if (video.getAttribute('data-speed-controlled') === 'true') return;

        // Try to find a stable parent container for the overlay
        let parent = video.parentElement;
        while (parent && (parent.offsetWidth < 100 || parent.offsetHeight < 100)) {
            parent = parent.parentElement;
        }
        
        if (!parent) return;

        // 1. APPLY GLOBAL SPEED IMMEDIATELY TO NEW VIDEO
        video.playbackRate = currentGlobalSpeed;
        video.setAttribute('data-target-speed', currentGlobalSpeed);

        // Create the overlay container
        const overlay = document.createElement('div');
        overlay.className = FB_OVERLAY_CLASS;
        
        // Positioned at bottom-right
        overlay.style.cssText = `
            position: absolute;
            bottom: 60px;
            right: 12px;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.6);
            padding: 4px 8px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: auto;
        `;

        // Show overlay interactions
        parent.addEventListener('mouseenter', () => overlay.style.opacity = '1');
        parent.addEventListener('mouseleave', () => overlay.style.opacity = '0');
        overlay.addEventListener('mouseenter', () => overlay.style.opacity = '1');

        // Create UI with current global speed
        const display = createDisplay(currentGlobalSpeed);
        const slider = createSpeedSlider((e) => {
            const rate = parseFloat(e.target.value);
            
            // 2. UPDATE GLOBAL SPEED WHEN SLIDER MOVES
            currentGlobalSpeed = rate; 
            
            video.setAttribute('data-target-speed', rate);
            video.playbackRate = rate;
            display.textContent = `${rate.toFixed(2)}x`;
        }, currentGlobalSpeed);

        overlay.appendChild(display);
        overlay.appendChild(slider);

        // Fix parent positioning
        const parentStyle = getComputedStyle(parent);
        if (parentStyle.position === 'static') {
            parent.style.position = 'relative';
        }
        parent.appendChild(overlay);

        // Mark as processed
        video.setAttribute('data-speed-controlled', 'true');

        // --- ENFORCEMENT LOGIC ---
        // Forces the video to stick to the chosen speed if Facebook tries to reset it
        const enforceSpeed = () => {
            const target = parseFloat(video.getAttribute('data-target-speed'));
            if (!isNaN(target) && Math.abs(video.playbackRate - target) > 0.1) {
                video.playbackRate = target;
                
                // Keep UI in sync
                slider.value = target;
                display.textContent = `${target.toFixed(2)}x`;
            }
        };

        video.addEventListener('ratechange', enforceSpeed);
        video.addEventListener('play', enforceSpeed);
        video.addEventListener('seeking', enforceSpeed);
        video.addEventListener('seeked', enforceSpeed);
        
        // Apply once now to be sure
        enforceSpeed();
    });
}

// --- Main Execution ---

function init() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('youtube.com')) {
        setInterval(handleYouTube, 1000);
    } else if (hostname.includes('facebook.com')) {
        // Run slightly faster to catch new feed videos quickly
        setInterval(handleFacebook, 1000);
    }
}

init();