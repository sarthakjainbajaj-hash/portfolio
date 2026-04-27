#include <iostream>
using namespace std;
class parent{
    public:
     void show(){
        //  int x = 0;
      static  int x = 0;
        cout<<"x : "<<x<<endl;
        x++;
     }
};
int main(){
    parent p1;
    p1.show();
    p1.show();
     p1.show();
 return 0;
}