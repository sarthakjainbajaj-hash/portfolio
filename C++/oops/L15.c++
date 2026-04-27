
// friend function

#include <iostream>
using namespace std;
class student{
    int a,b;
    public:
    void setnumber(int n1, int n2){
        this->a=n1;
        this->b=n2;
     }
     friend student sumcomplex(student c1,student c2);
     void printnumber(){
        cout<<"your number is "<<a<<" + "<<b<<"i"<<endl;
     }
     
};

student sumcomplex(student c1, student c2){
    student c3;
    c3.setnumber((c1.a+c2.a),(c1.b+c2.b));
    return c3;

}
int main(){
    student s1;
    student s2;
    student sum;
    s1.setnumber(4, 5);
    s2.setnumber(6, 8);
    s1.printnumber();
    s2.printnumber();
    sum = sumcomplex(s1,s2);
    sum.printnumber();

    return 0;

}