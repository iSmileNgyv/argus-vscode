# Changelog

## [0.3.0] - 2025-12-14

### 🎉 Major Release - Enterprise Features

This is a **major feature release** introducing advanced test orchestration capabilities, comprehensive assertion enhancements, and mock server integration.

---

### 🚀 New Step Types

#### 1. WAIT - Delays & Polling (`type: WAIT`)
Execute time-based delays or poll for conditions with automatic retry.

**Simple Delay:**
```yaml
- name: "Wait 5 seconds"
  type: WAIT
  wait:
    duration: 5000  # milliseconds
```

**Conditional Polling:**
```yaml
- name: "Wait for job completion"
  type: WAIT
  wait:
    condition:
      variable: "jobStatus"
      equals: "completed"
    maxRetries: 10
    retryInterval: 2000
    timeout: 30000
```

**Supported Conditions:**
- `equals` - Variable equals value
- `exists` - Variable exists
- `expression` - Simple expression (`count > 5`)
- `jsonPath` - JSONPath query on variable

---

#### 2. LOOP - Data-Driven Testing (`type: LOOP`)
Execute tests with different data sets from arrays, CSV files, JSON files, or ranges.

**Loop Over Array:**
```yaml
- name: "Test multiple users"
  type: LOOP
  loop:
    items:
      - {name: "Alice", age: 25}
      - {name: "Bob", age: 30}
    variable: "user"
    indexVariable: "index"
    steps:
      - name: "Create user {{user.name}}"
        type: REST
        rest:
          url: "{{baseUrl}}/users"
          method: POST
          body: |
            {"name": "{{user.name}}", "age": {{user.age}}}
```

**Loop Over CSV:**
```yaml
- name: "Process CSV data"
  type: LOOP
  loop:
    dataSource:
      type: "CSV"
      file: "test-data/users.csv"
      headers: true
    variable: "row"
    steps:
      - name: "Create user from CSV"
        type: REST
        # ... test steps
```

**Loop Over JSON:**
```yaml
- name: "Process JSON data"
  type: LOOP
  loop:
    dataSource:
      type: "JSON"
      file: "test-data/products.json"
      path: "$.products"
    variable: "product"
    steps:
      # ... test steps
```

**Loop Over Range:**
```yaml
- name: "Create 10 records"
  type: LOOP
  loop:
    range:
      start: 1
      end: 10
      step: 1
    variable: "i"
    steps:
      # ... test steps
```

---

#### 3. IF - Conditional Execution (`type: IF`)
Branch test execution based on runtime conditions.

**Simple IF:**
```yaml
- name: "Conditional test"
  type: IF
  ifConfig:
    condition: "environment == 'production'"
    then:
      - name: "Production-only check"
        type: REST
        # ... test steps
```

**IF-ELSE:**
```yaml
- name: "Environment-specific setup"
  type: IF
  ifConfig:
    condition: "environment == 'dev'"
    then:
      - name: "Dev setup"
        type: SET
        set:
          variables:
            dbUrl: "dev.database.com"
    elseSteps:
      - name: "Prod setup"
        type: SET
        set:
          variables:
            dbUrl: "prod.database.com"
```

**IF-ELSEIF-ELSE:**
```yaml
- name: "Multi-tier logic"
  type: IF
  ifConfig:
    condition: "statusCode == 200"
    then:
      - name: "Success path"
        # ...
    elseIf:
      - condition: "statusCode == 404"
        then:
          - name: "Not found path"
            # ...
      - condition: "statusCode >= 500"
        then:
          - name: "Server error path"
            # ...
    elseSteps:
      - name: "Default path"
        # ...
```

**Supported Operators:**
- `==`, `!=` - Equality
- `>`, `<`, `>=`, `<=` - Comparison
- `AND`, `OR`, `NOT` - Logical operators
- `contains`, `startsWith`, `endsWith` - String operations
- `exists`, `null` - Existence checks

