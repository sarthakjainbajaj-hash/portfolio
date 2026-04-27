#include <iostream>
using namespace std;
class person{
  public:
  string name;
  int age;
  person(string name, int age){
    cout<<"hii i am parent counstructor\n";
    this->name=name;
    this->age=age;
    
  }

};
class student :public person{
    public:
    int rollno;
    student(string name, int age, int rollno):person( name,  age)    //khud ka constructor banaya h toh aise krrne se parent claa ka constructor call 
        {                                                            //call ho jaayega student class ke constructor se phele    
            this->rollno=rollno;
        cout<<"hii, i am child constructor\n";
    }

    void getinfo(){
        cout<<"name: "<<name<<endl;
        cout<<"age: "<<age<<endl;
        cout<<"rollno: "<<rollno<<endl;
    }
};
int main(){
    student s1("sarthak jain", 21, 62);
    
    s1.getinfo();
    return 0;

}