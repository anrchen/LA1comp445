Tyler Ramsay #26948065
LA1 Comp 445

Make sure node is installed.

To get a cURL like app, follow this installation:
    Add the following bash function in your .bash_profile, where
    "PATH_TO_'client.js'_FOLDER" is the path to the to the folder 
    containing client.js.

httpc () {
        CURR_DIR=$(pwd);
        cd PATH_TO_'client.js'_FOLDER;
        node client.js "$@";
        cd $CURR_DIR;
}

After sourceing your file ('. .bash_profile'), you can now call
httpc from any folder on your computer; type 'httpc help' to get 
started.