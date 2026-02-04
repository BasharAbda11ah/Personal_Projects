#step 1
class Polygon:
    __slots__ = ["__name", "__sides"]

    def __init__(self, name, sides):
        self.__name = name
        self.__sides = sides

    def get_name(self):
        """Returns the name of the polygon."""
        return self.__name

    def set_name(self, new_name):
        """Sets a new name for the polygon."""
        self.__name = new_name

    def get_sides(self):
        """Returns the sides of the polygon."""
        return self.__sides

    def set_sides(self, new_sides):
        """Sets new side lengths for the polygon."""
        self.__sides = new_sides

    #step 2
    def __eq__(self, other):
        """Checks if polygons are equal to each other"""
        if isinstance(other, Polygon):
            return self.__name == other.__name and self.__sides == other.__sides
        return False
    
    def __ne__(self, other):
        """Checks inequality of two polygons."""
        return not self.__eq__(other)

    #step 3
    def __str__(self):
        """Returns the string representation of a polygon."""
        return f"{self.__name} with sides: {self.__sides}"

    #step 4
    def calculate_circumference(self):
        """Calculates and returns the circumference of a polygon."""
        return sum(self.__sides)


def main():
    triangle = Polygon("Triangle", [3.0, 4.0, 5.0])
    square = Polygon("Square", [4.0, 4.0, 4.0, 4.0])
    hexagon = Polygon("Hexagon", [6.0, 6.0, 6.0, 6.0, 6.0, 6.0])

    print(triangle)
    print(f"Circumference of Triangle: {triangle.calculate_circumference()}")

    print(square)
    print(f"Circumference of Square: {square.calculate_circumference()}")

    print(hexagon)
    print(f"Circumference of Hexagon: {hexagon.calculate_circumference()}")

if __name__ == "__main__":
    main()
