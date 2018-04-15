# Run As

[![Marketplace](https://vsmarketplacebadge.apphb.com/version/plylrnsdy.run-as.svg)](https://marketplace.visualstudio.com/items/plylrnsdy.run-as) [![Installs](https://vsmarketplacebadge.apphb.com/installs/plylrnsdy.run-as.svg)](https://marketplace.visualstudio.com/items/plylrnsdy.run-as) [![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/plylrnsdy.run-as.svg)](https://marketplace.visualstudio.com/items/plylrnsdy.run-as)

Configure, then right click a file to run/open it.

### README in Other Languages
<center><a href="https://github.com/plylrnsdy/vscode-run-as/raw/master/docs/README.zh-cn.md">简体中文</a></center>

## Useage

After configuration, right Click a file, then select menu item "Run As ...".

![preview](https://github.com/plylrnsdy/vscode-run-as/raw/master/images/run-in-inner-terminal.gif)

## Features

1. **Right Click a file**, then
    - Run `*.js` in node
    - Run `*.spec.js` in mocha
    - Run `*.ts` corresponding compiled `*.js` in node
    - Run `*.spec.ts` corresponding compiled `*.spec.js` in mocha 
    - Run `*.bat`, `*.cmd`, `*.sh` in terminal
    - to run a **task** by right-clicking a script instead of typing a command
        - run a **server** in a new terminal windows
        - run a **watcher** in a new terminal windows
        - and so on
    - Open `binary file`
        - in default application
        - in the application you like
    - and so on
2. Automatic switch working directory when run different file in different folder in workspace.

## Configuration

Open VSCode `setting` (Ctrl+Comma), search for "runas" to change configuration:

### 1. Globs-to-command mapping

```json
"RunAs.globsMapToCommand": [{
    "globs": "*.*",
    "command": {
        "win32": "start ${rPath}",
        "linux": "see ${rPath}",
        "darwin": "open ${rPath}"
    },
    "exceptions": [{
        "globs": "*.@(bat|cmd|exe)",
        "command": "${rPath}",
        "exceptions": [{
            "globs": "*.watcher.@(bat|cmd)",
            "command": "@out ${rPath}"
        }]
    }, {
        "globs": "**/@(src|test)/**/*.ts",
        "command": "node ${`out/${dir}/${sFile}.js`}",
        "exceptions": [{
            "globs": "*.spec.ts",
            "command": "@in mocha ${file.replace(/(\\/(?:src|test)\\/)/, '/out$1').replace(/ts$/, 'js')}"
        }]
    }]
}]
```

#### 1.1 [globs][globs]

A pattern to match file's path name.

**PS:** you need to use `\\` instead of `\` to _escape_ character in Globs.

#### 1.2 command

The command run in shell after selecting menu item "Run as ...".

**1.2.1 command template(s)**

- a general command, example: `"node ${rPath}"`
- or a platform-to-command map, example: `{ "win32": "start ${rPath}", "linux": "see ${rPath}", "darwin": "open ${rPath}" }`.

**1.2.2 command argument: path**

a javascript code snippet, it looks like `${/* javascript */}`. it can be: 

1. a **variable**, example: `${rPath}`
2. a **template string**, example: `` ${`out/${dir}/${sFile}.js`} ``
    - see: [Table: Variable Meaning](#table-variable-meaning)
3. a **javascript code snippet**, example: `${file.replace(/(\\/(?:src|test)\\/)/, '/out$1').replace(/ts$/, 'js')}`, this code snippet in default configuration means right click to run *.ts but actually execute the *.js in folder `out`.
    - **PS:** you need to use `\\` instead of `\` to _escape_ character in RegExp literal.

**1.2.3 command prefix: `@in`, `@out`**

If you want to execute a command in new terminal window or not, no matter whether `"RunAs.runInNewTerminalWindows.enable"` is true or false. You can add a prefix `@out ` or `@in ` in command.

#### 1.3 exceptions

A array of globs-to-command mapping, files matched one of them will execute itself command instead of it's parent's command.

#### Table: Variable Meaning
| variable | meaning                                          | example                                   |
| -------- | ------------------------------------------------ | ----------------------------------------- |
| `file`    | full path of the file which you right clicked    | `D:\projects\project\src\common\module.ts` |
| `root`    | the folder opened in vscode                      | `D:\projects\project`                      |
| `rPath`   | the relative path from `root` to file             | `src\common\module.ts`                     |
| `dir`     | the relative path from `root` to file's directory | `src\common`                               |
| `lFile`   | the file's name with extension                   | `module.ts`                                |
| `sFile`   | the file's name without extension                | `module`                                   |
| `ext`     | the file's extension                             | `ts`                                       |

### 2. Execute command in a new terminal windows

```json
"RunAs.runInNewTerminalWindows": {
    "enable": false,
    "globs": "New Terminal Window",
    "command": {
        "win32": "Start-Process cmd -ArgumentList '/c ${command}'",
        "linux": "gnome-terminal -x bash -c '${command}'"
    }
}
```

In `"RunAs.runInNewTerminalWindows.commands"`,
- the key is platform string in VSCode:
    - Windows: `"win32"`,
    - Linux: `"linux"`
    - Mac OS: `"darwin"`
- the value is the command to execute command in a new terminal windows in this platform, e.g. `"start ${command}"`.
    - `${command}` will be replaced by the command in globs-to-command mapping.

You can run the command in a new terminal windows in default by change `"RunAs.runInNewTerminalWindows.enable"` to `true`, or you can use the prefix `@out` in the command to use it alone.

## Install

Press `F1` in VSCode, type `ext install` and then look for `"Run as ..."` .

## Known Issue

- I do not know how to pass a command to a new terminal to execute it in Mac OS, but you can configure it by yourself.

## Issues

Submit the [issues][issues] if you find any bug or have any suggestion.

## Contribution

Fork the [repository][repository] and submit pull requests.

## About

Author：plylrnsdy

Github：[vscode-run-as][repository]



[globs]:https://github.com/isaacs/node-glob
[issues]:https://github.com/plylrnsdy/vscode-run-as/issues
[repository]:https://github.com/plylrnsdy/vscode-run-as