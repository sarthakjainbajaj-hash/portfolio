#include <iostream>
using namespace std;

#define N 5

class Stack{
private:
    int a[N];
    int top;

public:
    Stack(){
        top = -1;
    }

    void push(int item)
    {
        if(top == N-1){
            cout<<"Stack Overflow\n";
            return;
        }
        top = top + 1;
        a[top] = item;   // ✅ Correct insertion
    }

    void pop()
    {
        if(top == -1){
            cout<<"Stack Underflow\n";
            return;
        }
        int item = a[top];   // ✅ Get last element
        top = top - 1;
        cout<<"Popped element: "<<item<<endl;
    }

    void display()
    {
        if(top == -1){
            cout<<"Stack is empty\n";
            return;
        }
        for(int i = top; i>=0; i--){
            cout<<a[i]<<" ";
        }
        cout<<endl;
    }
};

int main(){
    Stack s;

    s.push(10);
    s.push(20);
    s.push(30);

    s.display();

    s.pop();

    s.display();

    return 0;
}
