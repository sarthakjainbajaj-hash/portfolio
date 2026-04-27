



#include <iostream>
using namespace std;
class vehicle{
    public:
    string vehicle_name;
    string brand;
    int chassis_no;
    double topspeed;
    vehicle(string vehicle_name, string brand,    int chassis_no,    double topspeed)
{
    this->vehicle_name=vehicle_name;
    this->brand=brand;
    this->chassis_no=chassis_no;
    this->topspeed=topspeed;
 }
 void getinfo(){
    cout<<"vehicle name is : "<<vehicle_name<<endl;
    cout<<"the brand name is : "<<brand<<endl;
    cout<<"vehicle chassis number is : "<<chassis_no<<endl;
    cout<<"vehicle topspeed is : "<<topspeed<<" km/hr"<<endl;
 }



};
int main(){
    vehicle v1("activa","honda",2344,120);
 v1.getinfo();
 return 0;

}