// ==UserScript==
// @name         Bandcamp Volume Bar
// @version      1.1.8
// @author       Redcrafter
// @description  Adds a volume bar to Bandcamp
// @license      Apache-2.0; http://www.apache.org/licenses/LICENSE-2.0.txt
// @match        *://*.bandcamp.com/*
// @namespace    https://github.com/Redcrafter
// ==/UserScript==

var gen = document.querySelector("meta[name=generator]");
if(!gen || gen.content != "Bandcamp") {
    return;
}

var style = document.createElement("style");
style.textContent = "$style";
document.head.appendChild(style);

var dragWidth = 226;
var dragging = false;
var dragPos = 0;
var percentage = parseFloat(localStorage.getItem("volume")) || 0.5;
var speaker, volumeInner, audio, volume;

function onLoad() {
    audio = document.getElementsByTagName("audio")[0];
    updateVolume();

    var container = document.createElement("div");
    container.classList.add("volumeControl");

    speaker = document.createElement("i");
    speaker.classList.add("speaker");
    speaker.addEventListener("click", function () {
        audio.muted = !audio.muted;
        updateHtml();
    });
    container.appendChild(speaker);

    var volume = document.createElement("div");
    volume.classList.add("progbar");
    container.appendChild(volume);

    var fill = document.createElement("div");
    fill.classList.add("progbar_empty");
    fill.style.width = "248px";
    volume.appendChild(fill);

    volumeInner = document.createElement("div");
    volumeInner.classList.add("thumb");
    
    volumeInner.addEventListener("mousedown", function (e) {
        dragging = true;
        dragPos = e.offsetX;
    });
    fill.appendChild(volumeInner);
    
    document.querySelector(".inline_player").appendChild(container);

    updateHtml();

    document.addEventListener("mouseup", function () {
        if (dragging) {
            localStorage.setItem("volume", percentage);
            dragging = false;
        }
    });
    document.addEventListener("mousemove", function (e) {
        if (dragging) {
            var pos = volume.getBoundingClientRect();

            audio.muted = false;
            percentage = clamp(((e.pageX - pos.left) - dragPos) / dragWidth, 0, 1);
            updateVolume();
            updateHtml();
        }
    });
}

if (document.readyState == 'complete') {
    onLoad();
} else {
    window.addEventListener("load", onLoad);
}

function updateVolume() {
    audio.volume = (Math.exp(percentage) - 1) / (Math.E - 1);
}

function updateHtml() {
    // svgs from https://www.material.io/resources/icons
    if (audio.muted) {
        speaker.innerHTML = '$volume_off';
        volumeInner.style.left = "0%";
    } else {
        if (percentage <= 0) {
            speaker.innerHTML = '$volume_mute';
        } else if (percentage < 0.5) {
            speaker.innerHTML = '$volume_down';
        } else {
            speaker.innerHTML = '$volume_up';
        }
        volumeInner.style.left = dragWidth * percentage + 'px';
    }
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}
