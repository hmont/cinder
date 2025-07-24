export function formatTime(seconds) {
    let s = (seconds % 60);

    return `${Math.floor(seconds / 60)}:${s < 10 ? `0${s}` : s}`;
}