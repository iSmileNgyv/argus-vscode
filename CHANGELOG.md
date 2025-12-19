# Changelog

All notable changes to ArgusOmni-CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-12-19

### 🐛 Bug Fixes

#### **Schema Validation Fix - `jsonContains` Type Issue**

- **Fixed:** `jsonContains` assertion now accepts any JSON value type (string, number, boolean, object, array)
- **Previous Behavior:** Schema was incorrectly restricting `jsonContains` values to boolean only, causing VS Code validation errors: "Incorrect type. Expected 'boolean'"
- **Impact:** Users can now use `jsonContains` with any JSON value type for response validation

**Example - What Now Works:**
```yaml
expect:
  status: 200
  jsonContains:
    actions:
      - actiontype: "initialization"  # ✅ String values now work
        params:
          mode: "auto"                # ✅ Nested objects work
    count: 5                          # ✅ Numbers work
    enabled: true                     # ✅ Booleans still work
```

**Technical Details:**
- **File:** `schema.json` (lines 983-987)
- **Change:** Modified `jsonContains` property definition from `"type": "boolean"` to `"additionalProperties": true`
- **Before:** Only accepted boolean values
- **After:** Accepts any valid JSON type (string, number, boolean, object, array, null)

**Migration Notes:**
- No changes required to existing test files
- Existing tests with boolean values continue to work
- New tests can now use any JSON value type

---

## [1.0.0] - 2025-12-18

### 🎉 Initial Release

ArgusOmni-CLI is a powerful command-line interface for executing REST API test suites defined in YAML format. This initial release provides comprehensive testing capabilities with support for various assertion types, variables, and execution modes.

### ✨ Features

#### **Core Functionality**
- ✅ Execute YAML-defined test suites with multiple test cases
- ✅ Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
- ✅ Automatic request/response logging with color-coded output
- ✅ Detailed test execution summaries with pass/fail statistics

#### **Test Definition**
- ✅ YAML-based test suite configuration
- ✅ Global configuration per test suite (base URL, headers, timeout)
- ✅ Test case organization with descriptions and metadata
- ✅ Pre-request and post-request execution hooks

#### **Assertions**
- ✅ **Status Code:** Validate HTTP response status
- ✅ **JSON Contains:** Check if response contains specific fields/values
- ✅ **JSON Equals:** Exact JSON structure matching
- ✅ **JSON Schema:** Validate response against JSON Schema
- ✅ **JSONPath:** Query and validate specific JSON paths
- ✅ **Response Time:** Assert maximum response duration
- ✅ **Headers:** Validate response headers
- ✅ **Body Contains:** Check for text in response body
- ✅ **Regex Match:** Pattern matching in response

#### **Variables & Context**
- ✅ Variable extraction from responses using JSONPath
- ✅ Variable interpolation in requests using `${variableName}` syntax
- ✅ Global variables shared across all test cases
- ✅ Environment-based variable management

#### **Execution Modes**
- ✅ **Normal Mode:** Execute all tests in sequence
- ✅ **Verbose Mode:** Detailed logging of requests/responses
- ✅ **Stop on Failure:** Halt execution on first failure
- ✅ **Parallel Execution:** Run tests concurrently (upcoming)

#### **Output & Reporting**
- ✅ Color-coded console output (green=pass, red=fail, yellow=warning)
- ✅ Request/response body formatting (JSON, XML, plain text)
- ✅ Execution time tracking per test
- ✅ Summary statistics (total, passed, failed, skipped)

#### **Request Features**
- ✅ Custom headers per request or globally
- ✅ Request body support (JSON, form-data, raw text)
- ✅ Query parameters with variable interpolation
- ✅ Authentication headers (Bearer tokens, Basic auth)
- ✅ Timeout configuration per test or globally

#### **VS Code Integration**
- ✅ JSON Schema for YAML test files (`schema.json`)
- ✅ Autocomplete for test configuration
- ✅ Inline validation and error detection
- ✅ Documentation hints in editor

### 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd ArgusOmni-CLI

# Make executable
chmod +x argus

# Run tests
./argus run examples/test-suite.yaml
```

### 📖 Usage

```bash
# Basic execution
./argus run path/to/tests.yaml

# Verbose mode
./argus run path/to/tests.yaml --verbose

# Stop on first failure
./argus run path/to/tests.yaml --stop-on-failure

# Show help
./argus --help
```

### 📋 Example Test Suite

```yaml
name: "API Test Suite"
baseUrl: "https://api.example.com"
config:
  timeout: 5000
  headers:
    Content-Type: "application/json"

tests:
  - name: "Get User"
    request:
      method: GET
      path: "/users/1"
    expect:
      status: 200
      jsonContains:
        id: 1
        name: "John Doe"
      responseTime: 1000

  - name: "Create User"
    request:
      method: POST
      path: "/users"
      body:
        name: "Jane Smith"
        email: "jane@example.com"
    expect:
      status: 201
      jsonSchema:
        type: object
        required: [id, name, email]
    extract:
      userId: "$.id"
```

### 🛠️ Technical Stack

- **Language:** Bash (shell script)
- **Dependencies:**
  - `curl` - HTTP client
  - `jq` - JSON processing
  - Standard Unix utilities (grep, sed, awk)
- **Configuration:** JSON Schema for YAML validation
- **Testing:** YAML-based test definitions

### 📝 Configuration Files

- `schema.json` - JSON Schema for VS Code validation
- `.vscode/settings.json` - VS Code workspace settings
- Example test suites in `examples/` directory

### 🔧 Supported Platforms

- ✅ Linux (Ubuntu, Debian, CentOS, Fedora)
- ✅ macOS (Intel and Apple Silicon)
- ✅ Windows (WSL, Git Bash, Cygwin)

### 📚 Documentation

- **README.md** - Full documentation and usage guide
- **schema.json** - Complete schema reference with examples
- **examples/** - Sample test suites demonstrating features

### 🎯 Roadmap

Future enhancements planned for upcoming releases:

- [ ] Parallel test execution
- [ ] HTML/JSON report generation
- [ ] Mock server integration
- [ ] Database assertion support
- [ ] CI/CD pipeline integration examples
- [ ] Performance testing capabilities
- [ ] WebSocket testing support

---

## Links

- **Repository:** [GitHub Repository URL]
- **Issues:** [GitHub Issues URL]
- **Documentation:** [Docs URL]

---

**Note:** This is the first stable release of ArgusOmni-CLI. Please report any issues or feature requests through the GitHub issue tracker.
