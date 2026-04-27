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

    return 0;
}
