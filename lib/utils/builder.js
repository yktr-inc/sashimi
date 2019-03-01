const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] || 'dv';
const baseDir = process.cwd();
const fullDir = `${baseDir}/src/${targetDir}`;
const dest = `${baseDir}/src/.build`;

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files)
    {
      const dirFile = path.join(dir, file);
      const dirent = fs.statSync(dirFile);
      if (dirent.isDirectory()) {
        var odir = { file: dirFile, files: [] }
        odir.files = walkSync(dirFile, dir.files);
        filelist.push(odir);
      } else {
       filelist.push({ file: dirFile });
     }
   }
   return filelist;
};

const readFile = path => {
    return fs.readFileSync(path, 'utf8', (err, data) => {
      if (err) throw err;
      return data.toString();
  });
}

const parseComponent = file => {
  let content = readFile(file);
  let newContent = '';

  newContent += matchImport(content);
  const tags = matchReturn(content);

  createTagTree(tags);

  return newContent;
}

const getTagAttributes = tag => {
  const myRegexp = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/igm;
  let match = myRegexp.exec(tag);
  const properties = {};

  while (match != null) {
    properties[match[1]] = match[2];
    match = myRegexp.exec(tag);
  }

  return properties;
}

const getTagNature = tag => {
  const regexSelfClosing = /(\w+)(\s)?\/>/i;
  let match = regexSelfClosing.exec(tag);

  if(match !== null){
    return { nature: 'selfClosing', tag: match[1]};
  }

  const regexOpening = /<(\w+)/i;
  match = regexOpening.exec(tag);

  if(match !== null){
    return { nature: 'opening', tag: match[1]};
  }

  const regexClosing = /(\w+)>/i;
  match = regexClosing.exec(tag);

  if(match !== null){
    return { nature: 'closing', tag: match[1]};
  }

  return false;

}

const createTagTree = tags => {

  const tagTree = [];

  const tree = tags.map(tag => getTagAttributes(tag));
  for(let i = 0; i < tags.length; i++)
  {
    //console.log(tags[i]);
    console.log(getTagNature(tags[i]));
    let last = tags[tags.length - i];
    //console.log(last);
  }

  //console.log(tree);
}

const matchReturn = content => {
  let newContent = '';

  const myRegexp = /(\=\>).*/gm;
  let match = myRegexp.exec(content);
  let returnValue = match[0].substring(2);

  const myRegexp2 = /(<([^>]+)>)/igm;
  match = myRegexp2.exec(returnValue);

  let arr = [];

  while (match != null) {
    arr.push(match[0]);
    match = myRegexp2.exec(content);
  }
  arr.shift();

  return arr;
}

const matchImport = content => {
  let newContent = '';

  const myRegexp = /^.*\b(import)\b.*$/gm;
  let match = myRegexp.exec(content);
  while (match != null) {
    newContent += `${match[0]}\n`;
    match = myRegexp.exec(content);
  }

  return newContent;
}

const convertComponents = files => {
  files.map(file => parseComponent(file.file) );
};

const files = walkSync(fullDir);

convertComponents(files);


