const fs = require('fs');
let content = fs.readFileSync('native-app/app/(app)/index.tsx', 'utf8');
content = content.replace(
  /<View\n                key=\{task\.id\} onPress/g,
  '<Pressable\n                key={task.id} onPress'
);
fs.writeFileSync('native-app/app/(app)/index.tsx', content);
