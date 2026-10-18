import os
import re

MIGRATIONS_DIR = r"c:\Users\Amanuel Daniel\Desktop\MoM\projects\midi-website-1\backend\migrations"
SEEDERS_DIR = r"c:\Users\Amanuel Daniel\Desktop\MoM\projects\midi-website-1\backend\seeders"

def run_audit():
    migrations = sorted([f for f in os.listdir(MIGRATIONS_DIR) if f.endswith('.js')])
    seeders = sorted([f for f in os.listdir(SEEDERS_DIR) if f.endswith('.js')])
    
    # 1. Migration Statistics
    stats = {
        "CREATE": 0, "ALTER": 0, "CORRECTIVE": 0, "DATA": 0, "SYNC": 0, "OTHER": 0
    }
    
    inventory = []
    
    table_re = re.compile(r'(?:createTable|createTableIfNotExists)\s*\(\s*(?:queryInterface\s*,\s*)?[\'"]([^\'"]+)[\'"]')
    add_col_re = re.compile(r'(?:addColumn|addColumnIfNotExists)\s*\(\s*(?:queryInterface\s*,\s*)?[\'"]([^\'"]+)[\'"]\s*,\s*[\'"]([^\'"]+)[\'"]')
    drop_table_re = re.compile(r'(?:dropTable|dropTableIfExists)\s*\(\s*(?:queryInterface\s*,\s*)?[\'"]([^\'"]+)[\'"]')
    refs_re = re.compile(r'model\s*:\s*[\'"]([^\'"]+)[\'"]')
    
    migrations_to_merge = []
    migrations_to_remove = []
    
    corrective_candidates = [
        "20260730074123-add-password-reset-security-to-users.js",
        "20260824171300-add-publish-status-to-products.js",
        "20260824172300-add-order-to-sliders.js",
        "20260831130000-add-cards-to-overview.js",
        "20260831130001-add-cta-to-why-us.js",
        "20260831160000-add-order-to-services.js",
        "20260908162400-add-feedback-to-job-applications.js",
        "20260911110308-add-fields-to-import-export-overview.js",
        "20260914120000-add-fields-to-business-overview.js",
    ]
    
    for f in migrations:
        with open(os.path.join(MIGRATIONS_DIR, f), 'r', encoding='utf-8') as file:
            content = file.read()
            
        creates = list(set(table_re.findall(content)))
        adds = list(set(add_col_re.findall(content)))
        drops = list(set(drop_table_re.findall(content)))
        refs = list(set(refs_re.findall(content)))
        
        down_block_match = re.search(r'down\s*\([^)]*\)\s*\{([^}]+)\}', content)
        down_drops = []
        if down_block_match:
            down_drops = list(set(drop_table_re.findall(down_block_match.group(1))))
        
        m_type = "OTHER"
        if f == "20260625000000-sync-production-schema-from-v1.js":
            m_type = "SYNC"
            stats["SYNC"] += 1
            migrations_to_remove.append({
                "Migration": f, "Reason": "Syncs schema from V1, duplicate operation on fresh database."
            })
        elif f in corrective_candidates:
            m_type = "CORRECTIVE"
            stats["CORRECTIVE"] += 1
            if adds:
                table = adds[0][0]
                # Find original migration
                orig = [m for m in inventory if table in m["creates"]]
                if orig:
                    migrations_to_merge.append({
                        "Corrective Migration": f,
                        "Original Migration": orig[0]["file"],
                        "Changes": f"Add columns to {table}",
                        "Reason": "Merge into original create migration"
                    })
        elif creates:
            m_type = "CREATE"
            stats["CREATE"] += 1
        elif adds:
            m_type = "ALTER"
            stats["ALTER"] += 1
        else:
            stats["OTHER"] += 1
            
        inventory.append({
            "file": f,
            "creates": creates,
            "adds": adds,
            "refs": refs,
            "down_drops": down_drops,
            "type": m_type,
            "content": content
        })

    # Dependency Analysis
    fks = []
    dep_problems = []
    rollback_problems = []
    
    for m in inventory:
        for t in m["creates"]:
            for r in m["refs"]:
                if r != t:
                    fks.append(f"{t} -> {r}")
                    
        # Check if down drops respect order (child before parent)
        # Simplified check: if down drops multiple tables, are they in reverse order of creates?
        if len(m["creates"]) > 1 and len(m["down_drops"]) > 1:
            if m["creates"] == m["down_drops"]:
                rollback_problems.append(f"{m['file']}: Drops tables in the same order they were created. Child tables may fail to drop if referencing parent tables.")
                
    # Seeders Analysis
    seeder_problems = []
    for s in seeders:
        with open(os.path.join(SEEDERS_DIR, s), 'r', encoding='utf-8') as file:
            content = file.read()
        if "bulkInsert" in content and "ON CONFLICT" not in content and "ignoreDuplicates" not in content:
            seeder_problems.append(f"{s}: Uses bulkInsert without ON CONFLICT or ignoreDuplicates protection.")

    print(f"Total migrations: {len(migrations)}")
    print(f"CREATE: {stats['CREATE']}")
    print(f"ALTER: {stats['ALTER']}")
    print(f"CORRECTIVE: {stats['CORRECTIVE']}")
    print(f"DATA: {stats['DATA']}")
    print(f"SYNC: {stats['SYNC']}")
    print(f"OTHER: {stats['OTHER']}")
    print("\n## Migrations To Merge")
    for item in migrations_to_merge:
        print(f"| {item['Corrective Migration']} | {item['Original Migration']} | {item['Changes']} | {item['Reason']} |")
        
    print("\n## Migrations To Remove")
    for item in migrations_to_remove:
        print(f"| {item['Migration']} | {item['Reason']} |")
        
    print("\n## Rollback Problems")
    for p in rollback_problems:
        print(f"- {p}")
        
    print("\n## Seeder Problems")
    for p in seeder_problems:
        print(f"- {p}")

if __name__ == "__main__":
    run_audit()
