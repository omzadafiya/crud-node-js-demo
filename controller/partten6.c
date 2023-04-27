#include <stdio.h>

int main() {
    
int n;
int b=1;
printf("enter your number::");
scanf("%d",&n);
for(int i=1;i<=n;++i){
    for(int j=1;j<=i;++j){
        printf("%d",i);
    }
    printf("\n");
}
return 0;
}