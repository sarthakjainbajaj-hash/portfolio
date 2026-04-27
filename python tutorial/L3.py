

 # Q.2) calcilating grading 
 
P = float(input("enter maths marks "))
M = float(input("enter physics marks ")) 
C = float(input("enter chemistry marks "))
TOTAL= P + M + C
percentage = (TOTAL*100)/300
print(percentage)
if percentage >= 90:
  print("graade A")
elif percentage >= 80 and percentage <= 90:
  print("grade B")
elif percentage >= 60 and percentage <= 80:
  print("grade C")
else:
  print("fail")