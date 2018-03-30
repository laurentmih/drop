// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Necessary for launching scripts
const { spawn } = require('child_process');

// For communication to main.js
const ipc = require('electron').ipcRenderer;

// Helper function

function registerPid(process) {
	ipc.send('register-pid', process.pid);
}

function deregisterPid(process) {
	ipc.send('deregister-pid', process.pid);
}

function parseForm(form) {
	var FD = new FormData(form);
	var localPath = FD.get('localpath');
	var remotePath = FD.get('remotepath');
	var remoteUser = FD.get('remoteuser');
	var remoteHost = FD.get('remotehost');

	var destination = remoteUser + '@' + remoteHost;
	var syncing = document.getElementById('syncing');

	// Initial file sync
	console.log('Running initial file sync...')
	syncing.style.visibility = "visible";

	if (ignoreFile != '') {
		// There is an ignore file specified [functionality not yet supported]
		console.log('initial sync with ignore file');
		// https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a
		const rsync = spawn('rsync', [
			'-rhzP',
			'--delete',
			'--exclude-from',
			ignoreFile,
			localPath,
			destination + ":" + remotePath
		]);
		registerPid(rsync);
		window.rsync = rsync;
		rsync.on('exit', function (code, signal) {
			syncing.style.visibility = "hidden";
			deregisterPid(rsync);
		});
	} else {
		// No ignore file
		console.log('initial sync without ignore file');
		const rsync = spawn('rsync', [
			'-rhzP',
			'--delete',
			localPath,
			destination + ":" + remotePath
		]);
		registerPid(rsync);
		window.rsync = rsync;
		rsync.on('exit', function (code, signal) {
			syncing.style.visibility = "hidden";
			deregisterPid(rsync);
		});
	};

	// Watch the folder
	const fswatch = spawn('fswatch', [
		'-o',
		'-l',
		'1',
		localPath
	]);

	console.log('fswatch launched')
	registerPid(fswatch);
	window.fswatch = fswatch;

	// Run rsync on changes
	fswatch.stdout.on('data', (data) => {
		console.log('Changes detected, syncing...')
		syncing.style.visibility = "visible";
		if (ignoreFile != '') {
			// There is an ignore file specified
			const rsync_monitor = spawn('rsync', [
				'-rhzP',
				'--delete',
				'--exclude-from',
				ignoreFile,
				localPath,
				destination + ":" + remotePath
			]);
			registerPid(rsync_monitor);
			window.rsync_monitor = rsync_monitor;
			rsync_monitor.on('exit', function (code, signal) {
				syncing.style.visibility = "hidden";
				deregisterPid(rsync_monitor);
			});
		} else {
			// No ignore file
			const rsync_monitor = spawn('rsync', [
				'-rhzP',
				'--delete',
				localPath,
				destination + ":" + remotePath
			]);
			registerPid(rsync_monitor);
			window.rsync_monitor = rsync_monitor;
			rsync_monitor.on('exit', function (code, signal) {
				syncing.style.visibility = "hidden";
				deregisterPid(rsync_monitor);
			});
		};
	})

	var log = document.getElementById('logBody');

	// Update UI to show you can't click the button again
	submitButton = document.getElementById('submitbutton');
	killButton = document.getElementById('killbutton');

	submitButton.classList.add("disabled");
	killButton.classList.remove("disabled");


	fswatch.on('exit', function (code, signal) {
		// If signal == null, all is normal
		console.log('fswatch process exited with ' + `code ${code} and signal ${signal}`);
	});

	// child.stdout.on('data', (data) => {
	// 	console.log(`child stdout:\n${data}`);
	// 	log.innerHTML += `<p>${data}</p>`;
	// 	log.scrollTop = log.scrollHeight;
	// });

}

// Intercept form submission
window.addEventListener("load", function() {
	var form = document.getElementById('watchform');
	var killButton = document.getElementById('killbutton');
	var submitButton = document.getElementById('submitbutton');
	var clearLogButton = document.getElementById('clearlog');

	form.addEventListener("submit", function (event) {
		event.preventDefault();
		if (!submitButton.classList.contains('disabled')){
			parseForm(form);
		}
	})

	clearLogButton.addEventListener("click", function (event) {
		event.preventDefault();
		document.getElementById('logBody').innerHTML = "";
	})

	killButton.addEventListener("click", function(event) {
		if (!killButton.classList.contains('disabled')) {
			var rsync = window.rsync;
			var fswatch = window.fswatch;
			var rsync_monitor = window.rsync_monitor;

			try {
				deregisterPid(fswatch);
				fswatch.kill();
			} catch(err) {
				delete window.childProcess;
				console.log("Could not find fswatch process, probably exited, clearing variable.")
			}

			try {
				deregisterPid(rsync);
				rsync.kill();
			} catch(err) {
				delete window.childProcess;
				console.log("Could not find initial rsync process, probably exited, clearing variable.")
			}

			try {
				deregisterPid(rsync_monitor);
				rsync_monitor.kill();
			} catch(err) {
				delete window.childProcess;
				console.log("Could not find rsync_monitor process, probably exited, clearing variable.")
			}

			submitButton.classList.remove("disabled");
			killButton.classList.add("disabled");
		}
	})
})