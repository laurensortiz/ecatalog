#!/bin/bash

PROJ_DIR=~/dev/conductiv/wkios/branches/LocalStorageImpl/VinOpsMobileShell
PROJ_NAME=VinOpsMobileShell
OUT_DIR=~/Desktop/builds
DEVELOPER="iPhone Developer: Corey Mangum (5S757CN8UR)"
PROF_DIR="/Users/corey/Library/MobileDevice/Provisioning Profiles"

./archive-webkit.sh $PROJ_DIR $PROJ_NAME SelectSB $OUT_DIR "$DEVELOPER" "$PROF_DIR/7FA8E707-0D32-4793-822D-68829E7E2216.mobileprovision"

./archive-webkit.sh $PROJ_DIR $PROJ_NAME SelectQA $OUT_DIR "$DEVELOPER" "$PROF_DIR/C79F9946-7C75-49B0-A21F-A2B23B4DE945.mobileprovision"

./archive-webkit.sh $PROJ_DIR $PROJ_NAME SelectS3 $OUT_DIR "$DEVELOPER" "$PROF_DIR/F845D03C-0D34-4F25-933B-CF751A47B628.mobileprovision"

./archive-webkit.sh $PROJ_DIR $PROJ_NAME SelectDemo $OUT_DIR "$DEVELOPER" "$PROF_DIR/16510180-7357-4A1E-A89E-6DD65AD93C15.mobileprovision"

./archive-webkit.sh $PROJ_DIR $PROJ_NAME Select $OUT_DIR "$DEVELOPER" "$PROF_DIR/2BCC41B1-4011-4303-A7DD-14C74362FF6D.mobileprovision"

echo FINISHED!