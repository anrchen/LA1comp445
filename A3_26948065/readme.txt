README
Tyler Ramsay #26948065
LA3 Comp 445

To run in docker:
    Get the image
        docker pull mc2labs/nodejs
    For each instance
        docker run --rm -it -v $PWD:/run -w /run -u $UID mc2labs/nodejs /bin/bash
    Run with
        node sender.js