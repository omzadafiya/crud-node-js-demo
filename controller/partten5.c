#include <stdio.h>

int main() {

int n;
int b=1;
printf("enter your number::");
scanf("%d",&n);
for(int i = 0; i < n;i++){
   for(int j = 0;j <=i;j++){
       printf("%d ",b++);
   }
   printf("\n");
}

return 0;
}