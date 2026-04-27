#include <iostream>
using namespace std;
class student{
public:
   string name;
   double *cgpaptr;  //pointer jo cgpa ki value ko point karega

   student(string name, double cgpa){
   this->name=name;
   cgpaptr=new double;   //hame pointer ko new memory location deni padegi bo aise dege
   *cgpaptr=cgpa;       //pointer ko derefrence krrke apni cgpa dedege
   }
 student(student &obj){  //copy constructor
    this->name=obj.name;
    this->cgpaptr=obj.cgpaptr;
 }

 void getinfo(){
    cout<<"name: "<<name<<endl;
    cout<<"cgpa"<<*cgpaptr<<endl;
    cout<<endl;

 }
};

int main(){
student s1("sarthak jain", 8.9);
student s2(s1);
s1.getinfo();
*(s2.cgpaptr)=9.8;
s1.getinfo();


    return 0;
}

