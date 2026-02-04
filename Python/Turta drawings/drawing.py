"""
This file imports modules from pixart and draws shapes from file input
"""

from turtle import Screen, Turtle
from pixart import initialization, draw_shape_from_string, draw_grid, draw_from_file

def main():
    sc = Screen()
    turta = Turtle()

    initialization(turta)
    draw_grid(turta)

    initialization(turta)
    draw_from_file(turta)
    # draw_shape_from_string(turta)

    sc.exitonclick()

if __name__ == "__main__":
  main()
