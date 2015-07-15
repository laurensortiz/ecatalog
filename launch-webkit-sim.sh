#!/bin/bash
 
PROJECTDIRECTORY=$1
PROJECTNAME=$2
TARGETNAME=$3
CONFIGURATION=$4
LOGFILE=$5
 
function help
{
	echo "Usage: $0 <projectdirectory> <projectname> <targetname> [configuration] [logname]"
    echo "<projectdirectory>  directory of your .xcodeproj file"
	echo "<projectname>       name of your .xcodeproj file"
    echo "<targetname>        name of your build target"
	echo "[configuration]     (optional) Debug or Release, defaults to Release"
	echo "[logname]           (optional) the log file to write to. defaults to stderror.log"
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
 
# check fourth argument, default to "Release"
if [ -z "$CONFIGURATION" ] ; then
	CONFIGURATION=Release
fi
 
# check fifth argument, default to "stderror.log"
if [ -z "$LOGFILE" ] ; then
	LOGFILE=stderr.log
fi
 
# backup existing logfile (start fresh each time)
if [ -f $LOGFILE ]; then
mv $LOGFILE $LOGFILE.bak	
fi
 
cd $PROJECTDIRECTORY
touch -cm www
xcodebuild -configuration $CONFIGURATION -arch i386 -sdk iphonesimulator6.1 -project $PROJECTNAME.xcodeproj -target $TARGETNAME build PRODUCT_NAME=$TARGETNAME
ios-sim launch build/$CONFIGURATION-iphonesimulator/$TARGETNAME.app --family ipad  --stderr $LOGFILE --exit
osascript -e "tell application \"iPhone Simulator\" to activate"
tail -f $LOGFILE 
