const fs = require('fs');
let content = fs.readFileSync('native-app/app/(app)/index.tsx', 'utf8');
content = content.replace(
  /<View\n                key=\{task\.id\} onPress/g,
  '<Pressable\n                key={task.id} onPress'
);
content = content.replace(
  /                  \)\}\n                \<\/View\>\n              \<\/View\>\n            \);\n          \}\)\}/g,
  '                  )}\n                </View>\n              </Pressable>\n            );\n          })}'
);
fs.writeFileSync('native-app/app/(app)/index.tsx', content);
