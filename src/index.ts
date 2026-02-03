/**
 * Допустимое отклонение при определении пересечений.
 */
let DEFAULT_EPSILON = 0.01;

/**
 * Задает допустимое отклонение при определении пересечений.
 */
export function setEpsilon(value: number) {
    DEFAULT_EPSILON = value;
}

/**
 * Представляет точку в 2D-пространстве с координатами (x, y).
 *
 * @example
 * ```ts
 * const point = new Point(10, 20);
 * ```
 */
export class Point {
    /**
     * Инициализирует экземпляр класса {@link Point}.
     *
     * @param x - Координата точки по оси X.
     * @param y - Координата точки по оси Y.
     */
    constructor(public readonly x: number, public readonly y: number) {}

    /**
     * Вычисляет расстояние до другой точки.
     * @param other - Точка назначения {@link Point}.
     * @returns Расстояние до точки назначения.
     */
    distanceTo(other: Point): number {
        return Math.sqrt(
            Math.pow(this.x - other.x, 2) +
                Math.pow(this.y - other.y, 2),
        );
    }
}

/**
 * Представляет отрезок в 2D-пространстве, соединяющий две точки.
 *
 * @example
 * ```ts
 * const p1 = new Point(1, 2);
 * const p2 = new Point(3, 4);
 * const segment = new Segment(p1, p2);
 * ```
 */
export class Segment {
    /**
     * Инициализирует экземпляр класса {@link Segment}.
     *
     * @param a - Точка А {@link Point} отрезка.
     * @param b - Точка B {@link Point} отрезка.
     */
    constructor(public readonly a: Point, public readonly b: Point) {}

    /**
     * Определяет, лежит ли заданная точка на данном отрезке.
     * @param p - Точка {@link Point}.
     * @param epsilon - Допустимое отклонение.
     * @returns Булевое значение.
     */
    intersects(p: Point, epsilon = DEFAULT_EPSILON): boolean {
        return Math.abs(
            this.a.distanceTo(p) + this.b.distanceTo(p) -
                this.a.distanceTo(this.b),
        ) < epsilon;
    }

    /**
     * Считает длину отрезка.
     * @returns Длина отрезка.
     */
    get length(): number {
        return this.a.distanceTo(this.b);
    }
}

/**
 * Замкнутая фигура в 2D-пространстве.
 * Классы конкретных фигур (треугольник, круг и т.п.) реализуют данный интерфейс.
 */
export interface Shape {
    /**
     * Вычисляет площадь фигуры.
     * @returns Площадь фигуры.
     */
    get area(): number;

    /**
     * Вычисляет периметр фигуры.
     * @returns Периметр фигуры.
     */
    get perimeter(): number;

    /**
     * Определяет, лежит ли заданная точка на отрезках, составляющих фигуру.
     * @param epsilon - Допустимое отклонение.
     * @returns Булевое значение.
     */
    intersects(point: Point, epsilon?: number): boolean;

    /**
     * Определяет, находится ли заданная точка внутри данной фигуры.
     * @returns Булевое значение.
     */
    contains(point: Point): boolean;
}

/**
 * Представляет замкнутую фигуру, состоящую из попарно соединенных
 * непересекающихся отрезков (простой многоугольник).
 *
 * @example
 * ```ts
 * const p1 = new Point(0, 50);
 * const p2 = new Point(100, 100);
 * const p3 = new Point(50, 0);
 * const p4 = new Point(0, 0);
 * const shape = new SegmentedShape(p1, p2, p3, p4);
 * ```
 */
export class SegmentedShape implements Shape {
    /**
     * Совокупность точек многоугольника.
     */
    readonly points: Point[];

    /**
     * Совокупность отрезков многоугольника.
     */
    readonly segments: Segment[];

    constructor(p1: Point, p2: Point, p3: Point, ...restPoints: Point[]) {
        this.points = [p1, p2, p3, ...restPoints];
        this.segments = this.points.map((p, i, pts) =>
            new Segment(p, i == pts.length - 1 ? pts[0] : pts[i + 1])
        );
    }