---

#### 4. MOCK - Mock Server Integration (`type: MOCK`)
Create and manage WireMock servers for testing your application's behavior with different API responses.

**Start Server:**
```yaml
- name: "Start mock server"
  type: MOCK
  mock:
    action: start
    port: 8089
    baseUrlVariable: "mockUrl"
    portVariable: "mockPort"
```

**Create Stub (Fake Endpoint):**
```yaml
- name: "Mock user API"
  type: MOCK
  mock:
    action: stub
    stub:
      request:
        method: GET
        urlPath: /api/users/123
      response:
        status: 200
        jsonBody:
          id: 123
          name: "John Doe"
          email: "john@example.com"
```

**Mock Error Response:**
```yaml
- name: "Mock 500 error"
  type: MOCK
  mock:
    action: stub
    stub:
      request:
        method: POST
        urlPath: /api/payment
      response:
        status: 500
        jsonBody:
          error: "Payment gateway unavailable"
        fixedDelayMilliseconds: 2000  # Simulate slow response
```

**Verify Requests:**
```yaml
- name: "Verify payment called"
  type: MOCK
  mock:
    action: verify
    verify:
      request:
        method: POST
        urlPath: /api/payment
      count: 1
      countExpression: exactly  # or: atLeast, atMost
```

**Other Actions:**
- `reset` - Clear all stubs and request logs
- `stop` - Stop the mock server

---

#### 5. ASSERT - Validation Step (`type: ASSERT`)
Dedicated assertion step for intermediate validations.

```yaml
- name: "Verify conditions"
  type: ASSERT
  expect:
    equals:
      status: "active"
      count: 5
```

---

### ⚡ Advanced Features

#### Parallel Execution with Dependencies
Execute tests in parallel with automatic dependency resolution and topological sorting.

```yaml
execution:
  parallel:
    enabled: true
    threads: 4           # Number of concurrent threads
    timeout: 30000       # Timeout per test (ms)
    failFast: false      # Stop on first failure

tests:
  # Level 0: No dependencies - run in parallel
  - id: "test1"
    name: "Independent test 1"
    type: REST
    # ...

  - id: "test2"
    name: "Independent test 2"
    type: REST
    # ...

  # Level 1: Depends on test1
  - id: "test3"
    name: "Dependent test"
    dependsOn: ["test1"]
    type: REST
    # ...
```

**Features:**
- Automatic dependency graph construction
- Topological sort for optimal execution order
- Cycle detection
- Level-based parallel execution
- Configurable thread pool
- Per-test timeout
- Fail-fast mode

---

#### Retry Logic
Automatic retry for flaky tests or eventual consistency scenarios.

```yaml
- name: "Flaky API call"
  type: REST
  maxRetries: 3
  retryInterval: 1000  # milliseconds
  rest:
    url: "{{baseUrl}}/flaky-endpoint"
    method: GET
  expect:
    status: 200
```

---

#### File Upload (Multipart/Form-Data)
Enhanced REST step with multipart/form-data support for file uploads.

**Simple File Upload:**
```yaml
- name: "Upload file"
  type: REST
  rest:
    url: "{{baseUrl}}/upload"
    method: POST
    multipart:
      file:
        path: "/path/to/file.pdf"
        filename: "document.pdf"
        contentType: "application/pdf"
      description: "My document"
```

**Multiple Files:**
```yaml
multipart:
  photos:
    - path: "/path/photo1.jpg"
    - path: "/path/photo2.jpg"
  arrayFormat: "brackets"  # or: indexed, same
```

**Array Formats:**
- `brackets` - `tags[]=value1&tags[]=value2`
- `indexed` - `tags[0]=value1&tags[1]=value2`
- `same` - `tags=value1&tags=value2`

---

### 🔍 Enhanced Assertions

