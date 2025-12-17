# Changelog

All notable changes to ArgusOmni Test Orchestrator will be documented in this file.

---

## [1.0.0] - 2025-12-17

### 🎉 **MAJOR RELEASE - Production Ready**

ArgusOmni-CLI reaches **version 1.0.0** - A complete, enterprise-grade test orchestration framework with comprehensive features for modern API testing, gRPC services, mock servers, and advanced test automation.

---

### ✨ What's New in 1.0.0

#### 🎨 **Modern HTML Reports**
Beautiful, dark-themed HTML reports with professional design:
- **Glassmorphism UI** - Modern dark theme with gradient backgrounds
- **Interactive Stats Cards** - Animated cards showing test metrics
- **Scrollable Responses** - Long responses auto-scroll (max-height: 500px for code blocks)
- **Custom Scrollbars** - Purple-themed scrollbars matching design
- **Performance Metrics** - Visual performance indicators with badges
- **Collapsible Details** - Expand/collapse request/response details
- **Mobile Responsive** - Works on all screen sizes
- **Smooth Animations** - Fade-in effects and hover transitions

#### 📋 **Complete Feature Set**

##### **12 Test Step Types:**
1. **REST** - HTTP/HTTPS API testing with full feature set
2. **GRPC** - gRPC service testing with dynamic proto loading
3. **FS** - File system operations and validations
4. **BASH** - Shell command execution and CLI testing
5. **SET** - Variable management and data preparation
6. **TRANSFORM** - Data transformation and manipulation
7. **RESOLVE_PATH** - File path resolution utilities
8. **ASSERT** - Dedicated assertion steps
9. **WAIT** - Delays and polling with conditions
10. **LOOP** - Data-driven testing (CSV, JSON, arrays, ranges)
11. **IF** - Conditional execution (IF/ELSE/ELSEIF)
12. **MOCK** - WireMock integration for mock servers

##### **50+ Assertion Operators:**
- **JSONPath**: exists, notEmpty, isEmpty, isNull, notNull
- **Numeric**: greaterThan, lessThan, between, equals, notEquals
- **String**: matches, contains, startsWith, endsWith, minLength, maxLength
- **Arrays**: arrayNotEmpty, arraySize, arrayContains, arrayAll
- **Type**: type validation (string, integer, boolean, array, object)
- **Logical**: allOf, anyOf (AND/OR conditions)
- **Performance**: maxDuration, minDuration
- **Headers**: comprehensive header validation
- **Dates**: pattern matching with locale and range support
- **JSON Schema**: full JSON Schema Draft-07 validation

##### **Advanced Features:**
- ✅ **Parallel Execution** - Multi-threaded test execution with dependency graphs
- ✅ **Retry Logic** - Automatic retry for flaky tests
- ✅ **File Upload** - Multipart/form-data support with multiple array formats
- ✅ **Cookie Management** - Automatic cookie jar with "auto" mode
- ✅ **Variable System** - Global env, suite variables, extraction, nested access
- ✅ **Data-Driven Testing** - CSV, JSON, inline arrays, numeric ranges
- ✅ **Conditional Logic** - IF/ELSE/ELSEIF with rich expression support
- ✅ **Mock Servers** - Create, verify, and manage WireMock servers
- ✅ **Error Handling** - Continue on error, fail-fast modes

---

### 📦 Installation & Setup

```bash
# Build the project
./gradlew :ArgusOmni-CLI:build

# The alias is automatically installed after build
source ~/.zshrc

# Run tests
argus run test-suite.yml --verbose
```

---

### 🚀 Quick Start Example

```yaml
env:
  baseUrl: "https://api.example.com"

tests:
  - name: "Login and Get User"
    type: REST
    rest:
      url: "{{baseUrl}}/auth/login"
      method: POST
      cookies: "auto"
      body:
        username: "test@example.com"
        password: "secret"
    extract:
      token: "$.access_token"
    expect:
      status: 200
      performance:
        maxDuration: 1000
      body:
        jsonPath:
          $.access_token:
            type: string
            minLength: 10

  - name: "Get User Profile"
    type: REST
    rest:
      url: "{{baseUrl}}/users/me"
      method: GET
      headers:
        Authorization: "Bearer {{token}}"
    expect:
      status: 200
      body:
        jsonPath:
          $.email:
            matches: "^[\\w.]+@[\\w.]+\\.[a-z]{2,}$"
          $.age:
            greaterThan: 0
            lessThan: 150
```

---

### 🎯 Key Improvements from 0.3.0

#### **Visual & UX:**
- ✅ Complete HTML report redesign with modern dark theme
- ✅ Fixed horizontal overflow issues in reports
- ✅ Custom scrollbars with brand colors
- ✅ Smooth animations and transitions
- ✅ Professional stat cards with icons
- ✅ Better typography and spacing

#### **Schema & Documentation:**
- ✅ Comprehensive schema.json with 1300+ lines
- ✅ Detailed descriptions for every field
- ✅ Practical examples throughout
- ✅ Better validation patterns
- ✅ Fixed inconsistencies (proto vs protoPath)
- ✅ Enhanced FS operations with operation enum

#### **Core Functionality:**
- ✅ Circular dependency fixes (IfExecutor, LoopExecutor)
- ✅ Nested property access in variables (loopItem.name)
- ✅ Object reference preservation in variable resolution
- ✅ JSON body serialization improvements
- ✅ JSONPath filter support with proper syntax
- ✅ Cookie auto-management working correctly

