Tyler Ramsay #26948065
LA2 Comp 445

Make sure node and all the dependencies are installed.

To get a cURL like app, follow this installation:
    Add the following bash function in your .bash_profile, where
    "PATH_TO_’server.js'_FOLDER" is the path to the to the folder 
    containing server.js.

httpfs () {
        CURR_DIR=$(pwd);
        cd PATH_TO_’server.js'_FOLDER;
        node server.js "$@";
        cd $CURR_DIR;
}

After sourceing your file ('. .bash_profile'), you can now call
httpfs from any folder on your computer; type 'httpfs —-help' to get 
started.