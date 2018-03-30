# Description
ElectronJS-powered home-grown alternative to the Public Folder-functionality that Dropbox used to provide, now sort-of-does-but-not-really-anymore. To download, head over to the [releases](https://github.com/laurentmih/drop/releases/tag/v1.0.0-beta1) page.

## Requirements
Only runs on macOS. Uses `rsync`.  
Depends on `fswatch`, which can be installed using `brew install fswatch`.  
Requires you to have your own server with a publicly accessible folder (usually something like `/var/www/html`), and a user that can write to it, with password-less login (i.e. with SSH keys) enabled.

## Use cases
In my case, it's useful during web development. Write some `.js` file, upload it publicly and include on whichever page you're working on. Quick edits are rapidly synced to the cloud.  
Basically a useful tool when you're quick-fix debugging something.

## Disclaimers
Uses `rsync` and `fswatch`. 

## How to use
Should be fairly self-explanatory. Provide the local folder, remote folder to sync to, the host/IP and username to log in with. Hit start when you're ready to go.

## Debugging
There's a log at the bottom, click to expand.