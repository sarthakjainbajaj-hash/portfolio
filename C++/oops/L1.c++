#include <iostream>
using namespace std;
class teacher{
    public:
    string name;
    string department;
    string subject;
    int salary;
    
void setsalary(int s){
    salary=s;

}
int getsalary(){
    return salary;

}
};
int main(){
    teacher t1;
    t1.name="sarthak jain";
    t1.department="cs";
    t1.subject="opps";

    t1.setsalary(60000);
    cout<<"name: "<<t1.name<<endl;
    cout<<"department: "<<t1.department<<endl;
    cout<<"subject: "<<t1.subject<<endl;
    cout<<"salary: "<<t1.getsalary()<<endl;
    return 0;
    
}