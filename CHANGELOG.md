# Changelog
## [0.2.0] - 2025-12-13

### 🎉 Added

#### JSONPath Assertions (`expect.jsonPath`)
- **Major Feature:** Advanced JSONPath assertions with filter support for complex data validation
- Enables powerful array searches with conditions: `$.users[?(@.name == 'John' && @.age > 18)]`
- Supports multiple assertion types:
  - `exists` - Check if path returns results
  - `isEmpty` - Verify empty results
  - `count` - Exact count validation
  - `minCount` / `maxCount` - Range validation
  - `equals` - Value equality check
  - `contains` - Array containment check

**Example:**
```yaml
expect:
  jsonPath:
    "$.orders[?(@.status == 'completed' && @.total > 100)]":
      exists: true
      minCount: 5
```

#### Query Parameters Support
- Added `queryParams` field to REST configuration for URL query string parameters
- Automatically encodes and appends parameters to the request URL

**Example:**
```yaml
rest:
  method: GET
  url: "https://api.example.com/search"
  queryParams:
    q: "search term"
    page: "1"
```

### 🔧 Improved

- **Cookie Handling**: Enhanced schema description with clearer examples for `auto` and manual cookie management
- **Extract Field**: Added detailed JSONPath expression examples in field descriptions
- **Documentation**: Improved IntelliSense hints with practical examples for JSONPath patterns

### 📚 Documentation

- All JSONPath assertions include inline examples in schema
- Added comprehensive operator documentation (==, !=, >, <, =~, &&, ||)
- Improved descriptions for better autocomplete experience

---

## [0.1.3] - 2024-XX-XX

### Added

- Initial schema release
- Support for REST, gRPC, File System, Bash, SET, TRANSFORM, and RESOLVE_PATH step types
- Basic assertions: status, json, jsonContains, jsonNotContains
- Variable extraction with JSONPath
- Cookie management
- Environment variables support

---

## Migration Guide (0.1.x → 0.2.0)

### Backward Compatibility
All existing 0.1.x test files will continue to work without changes. Version 0.2.0 is fully backward compatible.

### New Capabilities

**Before (0.1.x):**
```yaml
expect:
  json:
    "users[0].name": "John"  # Limited to simple field checks
```

**After (0.2.0):**
```yaml
expect:
  jsonPath:
    "$.users[?(@.name == 'John' && @.active == true)]":
      exists: true
      minCount: 1  # Much more powerful!
```

### Benefits of Upgrading

✅ **Complex Filters** - Multiple conditions with AND/OR logic
✅ **Regex Matching** - Pattern-based validation (`=~` operator)
✅ **Numeric Comparisons** - Greater than, less than operations
✅ **Array Validation** - Count checks, range validation
✅ **Better IntelliSense** - Enhanced autocomplete in VS Code

---

## JSONPath Operators Reference

| Operator | Description | Example |
|----------|-------------|---------|
| `==` | Equals | `@.status == 'active'` |
| `!=` | Not equals | `@.status != 'deleted'` |
| `>` | Greater than | `@.price > 100` |
| `>=` | Greater or equal | `@.age >= 18` |
| `<` | Less than | `@.count < 10` |
| `<=` | Less or equal | `@.score <= 100` |
| `=~` | Regex match | `@.email =~ /.*@example\.com/` |
| `&&` | Logical AND | `@.x == 1 && @.y == 2` |
| `\|\|` | Logical OR | `@.status == 'new' \|\| @.status == 'pending'` |

---

## Path Syntax Reference

| Syntax | Description | Example |
|--------|-------------|---------|
| `$` | Root element | `$.users` |
| `.` | Child element | `$.user.name` |
| `[n]` | Array index | `$.users[0]` |
| `[-1]` | Last element | `$.items[-1]` |
| `[*]` | All elements | `$.users[*].name` |
| `[?()]` | Filter expression | `$.users[?(@.active == true)]` |

---

## Common Patterns

### Search with Multiple Conditions
```yaml
jsonPath:
  "$.products[?(@.price > 50 && @.price < 200 && @.inStock == true)]":
    minCount: 1
```

### Email Validation
```yaml
jsonPath:
  "$.users[?(@.email =~ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]":
    exists: true
```

### Empty Array Check
```yaml
jsonPath:
  "$.errors":
    isEmpty: true
```

### Status Filtering (OR)
```yaml
jsonPath:
  "$.tickets[?(@.priority == 'high' || @.priority == 'critical')]":
    minCount: 1
```

---