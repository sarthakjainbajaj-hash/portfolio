#include <iostream>
using namespace std;
struct Node {
    int data;
   struct Node*llinks;
   struct Node* rlinks;
  
};
int main() {
    int n;
    cout<<"enter the number of nodes you want to create: ";
    cin>>n;
    Node *llink = NULL, *x=null, *newnode =NULL;
    for(int i=i; i<n; i++) {
       
        newnode = new Node;
        cout<<"enter the data for node "<<i+1<<": ";
        cin>>newnode->data;
        newnode->llink = NULL;
        newnode->Rlink = NULL;
        if(L==NULL){

            L=x=newnode;
           }
        else{
            x->RLink=newnode;
            x->LLink=x;
            x= newnode;
        }
    

}
