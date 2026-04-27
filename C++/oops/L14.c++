#include <iostream>
using namespace std;
class sarthak{
    public:
    sarthak(){
        cout<<" i am constructor\n";
    }

    ~sarthak(){
        cout<<"hi i am distructor\n";
    }
};
int main(){
    if(true){
        static sarthak s1;
    
    }
    cout<<"end of main \n";
    return 0;
}