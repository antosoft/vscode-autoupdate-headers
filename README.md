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
| version  : 1.1.20
| author   : Antonio da Silva <adsmicrosistemas@gmail.com>
| copyright: (c) 2022 by AdS Microsistemas
| created  : 14/04/2022 20:24:36
| updated  : 16/04/2022 23:39:57
+---------------------------------------------------------------------------- */
```

## Troubleshooting
If it does not work, please check the Line Limit setting. This setting is 8 lines from the beginning of the file by default, so it may be too small for your file.
In addition to the above, there is also the setting of the target file name (Filename Pattern), but by default all files are matched.

You can also directly add the following configuration lines to settings.json file.
```
  "antosoft.autoUpdateHeader.filenamePattern": ".*",
  "antosoft.autoUpdateHeader.lineLimit": 8,
  "antosoft.autoUpdateHeader.valueVersion": "<version>",
  "antosoft.autoUpdateHeader.versionStart": "[vV]ersion *:",
  "antosoft.autoUpdateHeader.versionEnd": "$",
  "antosoft.autoUpdateHeader.valueAuthor": "<author>",
  "antosoft.autoUpdateHeader.authorStart": "[aA]uthor *:",
  "antosoft.autoUpdateHeader.authorEnd": "$",
  "antosoft.autoUpdateHeader.valueCopyright": "<copyright>",
  "antosoft.autoUpdateHeader.copyrightStart": "[cC]opyright *:",
  "antosoft.autoUpdateHeader.copyrightEnd": "$",
  "antosoft.autoUpdateHeader.birthTimeStart": "[cC]reated *:",
  "antosoft.autoUpdateHeader.birthTimeEnd": "$",
  "antosoft.autoUpdateHeader.modifiedTimeStart": "[uU]pdated *:",
  "antosoft.autoUpdateHeader.modifiedTimeEnd": "$",
  "antosoft.autoUpdateHeader.momentFormat": "DD/MM/YYYY HH:mm:ss",
```

## Download
[vscode-autoupdate-headers Latest Build](https://www.adsmicrosistemas.com/download.php?98b05181-12e0-482b-9636-01be4f3e09a1)

## Author
[antosoft](https://github.com/antosoft)

## Original Author
[Special thanks to: lpubsppop01](https://github.com/lpubsppop01)

## License
[zlib License](https://github.com/antosoft/vscode-autoupdate-headers/raw/main/LICENSE.txt)
