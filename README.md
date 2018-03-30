# Dropbox Public Folder semi-fix
Dropbox used to offer a Public folder. This was an awesome thing: drop a file or folder in it, wait for it to sync and it would be instantly, publicly accessible. They stopped supporting this. This script is here to fix that, partially anyways. It watches a folder on your current machine, and upon changes `rsync`s it to a public server you specify.

## Requirements
You'll need to install `fswatch`, usually fixed with a simple `brew install fswatch`.
You'll also need to have access to some kind of public-facing webserver, ideally with a passwordless (SSH-key based) login.

## Usage
Make sure you've `chmod +x` the script. Rename it to whatever you like. This example assumes you've called it `dropbox-alt.sh`. Then:
```
./dropbox-alt.sh -f /path/to/folder/to/watch/ -r /path/to/remote/folder -u user -h host
```
If you need rsync to ignore certain files, you can pass the `-i` flag and specify a file that contains the ignore regexes. Really simple, works just like `.gitignore` does.

### If you have an SSH `config` file
You can pass an additional flag `-s` with the SSH shortcut, then you don't have to pass the `-u` and `-h` flags. If `vps` were in your SSH conf:
```
./dropbox-alt.sh -f /path/to/folder/to/watch/ -r /path/to/remote/folder -s vps
```

## Rant
Dropbox incessantly wages a war against their own users. Over the years, they changed this public folder functionality. First, they added all kinds of JavaScript trash to place the file in a "viewer", I suppose to get better tracking stats on their users. Then this past year, they announced they were fully stopping the "Public" folder functionality altogether.
After their [seriously concerning shenanigans](http://applehelpwriter.com/2016/07/28/revealing-dropboxs-dirty-little-security-hack/) on macOS to gain permissions (what the fuck Dropbox?), this was the final reason for me to remove Dropbox entirely from my machine. Here is how to replace at least part of the functionality.