    intersects(point: Point, epsilon = DEFAULT_EPSILON): boolean {
        return this.segments.some((segment) =>
            segment.intersects(point, epsilon)
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

    private safeAt<T>(items: T[], index: number): T {
        if (index >= items.length) {
            throw new RangeError(`out of range access`);
        }
        return items[index];
    }

    protected pointAt(index: number): Point {
        return this.safeAt(this.points, index);
    }

    protected segmentAt(index: number): Segment {
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

/**
 * Представляет прямоугольник (частный случай многоугольника) в 2D-пространстве.
 *
 * @example
 * ```ts
 * const topLeft = new Point(0, 50);
 * const bottomRight = new Point(100, 0);
 * const rectangle = new RectangleShape(topLeft, bottomRight);
 * ```
 */
export class RectangleShape extends SegmentedShape {
    /**
     * Инициализирует экземпляр класса {@link RectangleShape}.
     *
     * @param topLeft - Левая верхняя точка {@link Point} прямоугольника.
     * @param bottomRight - Правая нижняя точка {@link Point} прямоугольника.
     */
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

    /**
     * Возвращает верхнюю левую точку прямоугольника.
     * @returns Точка {@link Point}.
     */
    get topLeft(): Point {
        return this.pointAt(0);
    }

    /**
     * Возвращает верхнюю правую точку прямоугольника.
     * @returns Точка {@link Point}.
     */
    get topRight(): Point {
        return this.pointAt(1);
    }

    /**
     * Возвращает нижнюю правую точку прямоугольника.
     * @returns Точка {@link Point}.
     */
    get bottomRight(): Point {
        return this.pointAt(2);
    }

    /**
     * Возвращает нижнюю левую точку прямоугольника.
     * @returns Точка {@link Point}.
     */
    get bottomLeft(): Point {
        return this.pointAt(3);
    }

    /**
     * Возвращает ширину прямоугольника.
     * @returns Ширина прямоугольника.
     */
    get width(): number {
        return this.bottomRight.x - this.topLeft.x;
    }

    /**
     * Возвращает высоту прямоугольника.
     * @returns Высота прямоугольника.
     */
    get height(): number {
        return this.topLeft.y - this.bottomRight.y;
    }
}

/**
 * Представляет квадрат (частный случай прямоугольника) в 2D-пространстве.
 *
 * @example
 * ```ts
 * const topLeft = new Point(0, 10);
 * const side = 10;
 * const square = new SquareShape(topLeft, side);
 * ```
 */
export class SquareShape extends RectangleShape {
    /**
     * Инициализирует экземпляр класса {@link SquareShape}.
     *
     * @param topLeft - Левая верхняя точка {@link Point} квадрата.
     * @param side - Сторона квадрата.
     */
    constructor(topLeft: Point, side: number) {
        super(
            topLeft,
            new Point(topLeft.x + side, topLeft.y - side),
        );
    }

    /**
     * Возвращает сторону квадрата.
     * @returns Сторона квадрата.
     */
    get side(): number {
        return this.width;
    }
}

/**
 * Представляет треугольник в 2D-пространстве.
 *
 * @example
 * ```ts
 * const a = new Point(0, 0);
 * const b = new Point(10, 10);
 * const c = new Point(20, 5);
 * const triangle = new TriangleShape(a, b, c);
 * ```
 */
export class TriangleShape extends SegmentedShape {
    /**
     * Инициализирует экземпляр класса {@link TriangleShape}.
     *
     * @param a - Точка {@link Point} A треугольника.
     * @param b - Точка {@link Point} B треугольника.
     * @param c - Точка {@link Point} C треугольника.
     */
    constructor(
        private readonly a: Point,
        private readonly b: Point,
        private readonly c: Point,
    ) {
        super(a, b, c);
    }

    /**
     * Получить отрезок AB треугольника.
     * @returns Отрезок {@link Segment}.
     */
    get sideAB(): Segment {
        return this.segmentAt(0);
    }

    /**
     * Получить отрезок BC треугольника.
     * @returns Отрезок {@link Segment}.
     */
    get sideBC(): Segment {
        return this.segmentAt(1);
    }

    /**
     * Получить отрезок AC треугольника.
     * @returns Отрезок {@link Segment}.
     */
    get sideAC(): Segment {
        return this.segmentAt(2);
    }
}

/**
 * Представляет эллипс в 2D-пространстве.
 *
 * @example
 * ```ts
 * const center = new Point(0, 0);
 * const a = 10;
 * const b = 20;
 * const ellipse = new EllipseShape(center, a, b);
 * ```
 */
export class EllipseShape implements Shape {
    /**
     * Инициализирует экземпляр класса {@link CircleShape}.
     *
     * @param center - Центральная точка {@link Point} эллипса.
     * @param a - Большая полуось.
     * @param b - Малая полуось.
     */
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

/**
 * Представляет окружность (частный случай эллипса) в 2D-пространстве.
 *
 * @example
 * ```ts
 * const center = new Point(0, 0);
 * const radius = 50;
 * const circle = new CircleShape(center, radius);
 * ```
 */
export class CircleShape extends EllipseShape {
    /**
     * Инициализирует экземпляр класса {@link CircleShape}.
     *
     * @param center - Центральная точка {@link Point} окружности.
     * @param radius - Радиус окружности.
     */
    constructor(center: Point, public readonly radius: number) {
        super(center, radius, radius);
    }

    override get perimeter(): number {
        return 2 * Math.PI * this.radius;
    }

    /**
     * Вычисляет диаметр окружности.
     * @returns Диаметр окружности.
     */
    get diameter(): number {
        return this.radius * 2;
    }
}