#### Numeric Comparisons
```yaml
expect:
  body:
    jsonPath:
      $.price:
        greaterThan: 10
        lessThan: 1000

      $.age:
        greaterThanOrEqual: 18
        lessThanOrEqual: 65

      $.score:
        between:
          min: 0
          max: 100
```

---

#### String Operations
```yaml
expect:
  body:
    jsonPath:
      $.email:
        matches: "^[\\w.]+@[\\w.]+\\.[a-z]{2,}$"  # Regex
        contains: "@gmail.com"
        startsWith: "user"
        endsWith: ".com"
        minLength: 5
        maxLength: 100
```

---

#### Type Validation
```yaml
expect:
  body:
    jsonPath:
      $.id:
        type: integer

      $.name:
        type: string

      $.verified:
        type: boolean

      $.tags:
        type: array

      $.metadata:
        type: object
```

---

#### Array Operations
```yaml
expect:
  body:
    jsonPath:
      $.users:
        arrayNotEmpty: true
        arraySize: 10
        arrayMinSize: 1
        arrayMaxSize: 100
        arrayContains: "admin"

      $.scores:
        arrayAll:
          operator: greaterThan
          value: 0
```

---

#### Null Checks
```yaml
expect:
  body:
    jsonPath:
      $.userId:
        notNull: true

      $.deletedAt:
        isNull: true
```

---

#### Not Equals
```yaml
expect:
  body:
    jsonPath:
      $.status:
        notEquals: "deleted"

      $.tags:
        notContains: "spam"
```

---

#### Multiple Conditions (allOf / anyOf)
```yaml
expect:
  body:
    jsonPath:
      # AND - All must pass
      $.age:
        allOf:
          - greaterThan: 18
          - lessThan: 65
          - notEquals: 25

      # OR - At least one must pass
      $.status:
        anyOf:
          - equals: "active"
          - equals: "pending"
          - equals: "processing"
```

---

#### Performance Expectations
```yaml
expect:
  performance:
    maxDuration: 1000      # Max 1 second
    minDuration: 100       # At least 100ms (detect caching)
```

---

#### JSON Schema Validation
```yaml
expect:
  jsonSchema: "schemas/user-schema.json"
```

**Schema file example:**
```json
{
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id": {"type": "integer", "minimum": 1},
    "name": {"type": "string", "minLength": 1},
    "email": {"type": "string", "format": "email"}
  }
}
```

---

#### Date Format Validations
```yaml
expect:
  dateFormats:
    createdAt: "yyyy-MM-dd'T'HH:mm:ss"

    eventDate:
      pattern: "dd MMMM yyyy"
      locale: "en-US"
      min: "01 January 2020"
      max: "31 December 2025"
```

---

#### Header Assertions
**Note:** Model is ready, implementation pending response headers in ExecutionResult.

```yaml
expect:
  headers:
    - name: "Content-Type"
      contains: "application/json"
      startsWith: "application"
      exists: true

    - name: "X-Rate-Limit-Remaining"
      greaterThan: 0
```

---

### 🔧 Improved

- **REST Step**: Enhanced with multipart/form-data support and array upload formats
- **JSONPath Assertions**: Expanded from 7 operators to 40+ operators
- **Variable System**: Enhanced with loop variables and extraction improvements
- **Error Handling**: Better error messages for assertion failures
- **Documentation**: Comprehensive README.md with all features and examples

---

### 📚 Documentation

- **README.md**: Complete feature documentation with examples
- **schema.json**: Updated with all new step types and assertion options
- **Test Examples**: 15+ example files demonstrating all features
  - `wait-retry-test.yml` - Wait and retry examples
  - `loop-test.yml` - Data-driven testing examples
  - `if-test-short.yml` - Conditional execution examples
  - `parallel-simple-test.yml` - Parallel execution examples
  - `mock-simple-test.yml` - Mock server examples
  - `enhanced-assertions-test.yml` - Advanced assertion examples
  - And more...

---

