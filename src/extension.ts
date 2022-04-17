/*
| Auto Update Headers - Visual Studio Code Extension.
| 
| version  : 1.1.20
| author   : Antonio da Silva <adsmicrosistemas@gmail.com>
| copyright: (c) 2022 by AdS Microsistemas
| created  : 14/04/2022 20:24:36
| updated  : 16/04/2022 23:44:29
+---------------------------------------------------------------------------- */
'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as moment from 'dayjs';
import * as path from 'path';
import { readFile } from 'fs/promises';

let myStatusBarItem;
let packageJsonFile;
let packageJson;

export function activate(context: vscode.ExtensionContext) {
  packageJsonFile = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'package.json');

  createStatusBarItem();
  updateStatusBar();
  myStatusBarItem.show();

  const config = new ExtensionConfiguration();
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
    config.onDidChangeConfiguration();
  }));

  const core = new ExtensionCore(config);
  context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(e => {
    updateStatusBar();
    core.onWillSaveTextDocument(e);
  }));
}

export function deactivate() {
}

async function updateStatusBar() {
  const packageFile = await readFile(packageJsonFile);
  packageJson = JSON.parse(packageFile.toString());

  const projectName = packageJson['name'];
  const version = packageJson['version'];

  myStatusBarItem.text = '$(versions) ' + projectName + ' ' + 'v' + version
};

function createStatusBarItem() {
  if (myStatusBarItem === undefined) {
    myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    myStatusBarItem.tooltip = 'Current version of App';
  }
};


class ExtensionCore {
  
  private m_config: ExtensionConfiguration;

  public constructor(config: ExtensionConfiguration) {
    this.m_config = config;
  }

  public onWillSaveTextDocument(e: vscode.TextDocumentWillSaveEvent) {
    if (!e.document.fileName.match(this.m_config.fileNamePattern)) return;
    var edits: vscode.TextEdit[] = [];
    const lineIndices = this.getIndexRangeUntil(this.m_config.lineLimit, e.document.lineCount);

    let itemsToSearch = ['version', 'author', 'copyright'];
    for (const iLine of lineIndices) {
      const line = e.document.lineAt(iLine);
      let year1, year2, timeStr;

      const birthTimeRange = this.getTextRangeBetween(line,
        this.m_config.birthTimeStart, this.m_config.birthTimeEnd);
      const stats = fs.statSync(e.document.fileName);
      timeStr = moment(stats.birthtime).format(this.m_config.momentFormat);
      year1 = moment(stats.birthtime).format('YYYY');
      if (birthTimeRange != null) {
        const chars = (birthTimeRange.end.character - birthTimeRange.start.character);
        if (chars <= 8 || birthTimeRange.isEmpty) {
          edits.push(vscode.TextEdit.replace(birthTimeRange, ` ${timeStr}`));
        }
      }

      const modifiedTimeRange = this.getTextRangeBetween(line,
        this.m_config.modifiedTimeStart, this.m_config.modifiedTimeEnd);
      timeStr = moment().format(this.m_config.momentFormat);
      year2 = moment().format('YYYY');
      if (modifiedTimeRange != null) {
        edits.push(vscode.TextEdit.replace(modifiedTimeRange, ` ${timeStr}`));
      }

      itemsToSearch.forEach((item: string) => {
        const cfgName = `value${item[0].toUpperCase() + item.slice(1).toLowerCase()}`;
        let configText = this.m_config[cfgName];
        let pkgValue = configText;

        if (configText != '') {
          const pkgItem = packageJson[item];

          if (item === 'copyright') {
            let yrdCopy = year2;
            if (year1 && year2) yrdCopy = (year1 !== year2) ? `${year1}-${year2}`: `${year1}`;
            
            if (configText === `<${item}>`) {
              pkgValue = ''
              if (yrdCopy && pkgItem) pkgValue = `(c) ${yrdCopy} by ${pkgItem}`;
            }
          } else {
            if (configText === `<${item}>`) pkgValue = (pkgItem) ? pkgItem : '';
          }
        }

        const itemRange = this.getTextRangeBetween(line, this.m_config[`${item}Start`], this.m_config[`${item}End`]);
        if (itemRange != null) {
          itemsToSearch = itemsToSearch.filter(elem => elem !== item);
          edits.push(vscode.TextEdit.replace(itemRange, ` ${pkgValue}`));
        }
      });
    }
    e.waitUntil(Promise.resolve(edits));
  }

  private getIndexRangeUntil(limit: number, count: number): number[] {
    const indices: number[] = [];
    if (limit > 0) {
      let i = 0;
      const iMax = Math.min(limit, count);
      while (i < iMax) {
        indices.push(i++);
      }
    } else {
      let i = count - 1;
      const iMin = Math.max(count + limit, 0);
      while (i >= iMin) {
        indices.push(i--);
      }
    }
    return indices;
  }

