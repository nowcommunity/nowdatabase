# Troubleshooting

## Vite can't access files, insufficient file permissions after git cloning, pulling etc.

Especially on Cubbli Linux, default file permissions for newly created files and folders can be too limited for docker to be able to access the files.
To see what these default permissions are, run the umask:
```
$ umask
```

The number printed will be the inverse of the default permissions.
For example if it's `077` it means that group and all-user permissions will both be set to none for new files and directories.
This is likely to cause problems while running this app using Docker.

To fix this edit the file `/etc/login.defs`.
In that file, there exists a line such as this:
```
UMASK		077
```

Change the number to 022:
```
UMASK		022
```