## Migration Guide (0.2.0 → 0.3.0)

### Backward Compatibility
✅ **Fully backward compatible** - All 0.2.x test files work without changes.

### New Capabilities You Can Use

#### Before (0.2.0):
```yaml
# Limited to sequential execution
tests:
  - name: "Test 1"
    type: REST
    # ...
  - name: "Test 2"
    type: REST
    # ...
```

#### After (0.3.0):
```yaml
# Parallel execution with dependencies
execution:
  parallel:
    enabled: true
    threads: 4

tests:
  - id: "test1"
    name: "Test 1"
    type: REST
    # ...

  - id: "test2"
    name: "Test 2"
    dependsOn: ["test1"]
    type: REST
    # ...
```

---

#### Before (0.2.0):
```yaml
# No conditional execution
tests:
  - name: "All environments test"
    type: REST
    # ...
```

#### After (0.3.0):
```yaml
# Environment-specific tests
tests:
  - name: "Conditional test"
    type: IF
    ifConfig:
      condition: "environment == 'production'"
      then:
        - name: "Production-only"
          type: REST
          # ...
```

---

#### Before (0.2.0):
```yaml
# Manual test duplication for data-driven testing
tests:
  - name: "Test user 1"
    type: REST
    # ...
  - name: "Test user 2"
    type: REST
    # ...
```

#### After (0.3.0):
```yaml
# Data-driven testing with loops
tests:
  - name: "Test multiple users"
    type: LOOP
    loop:
      dataSource:
        type: CSV
        file: "users.csv"
      variable: "user"
      steps:
        - name: "Test {{user.name}}"
          type: REST
          # ...
```

---

### Benefits of Upgrading

✅ **5 New Step Types** - WAIT, LOOP, IF, MOCK, ASSERT
✅ **40+ Assertion Operators** - Comprehensive validation
✅ **Parallel Execution** - Speed up test execution
✅ **Data-Driven Testing** - CSV, JSON, Array, Range support
✅ **Conditional Logic** - IF/ELSE/ELSEIF branching
✅ **Mock Servers** - Test offline, simulate errors
✅ **File Upload** - Multipart/form-data support
✅ **Enterprise-Ready** - Production-grade features

---

## Feature Comparison

| Feature | 0.2.0 | 0.3.0 |
|---------|-------|-------|
| **Step Types** | 7 | 12 (+5) |
| **Assertion Operators** | 7 | 40+ (+33) |
| **Parallel Execution** | ❌ | ✅ |
| **Dependencies** | ❌ | ✅ |
| **Conditional Execution** | ❌ | ✅ |
| **Loops/Data-Driven** | ❌ | ✅ |
| **Mock Servers** | ❌ | ✅ |
| **File Upload** | ❌ | ✅ |
| **Retry Logic** | ❌ | ✅ |
| **Type Validation** | ❌ | ✅ |
| **String Operations** | ❌ | ✅ |
| **Array Operations** | ❌ | ✅ |
| **Multiple Conditions** | ❌ | ✅ |
| **JSON Schema** | ❌ | ✅ |
| **Date Validation** | ❌ | ✅ |
| **Performance Assertions** | ❌ | ✅ |

---

## Breaking Changes
**None** - This release is fully backward compatible.

---

## Known Issues

- **Header Assertions**: Model is implemented but requires response headers to be added to `ExecutionResult`. Currently silently skipped.

---

## Deprecations
None

---

## Upgrade Instructions

1. **Update schema.json** (if using VS Code extension):
   - Replace your old `schema.json` with the new version
   - Restart VS Code for IntelliSense updates

2. **Update test files** (optional):
   - No changes required for existing tests
   - Start using new features incrementally

3. **Review new features**:
   - Check `README.md` for comprehensive documentation
   - Explore `test-examples/` for practical examples

---

## Contributors
Thank you to all contributors who made this release possible!

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

**For full documentation, see [README.md](README.md)**
