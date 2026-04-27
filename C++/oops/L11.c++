// Online C++ compiler to run C++ program online
// hierarchial inheritance

#include <iostream>
using namespace std;
class person{
    public:
    string name;
    int age;
};
class student : public person{
    public:
    int rollno;
     void getinfo(){
         cout<<"hii i am student...\n";
          cout<<"name: "<<name<<endl;
        cout<<"age: "<<age<<endl;
        cout<<"rollno: "<<rollno<<endl; 
     }
};
class teacher : public person{
    public:
    string subject;
     void getinfo(){
        cout<<"hii i am teacher...\n";
        cout<<"name: "<<name<<endl;
        cout<<"age: "<<age<<endl;
        cout<<"subject: "<<subject<<endl;
    }

};
int main(){
    student s1;
    s1.student::name="sarthak jain";
    s1.student::age=21;
    s1.rollno=62;
    teacher t1;
    t1.teacher::name="arvind kumar";
    t1.teacher::age=45;
    t1.subject="oops";
    s1.getinfo();
   t1.getinfo();
    return 0;
    
    
}
