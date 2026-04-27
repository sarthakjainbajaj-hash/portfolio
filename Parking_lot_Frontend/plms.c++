#include <iostream>
#include <string>
#include <ctime>
#include <vector>
using namespace std;
class vehicle{
    private:
    string vehicle_no;
    string vehicle_type;
    string owner_name;
    long long contact_number;
    public:
   
    vehicle(string vehicle_no, string vehicle_type, string owner_name, long long contact_number){
        this->vehicle_no=vehicle_no;
        this->vehicle_type=vehicle_type;
        this->owner_name=owner_name;    
        this->contact_number=contact_number;
    }
    void setvehicle_no(string no){
        vehicle_no=no;
       
    }
    void setvehicle_type(string type){
        vehicle_type=type;  
       
    }
    void setowner_name(string name){
        owner_name=name;
        
    }
    void setcontact_number(long long number){
        contact_number=number;
    }
    string getvehicle_no(){
       return vehicle_no;
    }
    string getvehicle_type(){
        return vehicle_type;
    }
    string getowner_name(){   
        return owner_name;
    }   
    long long getcontact_number(){
       return contact_number;
    }

        void display(){
            cout<<"owner name: "<<owner_name<<endl;
            cout<<"contact number: "<<contact_number<<endl;
            cout<<"vehicle type: "<<vehicle_type<<endl;
            cout<<"vehicle no: "<<vehicle_no<<endl;
            
           
        }

    };
    



class parkingSlot{
    private:
    int lot_no;
    string parked_vehicle;
    bool is_occupied;
    public:
    parkingSlot(int lot_no){
        this->lot_no=lot_no;
        this->is_occupied=false;
        parked_vehicle="";
    }


    bool parkvehicle(string vehicle_number){ 
        if(is_occupied){ 
            return false;
        }
        
        else{
            is_occupied=true;
            parked_vehicle=vehicle_number;
            return true;
        }
    }
    void removevehicle(){
        parked_vehicle="";
        is_occupied=false;
    }
    bool isfree() const {
        return !is_occupied;
    }
    int getlotnumber() const {
        return lot_no;
    }
    string getparkedvehicle() const {
        return parked_vehicle;
    }   
    void getinfo(){
        cout<<"lot no: "<<lot_no<<endl;
        cout<<"vehicle number: "<<parked_vehicle<<endl;
        cout<<"is occupied: "<<(is_occupied ? "yes" : "no")<<endl;
    }
    

};
class ticket {
private:
    int ticket_no;
    string vehicle_no;
    int slot_no;
    time_t entry_time;
    time_t exit_time;
    double fee;

public:
    ticket(int id, string vno, int slot) {
        ticket_no = id;
        vehicle_no = vno;
        slot_no = slot;
        entry_time = time(0);
        fee = 0;
    }

    void setExitTime() {
        exit_time = time(0);
    }

    void calculateFee() {
        double hours = difftime(exit_time, entry_time) / 3600;
        if(hours <= 1) fee = 20;
        else fee = 20 + (int(hours) * 10);
    }

    int getTicketID() { return ticket_no; }
    int getSlotNo() { return slot_no; }
    double getFee() { return fee; }

    void displayTicket() {
        cout << "Ticket ID: " << ticket_no << endl;
        cout << "Vehicle No: " << vehicle_no << endl;
        cout << "Slot No: " << slot_no << endl;
    }
};
class parkinglot{
    private:
    int totalslots; // slots= tracks all parking slots
    vector<ticket>tickets; //tickets ->store active +passive tickets
    vector<parkingSlot> slots;
    int ticketcounter;
    public:
    parkinglot(int totalslots){
    this->totalslots = totalslots;
    ticketcounter = 1;
    for(int i =0; i<totalslots;i++){
        slots.push_back(parkingSlot(i+1));
    }
 }
 void showavailableslots(){
    for(auto &slot:slots){
        if(slot.isfree()){
            cout<<"slot"<<slot.getlotnumber()<<"is available"<<endl;
        }
    }
 }
 int findfreeslot(){
    for(int i=0; i<slots.size();i++){
        if(slots[i].isfree()){
            return i;
        }
    }
    return -1; // no free slot
 }
 void allocateslot(vehicle v){
    int index=findfreeslot();
    if(index==-1){
        cout<<"Parking Full!\n";
        return;
    }
    slots[index].parkvehicle(v.getvehicle_no());
    ticket t(ticketcounter++,v.getvehicle_no(), slots[index].getlotnumber());
    tickets.push_back(t);
    cout<<"vehicle parked at slot"<<slots[index].getlotnumber()<<endl;
    cout<<"ticket ID:"<<t.getTicketID()<<endl;
 }
 void exitvehicle(int ticketID){
    for(auto &t : tickets){
        if(t.getTicketID()==ticketID ){
            t.setExitTime();
            t.calculateFee();

            int slotNo=t.getSlotNo();
            slots[slotNo-1].removevehicle();
            cout<<"vehicle exited from slot"<<endl;
            cout<<"Total fee:"<<t.getFee()<<endl;
            return;
        }   
    }
    cout<<"invalid ticket ID\n";
 }
 void showtickets(){
    for(auto &t:tickets){
        t.displayTicket();
    }
 }



};

 int main() {

parkinglot lot(10);

    int choice;

    while(true) {
        cout << "\n1. Park Vehicle\n";
        cout << "2. Exit Vehicle\n";
        cout << "3. Show Available Slots\n";
        cout << "4. Show Tickets\n";
        cout << "5. Exit\n";

        cin >> choice;

        switch(choice) {

            case 1: {
                string number, type;

                cout << "Enter Vehicle Number: ";
                cin >> number;

                cout << "Enter Vehicle Type (Car/Bike/Truck): ";
                cin >> type;

               string owner;
                long long contact;

               cout << "Enter Owner Name: ";
                cin >> owner;

               cout << "Enter Contact Number: ";
               cin >> contact;

               vehicle v(number, type, owner, contact);

                lot.allocateslot(v);   // call ParkingLot logic
                break;
            }

            case 2: {
                int ticketID;

                cout << "Enter Ticket ID: ";
                cin >> ticketID;

                lot.exitvehicle(ticketID);   // call exit logic
                break;
            }

            case 3:
               lot.showavailableslots();

                break;

            case 4:
                lot.showtickets();
                break;

            case 5:
                cout << "Exiting program...\n";
                return 0;

            default:
                cout << "Invalid choice!\n";
        }
    }
    return 0;
}
