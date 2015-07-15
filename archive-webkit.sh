#!/bin/bash
 
PROJECTDIRECTORY=$1
PROJECTNAME=$2
TARGETNAME=$3
OUTPUTDIRECTORY=$4
DEVELOPPERNAME=$5
PROVISONINGPROFILE=$6

function help
{
	echo "Usage: $0 <projectdirectory> <projectname> <targetname>"
    echo "<projectdirectory>     directory of your .xcodeproj file"
	echo "<projectname>          name of your .xcodeproj file"
    echo "<targetname>           name of your build target"
    echo "<outputdirectory>      name of your build output directory"
    echo "<developername>        name of your developer identity"
    echo "<provisioningprofile>  path to your provisioning profile"
}

# check first argument
if [ -z "$PROJECTDIRECTORY" ] ; then
        help
        exit 1
fi
 
# check second argument
if [ -z "$PROJECTNAME" ] ; then
	help
	exit 1
fi

# check third argument
if [ -z "$TARGETNAME" ] ; then
        help
        exit 1
fi
 
# check fourth argument
if [ -z "$OUTPUTDIRECTORY" ] ; then
        help
        exit 1
fi

cd $PROJECTDIRECTORY

xcodebuild -configuration Release -sdk iphoneos6.1 -project $PROJECTNAME.xcodeproj -target $TARGETNAME build PRODUCT_NAME=$TARGETNAME

if [ $? != 0 ]
then
  echo Build Failed!
  exit 1
fi

/usr/bin/xcrun -sdk iphoneos PackageApplication -v "$PROJECTDIRECTORY/build/Release-iphoneos/$TARGETNAME.app" -o "$OUTPUTDIRECTORY/$TARGETNAME.ipa" --sign "$DEVELOPPERNAME" --embed "$PROVISONINGPROFILE"