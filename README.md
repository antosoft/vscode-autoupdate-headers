# Auto Update Headers
A Visual Studio Code extension that fills/updates the version, author, copyright, creation, update fields in the file header when saving the document. Or any text set in the settings, valid as regular expressions.
It also shows at all times the name and version of the project in the status bar.

## Features
When saving document:
  - Show name and version of the project in the status bar from package.json
  - Fill/Update version of project from package.json
  - Fill/Update author field from package.json
  - Fill/Update copyright field from package.json if exist
  - Fill created datetime field by file time stamp if it is empty
  - Fill/Update last modified datetime field

Each of the fields will be detected according to the established configuration.
By default, the following lines will be detected from file header:

```
/*
| Library of functions and utilities of the application 
| 
| version  : 2.0.1
| author   : Antonio da Silva
| copyright: (c) 2000-2022 by AdS Microsistemas Inc.
| created  : 10/02/2000 13:40:21
| updated  : 15/04/2022 03:10:18
+---------------------------------------------------------------*/
```

If it does not work, please check the Line Limit setting. This setting is 8 lines from the beginning of the file by default, so it may be too small for your file.

In addition to the above, there is also the setting of the target file name (Filename Pattern), but by default all files are matched.

## Download
[vscode-autoupdate-headers Latest Build](https://www.adsmicrosistemas.com/download.php?98b05181-12e0-482b-9636-01be4f3e09a1)

## Author
[antosoft](https://github.com/antosoft)

## Original Author
[Special thanks to: lpubsppop01](https://github.com/lpubsppop01)

## License
[zlib License](https://github.com/antosoft/vscode-autoupdate-headers/raw/main/LICENSE.txt)
