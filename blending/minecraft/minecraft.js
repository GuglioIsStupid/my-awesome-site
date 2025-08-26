async function init() {
    // if((/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && !window.MSStream) {
    //     document.body.innerHTML = "<h1>iPhones are not supported</h1>";
    //     return;
    // }

    // When using the UI, the player is made automatically by the UI object.

    const m3u8 = "https://cdn.canadaploos.ca/cdn/aminecraftmovie/playlist.m3u8";
    const vtt = null;

    const video = document.getElementById('video');
    const ui = video['ui'];
    const controls = ui.getControls();
    const player = controls.getPlayer();

    const playerConfig = {
        streaming: {
            startAtSegmentBoundary: false,
        },
        manifest: {
            dash: {
                ignoreSuggestedPresentationDelay: true,
                ignoreMinBufferTime: true,
            },
            defaultPresentationDelay: 8,
        },
    }

    player.configure(playerConfig);

    ui.configure({
        "controlPanelElements": [
            "play_pause",
            "reload",
            "time_and_duration",
            "spacer",
            "mute",
            "volume",
            "fullscreen",
            "captions",
            "language",
            "overflow_menu",
        ],
        "overflowMenuButtons": [
            "quality",
            "picture_in_picture",
            "cast",
        ],
        "trackLabelFormat": 3,
        "textTrackLabelFormat": 3,
    });

    // Attach player and ui to the window to make it easy to access in the JS console.
    window.player = player;
    window.ui = ui;
    window.controls = controls;
    window.video = video;

    // Listen for error events.
    player.addEventListener('error', onPlayerErrorEvent);
    controls.addEventListener('error', onUIErrorEvent);

    video.addEventListener("loadeddata", (event) => {
        const stats = player.getStats();
        event.target.parentElement.style.aspectRatio = `${stats.width} / ${stats.height}`;    
    }, { once: true });
    
    play(m3u8, vtt);

}

function onPlayerErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    onPlayerError(event.detail);
}

function onPlayerError(error) {
    // Handle player error
    console.error('Error code', error.code, 'object', error);
}

function onUIErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    onPlayerError(event.detail);
}

function initFailed() {
    // Handle the failure to load
    console.error('Unable to load the UI library!');
}

// Listen to the custom shaka-ui-loaded event, to wait until the UI is loaded.
document.addEventListener('shaka-ui-loaded', init);
// Listen to the custom shaka-ui-load-failed event, in case Shaka Player fails
// to load (e.g. due to lack of browser support).
document.addEventListener('shaka-ui-load-failed', initFailed);

function onPlayerErrorEvent(event) {
// Extract the shaka.util.Error object from the event.
onPlayerError(event.detail);
}

function onPlayerError(error) {
// Handle player error
console.error('Error code', error.code, 'object', error);
}

function onUIErrorEvent(event) {
// Extract the shaka.util.Error object from the event.
onPlayerError(event.detail);
}

function initFailed(errorEvent) {
// Handle the failure to load; errorEvent.detail.reasonCode has a
// shaka.ui.FailReasonCode describing why.
console.error('Unable to load the UI library!');
}

async function play(url, vtt) {
    Mousetrap.bind('up', volumeUp);
    Mousetrap.bind('down', volumeDown);
    Mousetrap.bind('left', seekLeft);
    Mousetrap.bind('right', seekRight);
    Mousetrap.bind('space', playPause);
    Mousetrap.bind('m', toggleMute);
    Mousetrap.bind('c', toggleSubs);

    // Try to load a manifest.
    // This is an asynchronous process.
    try {
        await player.load(url);
        // This runs if the asynchronous load is successful.
        console.log('The video has now been loaded!');
        if(vtt) {
            player.addTextTrackAsync(vtt, 'en', 'subtitles');
        }
    } catch (error) {
        onPlayerError(error);
    }

    video.play();    
}

function playPause() {
    video.paused ? video.play() : video.pause();
}

function volumeUp() {
    if (video.volume <= 0.9) video.volume += 0.1;
}

function volumeDown() {
    if (video.volume >= 0.1) video.volume -= 0.1;
}

function seekRight() {
    video.currentTime += 10;
}

function seekLeft() {
    video.currentTime -= 10;
}

function toggleMute() {
    video.muted = !video.muted;
}

function toggleSubs() {
    player.setTextTrackVisibility(!player.isTextTrackVisible());
}