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
      content = content.replace(/neutral-/g, 'slate-');
      content = content.replace(/blue-/g, 'indigo-');
      content = content.replace(/orange-/g, 'amber-');
      content = content.replace(/text-slate-900/g, 'text-slate-800');
      fs.writeFileSync(fullPath, content);
      console.log(`Updated ${fullPath}`);
    }
  }
};

replaceColors('./src');
