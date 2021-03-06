const fs = require('fs');
const path = require('path');

let dir;

// default config
let config = {
    removeLockString: false,
};

exports.moduleroot = __dirname;

exports.setcwd = function(cwd) {
    dir = cwd;
}

function displayFiles(files, currentDir, query) {
    let data = [];
    files.forEach(function (file) {
        let f =
            fs.statSync(path.join(currentDir, file));
        if (f.isDirectory()) {
            data.push({
                Name : file,
                IsDirectory: true,
                Path : path.join(query, file),
                Modified : f.mtimeMs
            });
        }
        else if (f.isFile()) {
            let ext = path.extname(file);
            let filestr;
            if (config.removeLockString) {
                filestr = file.replace('.lock','');
            } else {
                filestr = file;
            }
            let rstr = '';
            if (currentDir !== dir) {
                rstr = currentDir;
            }
            data.push({
                Name : filestr,
                Ext : ext,
                IsDirectory: false,
                Path : path.join(query, file),
                Root : rstr,
                Size : f.size,
                Modified : f.mtimeMs
            });
        }
    });
    return data;
}

function readRoots(roots, res, query, fullList) {
    let currentDir = roots.shift();

    fs.readdir(currentDir, function (err, files) {
        let data;
        if (err) {
            data = fullList;
        } else {
            data = fullList.concat(displayFiles(files, currentDir, query));
        }

        if (roots.length > 0) {
            readRoots(roots, res, query, data);
        } else {
            res.json(data.sort(function(f) { return f.Name }));
        }
    });

}

exports.get = function(req, res) {
    let currentDir =  dir;
    let query = req.query.path || '';
    let roots = [];
    roots.push(path.join(dir, query));
    readRoots(roots, res, query, []);
};

exports.configure = function(c) {
    if (!c) return;
    config = c;
}
