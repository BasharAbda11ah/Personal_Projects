from turtle import Screen, Turtle

PIXEL_SIZE = 30
ROWS = 20
COLUMNS = 20
DEFAULT_PEN_COLOR = "black"
DEFAULT_PIXEL_COLOR = "white"


def initialization(turta):
    """
    Function which sets the speed, pencolor and the starting point of the turtle to start drawing
    turta: Turtle - Turtle
    """
    turta.speed(0)
    turta.penup()
    turta.goto(
        -PIXEL_SIZE * COLUMNS / 2, PIXEL_SIZE * ROWS / 2
    )  # initial coordinate of the turtle to begin drawing
    turta.setheading(0)
    turta.pendown()
    turta.pencolor(DEFAULT_PEN_COLOR)
    turta.fillcolor(DEFAULT_PIXEL_COLOR)


def get_color(color):
    """
    This function exchanges the color number with the color name.
    color: int - the number of the color
    """
    if color == "0":
        return "black"
    elif color == "1":
        return "white"
    elif color == "2":
        return "red"
    elif color == "3":
        return "yellow"
    elif color == "4":
        return "orange"
    elif color == "5":
        return "green"
    elif color == "6":
        return "yellowgreen"
    elif color == "7":
        return "sienna"
    elif color == "8":
        return "tan"
    elif color == "9":
        return "gray"
    elif color == "A":
        return "darkgray"
    else:
        # Return None of none of the above
        return None

def go_next_line(turta):
    """
    This function permits to go to the next line based on the current position
    turta: Turtle - turtle
    """
    # Go to next line
    turta.penup()  
    turta.goto(-PIXEL_SIZE * COLUMNS / 2, turta.ycor() - PIXEL_SIZE)
    turta.pendown()

def draw_color_pixel(color_string, turta):
    """
    This function permits to draw a colored pixel based on the color
    color_string: string - the color of the pixel
    turta: Turtle - the turtle
    """
    turta.begin_fill()
    turta.fillcolor(color_string)

    for v in range(0, 4):
        turta.fd(PIXEL_SIZE)
        turta.right(90)

    turta.fd(PIXEL_SIZE)

    turta.end_fill()


def draw_pixel(color_string, turta):
    """
    This function permits to draw a colored pixel with the turtle color
    color_string: string - the turtle color character
    turta: Turtle - turtles
    """
    color = get_color(color_string)
    draw_color_pixel(color, turta)


def draw_line_from_string(color_string, turta):
    """
    This functions draws a line of colored pixels from color character
    color_string: string - the string of turtle color character
    turta: Turtel - turtle
    """
    for color in color_string:
        if get_color(color) == None:
            # Stop drawing if color does not exist
            return False
        else:
            draw_pixel(color, turta)
    return True

def draw_shape_from_string(turta):
    """
    This function permits to draw a shape from user input
    turta: Turtle - turtle
    """
    while True:
        color_string = input("Enter a string of colors: ")
        # Preprocess the input with .strip() to remove empty whitespace
        if color_string.strip() == "":
            break
        else:
            line = draw_line_from_string(color_string, turta)
            if line == False:
                # Invalid color
                break
            else:
                # If the line does not break, go to next line
                go_next_line(turta)


def draw_grid(turta):
    """
    This function draws a grid
    turta: Turtle - turtle
    """
    # ROWS // 2 because it draws 2 rows at once
    for v in range(ROWS // 2):
        # Draw first pattern
        draw_line_from_string("02020202020202020202", turta)

        # Go to next line
        go_next_line(turta)

        # Draw alternate pattern
        draw_line_from_string("20202020202020202020", turta)

        # Go to next line
        go_next_line(turta)


def draw_from_file(turta):
    """
    This function draws a shape from a file
    turta: Turtle - turtle
    Screen: Screen - to open new screen after input
    """
    file_path = input("Enter the path of the file that you want to read its content: ")

    try:
        with open(file_path, "r") as file:
            for line in file:
                # .strip() removes whitespace from character
                # Text file has empty spaces at the end
                draw_line_from_string(line.strip(), turta)

                # Go to next line
                go_next_line(turta)
    except FileNotFoundError:
        print("File not found")