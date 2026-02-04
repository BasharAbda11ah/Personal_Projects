"""
This file creates a table and draws a cake on the table based on user input.
"""

from turtle import Screen, Turtle

def draw_rect(height, width, color, turta):
  """
  This function draws a rectangle.
  height: integer
  width: integer
  color: string
  turta: Turtle
  """
  turta.begin_fill()
  turta.fillcolor(color)
  turta.pencolor(color)
  turta.fd(width / 2)
  turta.left(90)
  turta.fd(height)
  turta.left(90)
  turta.fd(width)
  turta.left(90)
  turta.fd(height)
  turta.left(90)
  turta.fd(width / 2)

  turta.end_fill()

def draw_plate(plate_length, plate_width, plate_color, turta):
  """
  This function draws a plate.
  table_width: integer
  turta: Turtle
  """
  turta.up()
  turta.goto(0, 1)
  turta.down()

  # Draw a plate
  draw_rect(plate_width, plate_length, "gray", turta)

def draw_candle(turta):
  """
  This function draws a blue candle.
  turta: Turtle
  """
  draw_rect(20, 5, "blue", turta)

def draw_cake(cake_length, cake_color,turta):
  """
  This function draws a cake.
  cake_length: integer
  turta: Turtle
  """
  # Plate properties
  plate_length = cake_length * 2
  plate_width = 5
  plate_color = "gray"

  # draw plate first
  draw_plate(plate_length, plate_width, plate_color, turta)

  turta.up()
  turta.goto(0, 7)
  turta.down()

  # layers = 3
  # layer 1 = 50% of the width
  # layer 2 = 45% of the width
  # layer 3 = 40 of the width

  layerheight = cake_length / 3
  layer1width = 0.9 * (cake_length * 2) # 90% of the cake width
  layer2width = 0.8 * (cake_length * 2) # 80% of the cake width
  layer3width = 0.7 * (cake_length * 2) # 70% of the cake width
  
  # Draw first layer of cake
  draw_rect(layerheight, layer1width, cake_color[0], turta)
  
  # Move up
  turta.up()
  turta.goto(0, 7 + layerheight)
  turta.down()

  # Draw second layer of cake
  draw_rect(layerheight, layer2width, cake_color[1], turta)

  # Move up
  turta.up()
  turta.goto(0, 7 + layerheight * 2)
  turta.down()

  # Draw third layer of cake
  draw_rect(layerheight, layer3width, cake_color[2], turta)

  # Move up
  turta.up()
  turta.goto(0, 7 + layerheight * 3)
  turta.fd(0.1 * cake_length + 5)  # Move a bit to the right to draw the candle
  turta.down()

  # Draw the candle
  draw_candle(turta)
  
  turta.up()
  turta.bk(0.1 * cake_length + 5)
  turta.down()

  # Draw red cherry on top
  turta.pencolor("red")
  turta.begin_fill()
  turta.fillcolor("red")
  turta.circle(10)
  turta.end_fill()

def table_leg(table_size, turta):
  """
  This function draws a leg of the table.
  table_size: integer
  turta: Turtle
  """
  turta.left(90)
  turta.fd(table_size / 2) 
  turta.right(86)
  turta.fd(table_size / 25)  # Width of the leg
  turta.right(60)
  turta.fd(table_size / 7)   # Going to the back right leg
  turta.right(34)
  turta.fd(table_size / 2.6) # Going up to the table to draw next leg
  turta.right(90)
  turta.fd(table_size / 25)
  turta.right(90)
  turta.fd(table_size / 2.6)
  turta.left(35)
  turta.fd(table_size / 13)
  turta.left(145)
  turta.fd(table_size / 2.23)
  turta.left(90)

def table_right_side(table_size, turta):
  """
  This function the right side of the table.
  table_size: integer
  turta: Turtle
  """
  turta.fd(table_size / 2)
  turta.right(45)
  turta.fd(table_size / 13)
  turta.right(135)
  turta.fd(table_size / 13)

def table_left_side(table_size, turta):
  """
  This function draws the left size of the table.
  table_size: integer
  turta: Turtle
  """
  turta.right(135)
  turta.fd(table_size / 13)
  turta.right(45)
  turta.fd(table_size / 13)
  turta.goto(0, 0)

def draw_table(table_size, table_color, turta):
  """
  This def function is supposed to make a table with 4 legs
  table_size and table_color are manually entered by the user.
  table_size: integer
  table_color: string
  turta: Turtle
  """
  table_size = table_size * 2

  turta.begin_fill()
  turta.fillcolor(table_color)
  turta.pencolor(table_color)
  table_right_side(table_size, turta)
  table_leg(table_size, turta)
  turta.fd(table_size * 0.4)
  turta.fd(table_size * 0.4)
  table_leg(table_size, turta)
  turta.fd(table_size / 6.5)
  table_left_side(table_size, turta)
  turta.end_fill()

def main():
  user_name = input("Hello! What is your name?: ")
  user_age = int(input("What is your age?: "))
  table_length = int(input("Please enter the size of a table: "))
  table_color = input("Please enter the color of the table: ")
  cake_length = int(input("Please enter the size of the cake (Note that cake should be smaller or equal to the table): "))
  cake_colors = input("Enter the 3 colors for the cake layers (separated by spaces): ").split()
  if table_length >= cake_length:
    if len(cake_colors) == 3:
      sc = Screen()
      turta = Turtle()
      sc.bgcolor("light blue")

      print("\nClose the canvas window in order to quit.")

      draw_table(table_length, table_color, turta)
      draw_cake(cake_length, cake_colors, turta)
      y_1 = cake_length * 1.5     #go up to make a text
      turta.penup()
      turta.goto (0, y_1)
      turta.pendown()
      text = f"Happy {user_age}th Birthday, {user_name}!"
      turta.write(text, font = ("Arial", 20), align="center")
      turta.up()
      turta.goto(0, 0) # Return to where it started

      sc.exitonclick()
    else:
      print("Not enough layer colors")
  else:
    print("The cake is too big for this table :(")

if __name__ == "__main__":
  main()