  private getTextRangeBetween(line: vscode.TextLine, startPattern: RegExp, endPattern): vscode.Range {
    const startResult = line.text.match(startPattern);
    if (startResult == null) return null;

    const iRangeStart = startResult.index + startResult[0].length;
    const endResult = line.text.substr(iRangeStart).match(endPattern);
    if (endResult == null) return null;

    const iRangeEnd = iRangeStart + endResult.index;
    const startPos = new vscode.Position(line.lineNumber, iRangeStart);
    var endPos = new vscode.Position(line.lineNumber, iRangeEnd);

    return new vscode.Range(startPos, endPos);
  }

}

class ExtensionConfiguration {

  private m_config: vscode.WorkspaceConfiguration;

  private m_fileNamePattern: RegExp;

  private m_versionStart: RegExp;
  private m_versionEnd: RegExp;
  private m_authorStart: RegExp;
  private m_authorEnd: RegExp;
  private m_copyrightStart: RegExp;
  private m_copyrightEnd: RegExp;

  private m_birthTimeStart: RegExp;
  private m_birthTimeEnd: RegExp;
  private m_modifiedTimeStart: RegExp;
  private m_modifiedTimeEnd: RegExp;


  public constructor() {
    this.m_config = vscode.workspace.getConfiguration("antosoft.autoUpdateHeader");
  }

  public onDidChangeConfiguration() {
    this.m_config = vscode.workspace.getConfiguration("antosoft.autoUpdateHeader");

    this.m_fileNamePattern = null;

    this.m_versionStart = null;
    this.m_versionEnd = null;
    this.m_authorStart = null;
    this.m_authorEnd = null;
    this.m_copyrightStart = null;
    this.m_copyrightEnd = null;

    this.m_birthTimeStart = null;
    this.m_birthTimeEnd = null;
    this.m_modifiedTimeStart = null;
    this.m_modifiedTimeEnd = null;
  }

  private getValue<T>(propertyName: string, defaultValue: T): T {
    if (this.m_config == null) return defaultValue;
    const value = this.m_config.get<T>(propertyName);
    return value != null ? value : defaultValue;
  }

  public get fileNamePattern(): RegExp {
    if (this.m_fileNamePattern == null) {
      this.m_fileNamePattern = new RegExp(this.getValue<string>("filenamePattern", ".*"));
    }
    return this.m_fileNamePattern;
  }

  public get lineLimit(): number {
    return this.getValue<number>("lineLimit", 8);
  }

  // Version...
  public get valueVersion(): string {
    return this.getValue<string>("valueVersion", "<version>");
  }
  public get versionStart(): RegExp {
    if (this.m_versionStart == null) {
      this.m_versionStart = new RegExp(this.getValue<string>("versionStart", "[vV]ersion *:"));
    }
    return this.m_versionStart;
  }
  public get versionEnd(): RegExp {
    if (this.m_versionEnd == null) {
      this.m_versionEnd = new RegExp(this.getValue<string>("versionEnd", "$"));
    }
    return this.m_versionEnd;
  }

  // Author...
  public get valueAuthor(): string {
    return this.getValue<string>("valueAuthor", "<author>");
  }
  public get authorStart(): RegExp {
    if (this.m_authorStart == null) {
      this.m_authorStart = new RegExp(this.getValue<string>("authorStart", "[aA]uthor *:"));
    }
    return this.m_authorStart;
  }
  public get authorEnd(): RegExp {
    if (this.m_authorEnd == null) {
      this.m_authorEnd = new RegExp(this.getValue<string>("authorEnd", "$"));
    }
    return this.m_authorEnd;
  }

  // Copyright...
  public get valueCopyright(): string {
    return this.getValue<string>("valueCopyright", "<copyright>");
  }
  public get copyrightStart(): RegExp {
    if (this.m_copyrightStart == null) {
      this.m_copyrightStart = new RegExp(this.getValue<string>("copyrightStart", "[cC]opyright *:"));
    }
    return this.m_copyrightStart;
  }
  public get copyrightEnd(): RegExp {
    if (this.m_copyrightEnd == null) {
      this.m_copyrightEnd = new RegExp(this.getValue<string>("copyrightEnd", "$"));
    }
    return this.m_copyrightEnd;
  }

  public get birthTimeStart(): RegExp {
    if (this.m_birthTimeStart == null) {
      this.m_birthTimeStart = new RegExp(this.getValue<string>("birthTimeStart", "[cC]reated *:"));
    }
    return this.m_birthTimeStart;
  }

  public get birthTimeEnd(): RegExp {
    if (this.m_birthTimeEnd == null) {
      this.m_birthTimeEnd = new RegExp(this.getValue<string>("birthTimeEnd", "$"));
    }
    return this.m_birthTimeEnd;
  }

  public get modifiedTimeStart(): RegExp {
    if (this.m_modifiedTimeStart == null) {
      this.m_modifiedTimeStart = new RegExp(this.getValue<string>("modifiedTimeStart", "[uU]pdated *:"));
    }
    return this.m_modifiedTimeStart;
  }

  public get modifiedTimeEnd(): RegExp {
    if (this.m_modifiedTimeEnd == null) {
      this.m_modifiedTimeEnd = new RegExp(this.getValue<string>("modifiedTimeEnd", "$"));
    }
    return this.m_modifiedTimeEnd;
  }

  public get momentFormat(): string {
    return this.getValue<string>("momentFormat", "DD/MM/YYYY HH:mm:ss");
  }

}