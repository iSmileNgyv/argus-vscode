# ArgusOmni YAML Language Support

**Professional IntelliSense and validation for ArgusOmni test definition files (.argus.yml)**

Transform your API testing workflow with intelligent autocompletion, real-time validation, and comprehensive documentation directly in VS Code.

---

## ✨ Features

### 🎯 **Smart IntelliSense**
- **Auto-completion** for all test step types and fields
- **Contextual suggestions** based on current position
- **Field descriptions** appear as you type
- **Enum values** with explanations
- **Nested property support** for complex structures

### ✅ **Real-Time Validation**
- **Instant error detection** as you type
- **Schema-based validation** for all fields
- **Type checking** (string, number, boolean, object, array)
- **Required field warnings**
- **Pattern validation** for URLs, regex, and more

### 📖 **Rich Documentation**
- **Hover tooltips** with detailed field descriptions
- **Inline examples** for complex configurations
- **Best practices** and usage notes
- **Operator explanations** for assertions

### 🚀 **Supported Features**

#### **12 Test Step Types:**
- ✅ `REST` - HTTP/HTTPS API testing
- ✅ `GRPC` - gRPC service calls
- ✅ `FS` - File system operations
- ✅ `BASH` - Shell command execution
- ✅ `SET` - Variable management
- ✅ `TRANSFORM` - Data transformation
- ✅ `RESOLVE_PATH` - Path resolution
- ✅ `ASSERT` - Dedicated assertions
- ✅ `WAIT` - Delays and polling
- ✅ `LOOP` - Data-driven testing
- ✅ `IF` - Conditional execution
- ✅ `MOCK` - Mock server integration

#### **50+ Assertion Operators:**
- JSONPath queries with filters
- Numeric comparisons (>, <, between)
- String operations (matches, contains, startsWith)
- Array operations (size, contains, all)
- Type validation
- Logical operators (allOf, anyOf)
- Performance assertions
- Date format validation
- JSON Schema validation

#### **Advanced Capabilities:**
- Parallel execution with dependencies
- Retry logic for flaky tests
- File uploads (multipart/form-data)
- Cookie management
- Variable extraction and interpolation
- Nested property access
- Multiple data sources (CSV, JSON, arrays)
- Conditional branching (IF/ELSE/ELSEIF)
- Mock server lifecycle management

---

## 📦 Installation

### **From VS Code Marketplace:**
1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
3. Search for **"ArgusOmni YAML Language Support"**
4. Click **Install**

### **From VSIX File:**
1. Download the `.vsix` file
2. Open VS Code
3. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
4. Type "Extensions: Install from VSIX"
5. Select the downloaded file

---

## 🚀 Quick Start

### **1. Create a Test File**

Create a new file with `.argus.yml` extension:

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
```

### **2. Get IntelliSense**

Start typing and see intelligent suggestions:

```yaml
tests:
  - name: "My Test"
    type: |  # Press Ctrl+Space to see all step types
```

### **3. Validate in Real-Time**

Invalid configurations are highlighted immediately:

```yaml
tests:
  - name: "Test"
    type: REST
    rest:
      # Missing required field 'url' - will show error
      method: POST
```

---

## 📚 Usage Examples

### **REST API Testing**

```yaml
- name: "Create User"
  type: REST
  rest:
    url: "{{baseUrl}}/users"
    method: POST
    headers:
      Authorization: "Bearer {{token}}"
      Content-Type: "application/json"
    body:
      name: "John Doe"
      email: "john@example.com"
      age: 30
  extract:
    userId: "$.id"
  expect:
    status: 201
    body:
      jsonPath:
        $.id:
          type: integer
          greaterThan: 0
        $.email:
          matches: "^[\\w.]+@[\\w.]+\\.[a-z]{2,}$"
```

### **Data-Driven Testing (Loop)**

```yaml
- name: "Test Multiple Users"
  type: LOOP
  loop:
    dataSource:
      type: CSV
      file: "test-data/users.csv"
      headers: true
    variable: "user"
    steps:
      - name: "Create {{user.name}}"
        type: REST
        rest:
          url: "{{baseUrl}}/users"
          method: POST
          body:
            name: "{{user.name}}"
            email: "{{user.email}}"
```

### **Conditional Execution (IF)**

```yaml
- name: "Environment-Specific Test"
  type: IF
  ifConfig:
    condition: "environment == 'production'"
    then:
      - name: "Production Check"
        type: REST
        rest:
          url: "{{baseUrl}}/health"
          method: GET
    elseSteps:
      - name: "Dev Setup"
        type: SET
        set:
          variables:
            mockEnabled: true
```

### **Mock Server Testing**

```yaml
- name: "Start Mock API"
  type: MOCK
  mock:
    action: start
    port: 8089
    baseUrlVariable: "mockUrl"

