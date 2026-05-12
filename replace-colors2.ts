import fs from 'fs';
import path from 'path';

const replaceColors = (dir: string) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceColors(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/bg-indigo-600 hover:bg-indigo-700 text-white/g, 'bg-slate-900 hover:bg-slate-800 text-white');
      fs.writeFileSync(fullPath, content);
      console.log(`Updated ${fullPath}`);
    }
  }
};

replaceColors('./src');
