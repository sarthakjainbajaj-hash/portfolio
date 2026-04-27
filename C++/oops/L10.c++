// multiple inheritance type

#include <iostream>
using namespace std;
class teacher {
    public:
    string name;
    double salary;
    int age;

};
class student{
    public:
    string name;
    int rollno;
};
class gradstudent: public student, public teacher{
    public:
     void getinfo(){
        cout<<"name: "<<student::name<<endl;  //apan ne student::name ku kara -> kuki compailer confuse ho raha h ki name kis class se inherit kare
           cout<<"rollno: "<<rollno<<endl;    // student and teacher dono m name h isiliye clrarify krrna padega ki name kaha se inherit kare 
         cout<<"salary: "<<salary<<endl;
        cout<<"age: "<<age<<endl;

    }
};
       
int main(){
    gradstudent s1;
    s1.student::name="sarthak jain";
    s1.rollno=62;
    s1.salary=9800;
    s1.age=21;
    s1.getinfo();
    return 0;
}