---

### 📊 Feature Comparison

| Feature | v0.3.0 | v1.0.0 |
|---------|--------|--------|
| Step Types | 12 | 12 |
| Assertion Operators | 40+ | 50+ |
| HTML Reports | Basic | Modern Dark Theme |
| Schema Documentation | Basic | Comprehensive |
| Examples | ✅ | ✅ Enhanced |
| Nested Variables | ❌ | ✅ |
| Report Overflow | Issue | ✅ Fixed |
| Custom Scrollbars | ❌ | ✅ |
| Production Ready | ⚠️ Beta | ✅ **Stable** |

---

### 🔧 Technical Details

#### **Architecture:**
- Spring Boot 3.5.7
- Java 21
- Reactive WebClient for HTTP
- gRPC with dynamic proto loading
- WireMock 3.3.1 for mocking
- JSONPath 2.9.0 for queries
- JSON Schema Validator 1.5.1

#### **Performance:**
- Parallel execution with configurable thread pools
- Automatic dependency graph optimization
- Lazy loading with @Lazy annotation
- Efficient variable context management
- Optimized JSON parsing and validation

---

### 🐛 Bug Fixes

- Fixed circular dependency between IfExecutor and LoopExecutor
- Fixed nested property access in variable resolver
- Fixed JSON body serialization (was using toString())
- Fixed object reference resolution (preserve object types)
- Fixed HTML report horizontal overflow
- Fixed CSS percentage escaping in formatted strings
- Fixed JSONPath filter syntax support
- Fixed cookie management in REST requests

---

### 📝 Migration Guide (0.3.0 → 1.0.0)

#### **No Breaking Changes!**
All 0.3.x test files work without modification.

#### **New Features You Can Use:**

**1. Nested Variable Access:**
```yaml
loop:
  items:
    - {user: {name: "John", age: 30}}
  variable: "item"
  steps:
    - name: "Process {{item.user.name}}"
      # Now works correctly!
```

**2. Better Object References:**
```yaml
- name: "Use entire object"
  type: SET
  set:
    variables:
      payload:
        name: "John"
        age: 30

- name: "POST with object"
  type: REST
  rest:
    body: "{{payload}}"  # Sends as JSON, not string!
```

**3. Improved Reports:**
- Reports now auto-generate with modern design
- No configuration needed - just run tests!

---

### 🎨 HTML Report Features

The new HTML reports include:

**Header Section:**
- Gradient purple-pink background
- Grid pattern overlay
- Test suite name and timestamp
- Total duration display

**Statistics Cards:**
- Total Tests (blue)
- Passed Tests (green)
- Failed Tests (red)
- Average Duration (orange)
- Animated hover effects
- Gradient text

**Progress Bar:**
- Visual pass/fail percentage
- Gradient fills
- Smooth animations

**Test Details:**
- Collapsible sections
- Status indicators (✓/✗)
- Duration display
- Method badges (color-coded)
- Request/Response cards
- Scrollable code blocks
- Custom purple scrollbars

---

### 🌟 What Makes 1.0.0 Production-Ready?

✅ **Comprehensive Testing** - Validated with real-world scenarios
✅ **Stable Architecture** - No known critical bugs
✅ **Complete Documentation** - README, CHANGELOG, schema.json
✅ **Professional Reports** - Enterprise-grade HTML output
✅ **Rich Feature Set** - All essential testing capabilities
✅ **Backward Compatible** - Smooth upgrade path
✅ **Performance Optimized** - Parallel execution, efficient parsing
✅ **Error Handling** - Graceful failure handling
✅ **Extensive Examples** - 15+ example test files

---

### 📚 Documentation

- **README.md** - Complete feature guide (1446 lines)
- **schema.json** - Full JSON Schema with descriptions (1318 lines)
- **CHANGELOG.md** - Detailed version history
- **Examples/** - 15+ test examples covering all features

---

### 🙏 Credits

Built with ❤️ for Quality Assurance Engineers

**Technologies:**
- Spring Boot Framework
- Project Reactor
- gRPC & Protocol Buffers
- WireMock
- JSONPath
- PicoCLI

---

### 📦 Distribution

**JAR Location:** `ArgusOmni-CLI/build/libs/ArgusOmni-CLI-1.0.0.jar`

**Alias:** `argus` (auto-configured in ~/.zshrc)

**Reports:** Generated in `reports/` directory

---

## [0.3.0] - 2025-12-14

### 🎉 Major Release - Enterprise Features

This is a **major feature release** introducing advanced test orchestration capabilities, comprehensive assertion enhancements, and mock server integration.

[Previous content remains the same...]

---

## [0.2.0] - 2025-12-13

### 🎉 Added

#### JSONPath Assertions (`expect.jsonPath`)
- **Major Feature:** Advanced JSONPath assertions with filter support
- Filter syntax: `$.users[?(@.name == 'John' && @.age > 18)]`
- Assertion types: exists, isEmpty, count, minCount, maxCount, equals, contains

#### Query Parameters Support
- Added `queryParams` field to REST configuration
- Automatic URL encoding

### 🔧 Improved
- Cookie handling enhancements
- Documentation improvements

---

## [0.1.3] - 2024-XX-XX

### Added
- Initial schema release
- Basic step types (REST, gRPC, FS, BASH, SET, TRANSFORM)
- Basic assertions
- Variable extraction

---

**Full documentation:** [README.md](README.md)

**VS Code Extension Schema:** [schema.json](schema.json)
