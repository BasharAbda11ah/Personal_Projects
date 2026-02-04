import pytest
from polygon import Polygon
#step 1
def test_polygon_initialization():
    """Tests the initialization of a Polygon object."""
    # Test 1: Triangle
    name = "Triangle"
    sides = [3.0, 4.0, 5.0]
    polygon = Polygon(name=name, sides=sides)

    if polygon.get_name() == name:
        print("triangle name test passed")
    else:
        print("Triangle name test failed")
        print(f"Expected: {name}, Got: {polygon.get_name()}")

    if polygon.get_sides() == sides:
        print("Triangle Side test passed")
    else:
        print("Triangle side test failed")
        print(f"Expected: {sides}, Got: {polygon.get_sides()}")

#step 2
def test_polygon_equality():
    """Tests the equality of two Polygons."""
    polygon1 = Polygon("Triangle", [3.0, 4.0, 5.0])
    polygon2 = Polygon("Triangle", [3.0, 4.0, 5.0])

    if polygon1 == polygon2:
        print("Test passed they are equal")
    else:
        print(" Test failed they are not equal.")

def test_polygon_inequality():
    """Tests the inequality of two Polygons"""
    polygon1 = Polygon("Triangle", [3.0, 4.0, 5.0])
    polygon2 = Polygon("Square", [4.0, 4.0, 4.0, 4.0])

    if polygon1 != polygon2:
        print("Inequality test passed")
    else:
        print("Inequality test failed")
#step 3
def test_polygon_str():
    """Tests the string representation of a Polygon."""
    polygon = Polygon("Triangle", [3, 3, 3])
    expected_str = "Triangle with sides: [3, 3, 3]"
    if str(polygon) == expected_str:
        print("String test passed")
    else:
        print("String test failed")
        print(f"Expected: '{expected_str}', Got: '{str(polygon)}'")
#step 4
def test_calculate_circumference():
    """Tests the circumference calculation of Polygon objects."""
    # Test 1: Triangle
    triangle = Polygon("Triangle", [3.0, 4.0, 5.0])
    expected_circumference = 12.0
    calculated_circumference = triangle.calculate_circumference()
    if calculated_circumference == pytest.approx(expected_circumference):
        print("Triangle circumference test PASSED")
    else:
        print("Triangle circumference test FAILED")
        print(f"Expected: {expected_circumference}, Got: {calculated_circumference}")

    # Test 2: Square
    square = Polygon("Square", [4.0, 4.0, 4.0, 4.0])
    expected_circumference = 16.0
    calculated_circumference = square.calculate_circumference()
    if calculated_circumference == pytest.approx(expected_circumference):
        print("Square circumference test PASSED")
    else:
        print("Square circumference test FAILED")
        print(f"Expected: {expected_circumference}, Got: {calculated_circumference}")

    # Test 3: Pentagon
    pentagon = Polygon("Pentagon", [5.0, 5.0, 5.0, 5.0, 5.0])
    expected_circumference = 25.0
    calculated_circumference = pentagon.calculate_circumference()
    if calculated_circumference == pytest.approx(expected_circumference):
        print("Pentagon circumference test PASSED")
    else:
        print("Pentagon circumference test FAILED")
        print(f"Expected: {expected_circumference}, Got: {calculated_circumference}")

def main():
    test_polygon_initialization()
    
    test_polygon_equality()
    test_polygon_inequality()

    test_polygon_str()

    test_calculate_circumference()

if __name__ == "__main__":
    main()