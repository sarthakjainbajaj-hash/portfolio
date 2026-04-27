#include <iostream>
using namespace std;
class teacher{
private:
   double salary;
public:
  string name;
  string department;
  string subject;
    // default constructor 
    teacher(){
        cout<<"hi, i am a constructor\n";

    }
    // paramatrize constructor
    // this-> pointer ka use object ki proprties ko access krrne ke liye
    teacher(string name,string department, string subject, double salary){
       this->name = name;
        this->department = department;
        this->subject = subject;
        this->salary = salary;
    }
    void setsalary(double i){
        salary = i;
    }
    double getsalary(){
        return salary;
    }

    void getinfo(){
        cout<<"name: "<<name<<endl;
        cout<<"department: "<<department<<endl;
         cout<<"subject: "<<subject<<endl;
         cout<<"salary: "<<salary<<endl;
    }
};
int main(){
teacher t1("sarthak", "computerscience", "c++", 350000);
t1.getinfo();
t1.setsalary(400000);
cout<<"updated salary: "<<t1.getsalary()<<endl;

    return 0;
}