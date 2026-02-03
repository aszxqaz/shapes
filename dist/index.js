let DEFAULT_EPSILON = 0.01;
export function setEpsilon(value) {
    DEFAULT_EPSILON = value;
}
export class Point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distanceTo(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) +
            Math.pow(this.y - other.y, 2));
    }
}
export class Segment {
    a;
    b;
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
    contains(p, epsilon = DEFAULT_EPSILON) {
        return Math.abs(this.a.distanceTo(p) + this.b.distanceTo(p) -
            this.a.distanceTo(this.b)) < epsilon;
    }
    get length() {
        return this.a.distanceTo(this.b);
    }
}
export class SegmentedShape {
    points;
    segments;
    constructor(p1, p2, p3, ...restPoints) {
        this.points = [p1, p2, p3, ...restPoints];
        this.segments = this.points.map((p, i, pts) => new Segment(p, i == pts.length - 1 ? pts[0] : pts[i + 1]));
    }
    intersects(point, epsilon = DEFAULT_EPSILON) {
        return this.segments.some((segment) => segment.contains(point, epsilon));
    }
    contains(point) {
        let hit = false;
        for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            if (((this.points[i].y > point.y) !=
                (this.points[j].y > point.y)) &&
                (point.x <
                    (this.points[j].x - this.points[i].x) *
                        (point.y - this.points[i].y) /
                        (this.points[j].y - this.points[i].y) +
                        this.points[i].x))
                hit = !hit;
        }
        return hit;
    }
    safeAt(items, index) {
        if (index >= items.length) {
            throw new RangeError(`out of range access`);
        }
        return items[index];
    }
    pointAt(index) {
        return this.safeAt(this.points, index);
    }
    segmentAt(index) {
        return this.safeAt(this.segments, index);
    }
    get area() {
        return Math.abs(this.points.reduce((acc, p, index, pts) => {
            const p2 = index == pts.length - 1 ? pts[0] : pts[index + 1];
            return acc + (p.x * p2.y - p.y * p2.x) / 2;
        }, 0));
    }
    get perimeter() {
        return this.points.reduce((acc, p, i, pts) => {
            const p2 = i == pts.length - 1 ? pts[0] : pts[i + 1];
            return acc + p.distanceTo(p2);
        }, 0);
    }
}
export class RectangleShape extends SegmentedShape {
    constructor(topLeft, bottomRight) {
        super(topLeft, new Point(bottomRight.x, topLeft.y), bottomRight, new Point(topLeft.x, bottomRight.y));
    }
    get topLeft() {
        return this.pointAt(0);
    }
    get topRight() {
        return this.pointAt(1);
    }
    get bottomRight() {
        return this.pointAt(2);
    }
    get bottomLeft() {
        return this.pointAt(3);
    }
    get width() {
        return this.bottomRight.x - this.topLeft.x;
    }
    get height() {
        return this.topLeft.y - this.bottomRight.y;
    }
}
export class SquareShape extends RectangleShape {
    constructor(topLeft, side) {
        super(topLeft, new Point(topLeft.x + side, topLeft.y - side));
    }
    get side() {
        return this.width;
    }
}
export class TriangleShape extends SegmentedShape {
    a;
    b;
    c;
    constructor(a, b, c) {
        super(a, b, c);
        this.a = a;
        this.b = b;
        this.c = c;
    }
    get sideAB() {
        return this.segmentAt(0);
    }
    get sideBC() {
        return this.segmentAt(1);
    }
    get sideAC() {
        return this.segmentAt(2);
    }
}
export class EllipseShape {
    center;
    a;
    b;
    constructor(center, a, b) {
        this.center = center;
        this.a = a;
        this.b = b;
    }
    get area() {
        return Math.PI * this.a * this.b;
    }
    get perimeter() {
        throw new Error("too hard to handle!");
    }
    equationFor(point) {
        return Math.pow(point.x - this.center.x, 2) / Math.pow(this.a, 2) +
            Math.pow(point.y - this.center.y, 2) / Math.pow(this.b, 2);
    }
    intersects(point, epsilon = DEFAULT_EPSILON) {
        return Math.abs(this.equationFor(point) - 1) <= epsilon;
    }
    contains(point) {
        return this.equationFor(point) < 1;
    }
}
export class CircleShape extends EllipseShape {
    radius;
    constructor(center, radius) {
        super(center, radius, radius);
        this.radius = radius;
    }
    get perimeter() {
        return 2 * Math.PI * this.radius;
    }
    get diameter() {
        return this.radius * 2;
    }
}
//# sourceMappingURL=index.js.map