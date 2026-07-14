class Utils {
  static distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }

  static randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  static lerp(a, b, t) {
    return a + (b - a) * t;
  }

  static getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static radToDeg(rad) {
    return rad * (180 / Math.PI);
  }

  static degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  static formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  static circleCollision(x1, y1, r1, x2, y2, r2) {
    const dist = this.distance(x1, y1, x2, y2);
    return dist < r1 + r2;
  }

  static rectangleCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }

  static isPointInCircle(px, py, cx, cy, r) {
    return this.distance(px, py, cx, cy) <= r;
  }

  static generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
