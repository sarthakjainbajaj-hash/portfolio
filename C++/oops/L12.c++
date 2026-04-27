
// // function overloding
// #include <iostream>
// using namespace std;
// class print{
//   public: 
    
//     void show(int x){
//     cout<< "int x: " <<x<<endl;

//     }
//     void show(char ch){
//     cout<<"char: "<<ch<<endl;
//     }

// };
// int main(){
//     print p1;
//     p1.show('@');


//     return 0;
// }


// function overriding

#include <iostream>
using namespace std;
class parent{
    public:
    void getinfo(){
        cout<<"parent class\n";
    }
};
class child{
    public:
    void getinfo(){
        cout<<"child class\n";
    }
    
};
int main(){
    child c1;
    c1.getinfo();
    return 0;
}