- name: "Create Stub"
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
```

### **Advanced Assertions**

```yaml
expect:
  status: 200
  performance:
    maxDuration: 1000
  body:
    jsonPath:
      # Multiple conditions (AND)
      $.age:
        allOf:
          - greaterThan: 18
          - lessThan: 65
          - notEquals: 25

      # Array operations
      $.users:
        arrayNotEmpty: true
        arrayMinSize: 1
        arrayMaxSize: 100

      # Type validation
      $.email:
        type: string
        matches: "^[\\w.]+@[\\w.]+$"
        minLength: 5
        maxLength: 100
```

---

## 🎯 IntelliSense Features

### **Step Type Suggestions**

When you type `type:`, you'll see all available options:

- REST - HTTP/HTTPS API testing
- GRPC - gRPC service calls
- FS - File system operations
- BASH - Shell commands
- SET - Set variables
- TRANSFORM - Transform data
- WAIT - Delays and polling
- LOOP - Data-driven testing
- IF - Conditional execution
- MOCK - Mock servers
- ASSERT - Assertions
- RESOLVE_PATH - Path resolution

### **Field Suggestions**

Context-aware field suggestions based on step type:

**For REST:**
- url (required)
- method (required)
- headers
- queryParams
- body
- multipart
- cookies
- timeout

**For LOOP:**
- items (inline array)
- itemsFrom (variable reference)
- dataSource (CSV/JSON file)
- range (numeric range)
- variable
- steps (required)

**For IF:**
- condition (required)
- then (required)
- elseIf
- elseSteps

### **Assertion Operator Suggestions**

When writing assertions, get suggestions for all operators:

**Basic:**
- exists
- equals
- notEquals
- contains
- notContains

**Numeric:**
- greaterThan
- lessThan
- greaterThanOrEqual
- lessThanOrEqual
- between

**String:**
- matches (regex)
- startsWith
- endsWith
- minLength
- maxLength

**Arrays:**
- arrayNotEmpty
- arraySize
- arrayContains
- arrayAll

**Logical:**
- allOf (AND)
- anyOf (OR)

---

## ⚙️ Configuration

### **File Association**

The extension automatically activates for files with:
- `.argus.yml` extension
- `.argus.yaml` extension

### **Custom Schema Location**

To use a custom schema, add to VS Code `settings.json`:

```json
{
  "yaml.schemas": {
    "/path/to/custom/schema.json": "*.argus.yml"
  }
}
```

---

## 📖 Documentation

### **Field Descriptions**

Hover over any field to see detailed documentation:

```yaml
tests:
  - name: "Test"
    maxRetries: 3  # Hover to see: "Maximum number of retry attempts..."
```

### **Inline Examples**

Many complex fields include examples in their descriptions:

```yaml
rest:
  multipart:  # Hover to see full multipart upload examples
```

### **Error Messages**

Clear, actionable error messages:

❌ **Missing required property 'url'**
✅ Add the url field to your REST configuration

❌ **Type mismatch: Expected string, got number**
✅ Wrap the value in quotes to make it a string

---

## 🐛 Troubleshooting

### **IntelliSense Not Working**

1. Ensure file has `.argus.yml` extension
2. Restart VS Code
3. Check YAML extension is installed
4. Verify schema.json is in correct location

### **Validation Errors**

1. Check required fields are present
2. Verify field types match schema
3. Ensure enum values are valid
4. Check nested structure is correct

### **Schema Not Loading**

1. Verify schema.json file exists
2. Check file permissions
3. Restart VS Code
4. Re-install extension

---

## 🤝 Contributing

Found a bug or have a feature request?

- **GitHub Issues:** [Report an issue](https://github.com/your-repo/issues)
- **Discussions:** [Join the conversation](https://github.com/your-repo/discussions)

---

## 📄 License

This extension is licensed under the [MIT License](LICENSE).

---

## 🌟 Related Tools

### **ArgusOmni-CLI**

The command-line tool that executes these test files:

```bash
# Install
./gradlew :ArgusOmni-CLI:build

# Run tests
argus run test-suite.yml --verbose

# Generate HTML report
argus run test-suite.yml --report
```

**Features:**
- Parallel execution
- Beautiful HTML reports
- Retry logic
- Mock server integration
- Variable extraction
- Performance metrics

---

## 📊 Statistics

- **1,318 lines** of comprehensive schema
- **12** test step types
- **50+** assertion operators
- **100%** field coverage
- **Real-time** validation

---

## 🎨 Screenshots

### **IntelliSense in Action**
![IntelliSense](screenshots/intellisense.png)

### **Real-Time Validation**
![Validation](screenshots/validation.png)

### **Hover Documentation**
![Hover](screenshots/hover.png)

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

## 🙏 Acknowledgments

Built with:
- JSON Schema Draft-07
- VS Code Extension API
- YAML Language Server

---

**Happy Testing! 🚀**

*Transform your API testing with intelligent autocompletion and validation*
