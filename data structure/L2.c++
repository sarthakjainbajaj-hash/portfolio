#include <iostream>
using namespace std;

class node {
public:
    int data;
    node* next;

    node(int val) {
        data = val;
        next = NULL;
    }
};

class list {
    node* head;
    node* tail;

public:
    list() {
        head = tail = NULL;
    }

    void push_front(int val) {
        node* Newnode = new node(val);   // create new node

        if (head == NULL) {              // if list is empty
            head = tail = Newnode;
            return;
        }
        else {
            Newnode->next = head;        // link new node to old head
            head = Newnode;              // update head
        }
    }
    void push_back(int val){
        node* Newnode=new node(val);
        if(head==NULL){
            head = tail = NULL;
            tail=Newnode;
        }
        else{
            tail->next=Newnode;
            tail=Newnode;
        }
    }
    void pop_front(){
        if(head==NULL){
        cout<<"empty"<<endl;
        return;}
        else{
            node* temp=head;
            head=head->next;
            temp->next=NULL;
            delete temp;
        }
    }
    void pop_back(){
        if(head==NULL){
            cout<<"empty\n";
            return;
        }
      
            node* temp=head;
            while(temp->next!=tail){
                temp=temp->next;
            }
            temp->next=NULL;
            delete tail;
            tail=temp;
        
    }
    void insert(int val, int pos){
        if(head==NULL){
            cout<<"empty\n";
            return;
        }
        if(pos==0){
            push_front(val);
            return;
        }
        node* temp=head;
        for(int i=0; i<pos-1; i++){
            temp=temp->next;
        }
        node*Newnode=new node(val);
        Newnode->next=temp->next;
        temp->next=Newnode;
    }

    void printll() {
        node* temp = head;
        while (temp != NULL) {
            cout << temp->data << " -> ";
            temp = temp->next;
        }
        cout << "NULL"<<endl;
    }
};

int main() {
    list ll;
    ll.push_front(1);
    ll.push_front(2);
    ll.push_front(3);
    ll.push_back(4);
    ll.printll();

    ll.pop_front();
    ll.printll();
    ll.pop_back();
    ll.printll();
    ll.insert(4,1);
    ll.printll();
    return 0;
}
