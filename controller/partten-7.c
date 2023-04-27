#include <stdio.h>
int main() {
    int n;
    printf("Enter Number : ");
    scanf("%d",&n);
    int k=1;
    for(int i=1;i<=n;i++){
        for(int j=0;j<i;j++){
            if(i % 2 == 0){
                printf("* ");
            }
            else{
                printf("%d ",k);
            }
            k++;
        }
        printf("\n");
    }
    return 0;
}