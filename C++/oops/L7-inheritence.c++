#include <iostream>
using namespace std;
class person{
  public:
  string name;
  int age;
  person(){
    cout<<"hii i am parent counstructor\n";
    
  }

};
class student :public person{
    public:
    int rollno;
    student(){
        cout<<"hii, i am child constructor\n";
    }

    void getinfo(){
        cout<<"name: "<<name<<endl;
        cout<<"age: "<<age<<endl;
        cout<<"rollno: "<<rollno<<endl;
    }
};
int main(){
    student s1;
    s1.name="sarthak bajaj";
    s1.age=21;
    s1.rollno=62;
    s1.getinfo();
    return 0;

}