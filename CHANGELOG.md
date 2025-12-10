# Changelog

All notable changes to ArgusOmni will be documented in this file.

## [0.1.3] - 2025-12-10

### Added
- **BASH Script Execution** - New test step type for running shell commands and scripts
  - Execute inline bash commands with `command` parameter
  - Run external script files with `script` parameter
  - Support for working directory and timeout configuration
  - Variable extraction from command output using patterns (all, line:N, last, regex)
  - Exit code validation with `expectedExitCode` and `ignoreExitCode` options
  - Perfect for database setup, Docker operations, and test cleanup

- **Enhanced Test Capabilities**
  - REST API testing with automatic cookie management
  - gRPC dynamic testing without code generation
  - File system operations (create, read, write, delete)
  - Variable management with built-in functions (date, uuid, base64)
  - JSONPath extraction for response data

- **Reporting & Output**
  - Colored console output for better readability
  - Detailed HTML reports with complete test execution history
  - JSON logs for CI/CD integration
  - Deterministic exit codes (0=success, 1=failure, 2=error)

### Example Usage

```yaml
tests:
  - name: "Setup test database"
    type: BASH
    bash:
      command: |
        docker run -d -p 5432:5432 \
          -e POSTGRES_PASSWORD=test \
          postgres:15
    expect:
      status: 0

  - name: "Run migration script"
    type: BASH
    bash:
      script: "./scripts/migrate.sh"
      timeout: 30000
    expect:
      status: 0
```

### Changed
- Updated documentation to focus on user experience rather than implementation details
- Improved README.md with practical examples and CI/CD integration guides