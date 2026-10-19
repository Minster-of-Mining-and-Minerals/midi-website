import os
import re

ROUTERS_DIR = r"c:\Users\Amanuel Daniel\Desktop\MoM\projects\midi-website-1\backend\routers"

mapping = {
    # users resource
    "userRoutes.js": "users",
    "roleRoutes.js": "roles",
    "userRoleRoutes.js": "users",  # assign_role?
    
    # products resource
    "productRoutes.js": "products",
    "productCategoryRoutes.js": "product_categories",
    "productInquiryRoutes.js": "product_inquiries",
    
    # businesses
    "businessRoutes.js": "businesses",
    
    # services
    "serviceRoutes.js": "services",
    "serviceWhyUsRoutes.js": "services",
    "serviceOverviewRoutes.js": "services",
    "serviceExperienceRoutes.js": "services",
    "serviceCapabilityRoutes.js": "services",
    
    # news
    "newsRoutes.js": "news",
    "tagRoutes.js": "tags",
    "newsFeedbackRoutes.js": "news_feedbacks",
    
    # hero
    "cardRoute.js": "hero",
    "purposeRoute.js": "hero",
    "sliderRoute.js": "hero",
    "statRoute.js": "hero",
    
    # about
    "aboutRoute.js": "about",
    "backgroundRoute.js": "about",
    "missionVisionRoute.js": "about",
    "partnerRoute.js": "about",
    "valueRoute.js": "about",
    
    # footer
    "footerContactRoute.js": "footer",
    "footerLogoRoute.js": "footer",
    "footerSocialRoute.js": "footer",
    
    # contact
    "contactRoute.js": "contacts",
    "contactMessageRoute.js": "contact_messages",
    
    # vacancies
    "vacancyRoute.js": "vacancies",
    
    # attachments
    "attachementRoute.js": "attachments",
    
    # routes
    "routeRoute.js": "routes",
    
    # system
    "auditLogRoutes.js": "audit_logs",
    "pageHeaderRoutes.js": "page_headers",
}

for root, dirs, files in os.walk(ROUTERS_DIR):
    for file in files:
        if file in mapping:
            resource = mapping[file]
            filepath = os.path.join(root, file)
            
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                
            original_content = content
            
            # Ensure auth middleware is imported
            if "authenticateToken" not in content or "checkPermission" not in content:
                # find where express is imported
                depth = filepath[len(ROUTERS_DIR):].count(os.sep)
                relative_path = "../" * depth + "middlewares/authMiddleware"
                import_stmt = f'const {{ authenticateToken, checkPermission }} = require("{relative_path}");\n'
                
                # Check if it already has one of them imported from authMiddleware
                if "middlewares/authMiddleware" in content:
                    content = re.sub(r'const\s*{\s*([^}]*)\s*}\s*=\s*require\([^)]*middlewares/authMiddleware[^)]*\);?', import_stmt, content)
                else:
                    content = re.sub(r'(const router\s*=\s*express\.Router\(\);\s*)', r'\1\n' + import_stmt, content)
            
            # Process POST, PUT, DELETE, PATCH
            def replace_route(match):
                method = match.group(1).lower()
                path = match.group(2)
                args = match.group(3)
                
                # Exclude public endpoints
                if resource == "product_inquiries" and method == "post" and path == "/":
                    return match.group(0)
                if resource == "news_feedbacks" and method == "post" and path == "/":
                    return match.group(0)
                if resource == "contact_messages" and method == "post" and path == "/":
                    return match.group(0)
                if resource == "vacancies" and method == "post" and path == "/apply":
                    return match.group(0)
                
                # Determine action
                if method == "post":
                    if "reply" in path: action = "reply"
                    elif "publish" in path: action = "publish"
                    elif resource == "users" and "assign" in path: action = "assign_role"
                    elif resource == "roles" and "assign" in path: action = "assign_permission"
                    else: action = "create"
                elif method in ["put", "patch"]:
                    action = "update"
                elif method == "delete":
                    action = "delete"
                else:
                    return match.group(0)
                
                new_args = args
                # Add authenticateToken if missing
                if "authenticateToken" not in new_args:
                    new_args = f"authenticateToken, {new_args}"
                    
                # Add checkPermission if missing
                if "checkPermission" not in new_args:
                    # place it right after authenticateToken
                    new_args = re.sub(r'(authenticateToken,\s*)', rf'\1checkPermission("{resource}", "{action}"), ', new_args)
                
                return f'router.{method}("{path}", {new_args})'
            
            # regex to match router.method("path", arg1, arg2...)
            pattern = re.compile(r'router\.(post|put|delete|patch)\(\s*["\']([^"\']+)["\']\s*,\s*(.*?)\)', re.DOTALL)
            content = pattern.sub(replace_route, content)
            
            if content != original_content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated {file}")
