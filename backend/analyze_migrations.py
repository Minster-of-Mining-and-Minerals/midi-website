import os
import re
import json

migrations_dir = r"c:\Users\Amanuel Daniel\Desktop\MoM\projects\midi-website-1\backend\migrations"

def analyze_migrations():
    files = sorted([f for f in os.listdir(migrations_dir) if f.endswith('.js')])
    
    analysis = []
    
    # Matching custom and standard Sequelize methods
    create_table_re = re.compile(r'(?:queryInterface\.createTable|createTableIfNotExists)\s*\(\s*queryInterface\s*,\s*[\'"]([^\'"]+)[\'"]', re.IGNORECASE)
    create_table_re2 = re.compile(r'queryInterface\.createTable\s*\(\s*[\'"]([^\'"]+)[\'"]', re.IGNORECASE)

    add_column_re = re.compile(r'(?:queryInterface\.addColumn|addColumnIfNotExists)\s*\(\s*queryInterface\s*,\s*[\'"]([^\'"]+)[\'"]\s*,\s*[\'"]([^\'"]+)[\'"]', re.IGNORECASE)
    add_column_re2 = re.compile(r'queryInterface\.addColumn\s*\(\s*[\'"]([^\'"]+)[\'"]\s*,\s*[\'"]([^\'"]+)[\'"]', re.IGNORECASE)

    add_constraint_re = re.compile(r'(?:queryInterface\.addConstraint|addConstraintIfNotExists)\s*\(\s*(?:queryInterface\s*,\s*)?[\'"]([^\'"]+)[\'"]', re.IGNORECASE)
    
    references_re = re.compile(r'model\s*:\s*[\'"]([^\'"]+)[\'"]')
    
    drop_table_re = re.compile(r'(?:queryInterface\.dropTable|dropTableIfExists)\s*\(\s*(?:queryInterface\s*,\s*)?[\'"]([^\'"]+)[\'"]', re.IGNORECASE)
    remove_column_re = re.compile(r'(?:queryInterface\.removeColumn|removeColumnIfExists)\s*\(\s*(?:queryInterface\s*,\s*)?[\'"]([^\'"]+)[\'"]\s*,\s*[\'"]([^\'"]+)[\'"]', re.IGNORECASE)
    
    for f in files:
        filepath = os.path.join(migrations_dir, f)
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            
        creates = create_table_re.findall(content) + create_table_re2.findall(content)
        adds = add_column_re.findall(content) + add_column_re2.findall(content)
        constraints = add_constraint_re.findall(content)
        refs = references_re.findall(content)
        
        drops = drop_table_re.findall(content)
        removes = remove_column_re.findall(content)
        
        # Deduplicate
        creates = list(set(creates))
        
        analysis.append({
            "file": f,
            "creates": creates,
            "adds": [{"table": a[0], "column": a[1]} for a in adds],
            "constraints": list(set(constraints)),
            "refs": list(set(refs)),
            "drops": drops,
            "removes": [{"table": r[0], "column": r[1]} for r in removes],
            "is_correction": bool(adds or drops or removes or constraints) and not creates
        })
        
    with open('migration_analysis.json', 'w') as out:
        json.dump(analysis, out, indent=2)

if __name__ == "__main__":
    analyze_migrations()
