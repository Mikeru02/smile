export default function timeToSeconds(time) {
    const [h, m, s] = time.split(':').map(Number);
    return h * 3600 + m * 60 + s;
}