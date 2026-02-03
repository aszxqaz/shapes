export declare function setEpsilon(value: number): void;
export declare class Point {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    distanceTo(other: Point): number;
}
export declare class Segment {
    private readonly a;
    private readonly b;
    constructor(a: Point, b: Point);
    contains(p: Point, epsilon?: number): boolean;
    get length(): number;
}
export interface Shape {
    get area(): number;
    get perimeter(): number;
    intersects(point: Point): boolean;
    contains(point: Point): boolean;
}
export declare class SegmentedShape implements Shape {
    readonly points: Point[];
    readonly segments: Segment[];
    constructor(p1: Point, p2: Point, p3: Point, ...restPoints: Point[]);
    intersects(point: Point, epsilon?: number): boolean;
    contains(point: Point): boolean;
    safeAt<T>(items: T[], index: number): T;
    pointAt(index: number): Point;
    segmentAt(index: number): Segment;
    get area(): number;
    get perimeter(): number;
}
export declare class RectangleShape extends SegmentedShape {
    constructor(topLeft: Point, bottomRight: Point);
    get topLeft(): Point;
    get topRight(): Point;
    get bottomRight(): Point;
    get bottomLeft(): Point;
    get width(): number;
    get height(): number;
}
export declare class SquareShape extends RectangleShape {
    constructor(topLeft: Point, side: number);
    get side(): number;
}
export declare class TriangleShape extends SegmentedShape {
    private readonly a;
    private readonly b;
    private readonly c;
    constructor(a: Point, b: Point, c: Point);
    get sideAB(): Segment;
    get sideBC(): Segment;
    get sideAC(): Segment;
}
export declare class EllipseShape implements Shape {
    readonly center: Point;
    readonly a: number;
    readonly b: number;
    constructor(center: Point, a: number, b: number);
    get area(): number;
    get perimeter(): number;
    private equationFor;
    intersects(point: Point, epsilon?: number): boolean;
    contains(point: Point): boolean;
}
export declare class CircleShape extends EllipseShape {
    readonly radius: number;
    constructor(center: Point, radius: number);
    get perimeter(): number;
    get diameter(): number;
}
//# sourceMappingURL=index.d.ts.map