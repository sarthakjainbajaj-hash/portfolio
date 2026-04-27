                                     
//distructor

#include <iostream>
using namespace std;
class student{
public:
string name;
double* cgpaptr;
   student(string name, double cgpa){
   this->name=name;
   cgpaptr=new double;
   *cgpaptr=cgpa;
}
// distructor by (~)
~student (){
cout<<"hii, i am distructor and i delete everything\n";
delete cgpaptr;
}  


void getinfo(){
    cout<<"name: "<<name<<endl;
    cout<<"cgpa: "<<*cgpaptr<<endl;
}
};
int main(){
    student s1("sarthak", 9.2);
    s1.getinfo();
    return 0;
}

