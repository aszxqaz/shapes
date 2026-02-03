# Библиотека работы с геометрическими фигурами

## Подключение

```bash
npm install github:aszxqaz/shapes
```

## Использование

```js
import {
  CircleShape,
  EllipseShape,
  Point,
  RectangleShape,
  Segment,
  type Shape,
  SquareShape,
  TriangleShape,
} from "shapes";

// Использование класса Segment.

const segment = new Segment(new Point(1, 1), new Point(5, 5));
assertEqualApprox(segment.length, 5.66);
assertEqual(segment.contains(new Point(3, 3)), true);
assertEqual(segment.contains(new Point(3, 4)), false);

// Использование класса TriangleShape.

const triangle = new TriangleShape(
  new Point(0, 0),
  new Point(10, 10),
  new Point(20, 5),
);
assertEqualApprox(triangle.sideAB.length, 14.14);
assertEqualApprox(triangle.sideBC.length, 11.18);
assertEqualApprox(triangle.sideAC.length, 20.62);
assertEqualApprox(triangle.perimeter, 45.94);
assertEqual(triangle.area, 75);
assertEqual(triangle.intersects(new Point(5, 5)), true);
assertEqual(triangle.intersects(new Point(5, 2)), false);
assertEqual(triangle.contains(new Point(5, 6)), false);
assertEqual(triangle.contains(new Point(5, 2)), true);

// Использование класса RectangleShape.

const rectangle = new RectangleShape(
  new Point(0, 20), // top-left
  new Point(30, 0), // bottom-right
);
assertEqual(rectangle.width, 30);
assertEqual(rectangle.height, 20);
assertEqual(rectangle.perimeter, 100);
assertEqual(rectangle.area, 600);
assertEqual(rectangle.intersects(new Point(10, 20)), true);
assertEqual(rectangle.intersects(new Point(10, 10)), false);
assertEqual(rectangle.contains(new Point(10, 21)), false);
assertEqual(rectangle.contains(new Point(10, 10)), true);

// Использование класса SquareShape.

const square = new SquareShape(
  new Point(0, 10), // top-left
  10, // side length
);
assertEqual(square.side, 10);
assertEqual(square.perimeter, 40);
assertEqual(square.area, 100);
assertEqual(square.intersects(new Point(5, 5)), false);
assertEqual(square.intersects(new Point(5, 10)), true);
assertEqual(square.contains(new Point(5, 5)), true);
assertEqual(square.contains(new Point(5, 11)), false);

// Использование класса EllipseShape.

const ellipse = new EllipseShape(
  new Point(0, 0), // center
  1,
  20,
);
assertEqualApprox(ellipse.area, 62.83);
assertEqual(ellipse.intersects(new Point(0, 20)), true);
assertEqual(ellipse.intersects(new Point(19, 0)), false);
assertEqual(ellipse.contains(new Point(0, 0)), true);
assertEqual(ellipse.contains(new Point(10, 10)), false);

// Использование класса CircleShape.

const circle = new CircleShape(
  new Point(0, 0), // center
  10, // radius
);
assertEqualApprox(circle.area, 314.16);
assertEqualApprox(circle.perimeter, 62.83);
assertEqual(circle.diameter, 20);
assertEqual(circle.intersects(new Point(10, 0)), true);
assertEqual(circle.intersects(new Point(10, 1)), false);
assertEqual(circle.contains(new Point(1, 1)), true);
assertEqual(circle.contains(new Point(10, 10)), false);

// Использование интерфейса Shape.

function firstShapeLarger(a: Shape, b: Shape) {
  if (a.area > b.area) return true;
  return false;
}

const a = new CircleShape(new Point(0, 0), 8);
const b = new RectangleShape(new Point(0, 0), new Point(20, 10));

assertEqual(firstShapeLarger(a, b), true);

// Хелпер-функции

export function assertEqualApprox(
  actual: number,
  expected: number,
  error: number = 0.01,
) {
  if (Math.abs(actual - expected) > error) {
    throw new Error(
      `assert (approx) failed: expected = ${expected}, actual = ${actual}, error = ${error}`,
    );
  }
}

export function assertEqual<T>(actual: T, expected: T) {
  if (actual != expected) {
    throw new Error(
      `assert failed: expected = ${expected}, actual = ${actual}`,
    );
  }
}
```
