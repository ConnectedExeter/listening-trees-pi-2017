#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdint.h>
#include <string.h>
#include "accel_fetch.h"

int main() {
    float xyz[3];
    accel_fetch_setup();
    for (;;){
        if( accel_fetch_xyz(xyz) != 0 ){
          printf("%7.2f,%7.2f,%7.2f\n", xyz[0],xyz[1],xyz[2]);
        }
    }
    return 0;
}

