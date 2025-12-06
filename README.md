# ArgusOmni VS Code Extension

This extension provides seamless integration for **ArgusOmni**, allowing you to write, validate, and execute test suites directly within Visual Studio Code.

## Features

### 🚀 Run Tests Directly
Execute your test suites without leaving the editor.
- **Toolbar Button**: Click the "Play" icon in the editor title bar.
- **Context Menu**: Right-click on any YAML file and select **"Argus: Run Test"**.
- **Explorer**: Right-click on a file in the file explorer to run it.

### 🧠 Intelligent Autocomplete (IntelliSense)
Speed up your workflow with smart suggestions powered by the ArgusOmni JSON Schema.
- Automatically suggests keys like `rest`, `grpc`, `fs`, `expect`.
- Provides enum values for HTTP methods (`GET`, `POST`, etc.).
- Shows descriptions for every configuration field.

### ✅ Real-time Validation
Catch errors before running your tests. The extension highlights:
- Missing required fields (e.g., missing `url` in a REST step).
- Invalid property values.
- Incorrect structure types.

## Requirements

1. **ArgusOmni CLI**: The `argus` command-line tool must be installed on your system and accessible via the system `PATH`.
2. **YAML Language Support**: This extension depends on the [Red Hat YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) extension for validation features. It will be installed automatically.

## Usage

1. Create a test file ending in `.argus.yml` or place your YAML files inside a `argus-tests/` directory.
2. Start typing to see suggestions (e.g., type `re` to see `rest`).
3. Right-click the file or press the **Play** button in the top-right corner to run the test.
4. The output will be displayed in the integrated VS Code terminal.

## Extension Settings

This extension automatically associates the ArgusOmni schema with files matching:
- `*.argus.yml`
- `*.argus.yaml`
- `**/argus-tests/**/*.yml`

## Release Notes

### 0.1.0
- Initial release.
- Added JSON Schema for validation and autocomplete.
- Added "Run Test" command execution via integrated terminal.