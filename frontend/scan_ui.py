import os
import re

FEATURES_DIR = r"c:\Users\Amanuel Daniel\Desktop\MoM\projects\midi-website-1\frontend\src\features"

def scan():
    for root, dirs, files in os.walk(FEATURES_DIR):
        for file in files:
            if not (file.endswith('.tsx') or file.endswith('.ts')):
                continue
            
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            issues = []
            
            # Check ActionButtons
            action_blocks = re.findall(r'const actions: ActionButton\[\] = \[(.*?)\];', content, re.DOTALL)
            for block in action_blocks:
                items = re.split(r'},\s*{', block)
                for item in items:
                    if 'onClick:' in item and 'permissions:' not in item:
                        issues.append("ActionButton missing permissions")
                        
            # Check for unprotected Buttons in columns or render
            # This is harder, but let's look for <Button that has onClick or href that implies mutation
            # and is NOT preceded by <ComponentGuard
            
            # Just look for <Button ... onClick ... handleToggle/handleReset/handleDelete/etc
            buttons = re.findall(r'<Button[^>]*onClick={[^}]*(?:Delete|Toggle|Reset|Edit|Update|Submit|Approve|Reject)[^}]*}[^>]*>', content)
            for btn in buttons:
                # Find if it's inside ComponentGuard. We can do a simple check:
                # count <ComponentGuard vs </ComponentGuard> before this button? Too hard.
                # Instead, check if the file even imports ComponentGuard
                if 'ComponentGuard' not in content:
                    issues.append(f"Unprotected Button and no ComponentGuard import: {btn[:30]}...")
            
            if issues:
                print(f"--- {file} ---")
                for issue in issues:
                    print(f"  {issue}")

if __name__ == "__main__":
    scan()
