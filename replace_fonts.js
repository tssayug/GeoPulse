import fs from 'fs';
import path from 'path';

const dir = './src/widgets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
files.push('../components/WidgetWrapper.tsx');
files.push('../views/DashboardView.tsx');

files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace sequentially using placeholders to prevent double replacement
    content = content.replace(/text-\[10px\]/g, '__TEMP_SM__');
    content = content.replace(/text-\[9px\]/g, '__TEMP_XS__');
    content = content.replace(/text-\[8px\]/g, '__TEMP_XS__');
    
    content = content.replace(/\btext-sm\b/g, '__TEMP_BASE__'); // Bump existing sm to base
    content = content.replace(/\btext-xs\b/g, '__TEMP_SM__');
    
    content = content.replace(/__TEMP_BASE__/g, 'text-base');
    content = content.replace(/__TEMP_SM__/g, 'text-sm');
    content = content.replace(/__TEMP_XS__/g, 'text-xs');
    
    fs.writeFileSync(fullPath, content);
});
console.log('Font sizes increased across all widgets.');
