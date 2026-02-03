let DEFAULT_EPSILON = 0.01;

export function setEpsilon(value: number) {
    DEFAULT_EPSILON = value;
}

export class Point {
    constructor(public readonly x: number, public readonly y: number) {}

    distanceTo(other: Point): number {
        return Math.sqrt(
            Math.pow(this.x - other.x, 2) +
                Math.pow(this.y - other.y, 2),
        );
    }
}

export class Segment {
    constructor(private readonly a: Point, private readonly b: Point) {}

    contains(p: Point, epsilon = DEFAULT_EPSILON) {
        return Math.abs(
            this.a.distanceTo(p) + this.b.distanceTo(p) -
                this.a.distanceTo(this.b),
        ) < epsilon;
    }

    get length(): number {
        return this.a.distanceTo(this.b);
    }
}

export interface Shape {
    get area(): number;
    get perimeter(): number;
    intersects(point: Point): boolean;
    contains(point: Point): boolean;
}

export class SegmentedShape implements Shape {
    readonly points: Point[];
    readonly segments: Segment[];

    constructor(p1: Point, p2: Point, p3: Point, ...restPoints: Point[]) {
        this.points = [p1, p2, p3, ...restPoints];
        this.segments = this.points.map((p, i, pts) =>
            new Segment(p, i == pts.length - 1 ? pts[0] : pts[i + 1])
        );
    }

    intersects(point: Point, epsilon = DEFAULT_EPSILON): boolean {
        return this.segments.some((segment) =>
            segment.contains(point, epsilon)
        );
    }

    contains(point: Point): boolean {
        let hit = false;
        for (
            let i = 0, j = this.points.length - 1;
            i < this.points.length;
            j = i++
        ) {
            if (
                ((this.points[i].y > point.y) !=
                    (this.points[j].y > point.y)) &&
                (point.x <
                    (this.points[j].x - this.points[i].x) *
                                (point.y - this.points[i].y) /
                                (this.points[j].y - this.points[i].y) +
                        this.points[i].x)
            ) hit = !hit;
        }
        return hit;
    }

    safeAt<T>(items: T[], index: number): T {
        if (index >= items.length) {
            throw new RangeError(`out of range access`);
        }
        return items[index];
    }

    pointAt(index: number): Point {
        return this.safeAt(this.points, index);
    }

    segmentAt(index: number): Segment {
        return this.safeAt(this.segments, index);
    }

    get area(): number {
        return Math.abs(this.points.reduce(
            (acc, p, index, pts) => {
                const p2 = index == pts.length - 1 ? pts[0] : pts[index + 1];
                return acc + (p.x * p2.y - p.y * p2.x) / 2;
            },
            0,
        ));
    }

    get perimeter(): number {
        return this.points.reduce((acc, p, i, pts) => {
            const p2 = i == pts.length - 1 ? pts[0] : pts[i + 1];
            return acc + p.distanceTo(p2);
        }, 0);
    }
}

export class RectangleShape extends SegmentedShape {
    constructor(
        topLeft: Point,
        bottomRight: Point,
    ) {
        super(
            topLeft,
            new Point(bottomRight.x, topLeft.y),
            bottomRight,
            new Point(topLeft.x, bottomRight.y),
        );
    }

    get topLeft(): Point {
        return this.pointAt(0);
    }

    get topRight(): Point {
        return this.pointAt(1);
    }

    get bottomRight(): Point {
        return this.pointAt(2);
    }

    get bottomLeft(): Point {
        return this.pointAt(3);
    }

    get width(): number {
        return this.bottomRight.x - this.topLeft.x;
    }

    get height(): number {
        return this.topLeft.y - this.bottomRight.y;
    }
}

export class SquareShape extends RectangleShape {
    constructor(topLeft: Point, side: number) {
        super(
            topLeft,
            new Point(topLeft.x + side, topLeft.y - side),
        );
    }

    get side(): number {
        return this.width;
    }
}

export class TriangleShape extends SegmentedShape {
    constructor(
        private readonly a: Point,
        private readonly b: Point,
        private readonly c: Point,
    ) {
        super(a, b, c);
    }

    get sideAB(): Segment {
        return this.segmentAt(0);
    }

    get sideBC(): Segment {
        return this.segmentAt(1);
    }

    get sideAC(): Segment {
        return this.segmentAt(2);
    }
}

export class EllipseShape implements Shape {
    constructor(
        public readonly center: Point,
        public readonly a: number,
        public readonly b: number,
    ) {
    }

    get area(): number {
        return Math.PI * this.a * this.b;
    }

    get perimeter(): number {
        throw new Error("too hard to handle!");
    }

    private equationFor(point: Point): number {
        return Math.pow(point.x - this.center.x, 2) / Math.pow(this.a, 2) +
            Math.pow(point.y - this.center.y, 2) / Math.pow(this.b, 2);
    }

    intersects(point: Point, epsilon = DEFAULT_EPSILON): boolean {
        return Math.abs(this.equationFor(point) - 1) <= epsilon;
    }

    contains(point: Point): boolean {
        return this.equationFor(point) < 1;
    }
}

export class CircleShape extends EllipseShape {
    constructor(center: Point, public readonly radius: number) {
        super(center, radius, radius);
    }

    override get perimeter(): number {
        return 2 * Math.PI * this.radius;
    }

    get diameter(): number {
        return this.radius * 2;
    }
}
