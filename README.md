# Vulnerable Demo Application

⚠️ **WARNING**: This application contains intentional security vulnerabilities for testing purposes only. **DO NOT** deploy this to production or expose it to the internet.

## Purpose

This application is designed to demonstrate various security vulnerabilities that can be detected by security scanning tools like Snyk and remediated using AI-powered fixes.

## Security Vulnerabilities Included

### 1. **Dependency Vulnerabilities**
- Outdated packages with known CVEs
- `express@4.17.1` - Multiple vulnerabilities
- `lodash@4.17.15` - Prototype pollution
- `axios@0.19.0` - SSRF vulnerabilities
- `mongoose@5.7.5` - Query injection
- `ejs@2.6.1` - Template injection
- Many more...

### 2. **Code Security Issues**

#### SQL Injection
- Direct string concatenation in SQL queries
- No parameterized queries
- Vulnerable login and user endpoints

#### Command Injection
- Direct execution of shell commands with user input
- No input sanitization

#### Path Traversal
- File download endpoint without path validation
- Allows access to arbitrary files

#### Hardcoded Secrets
- JWT secrets in code
- Database passwords
- API keys
- AWS credentials

#### Weak Cryptography
- MD5 hashing for passwords
- Weak bcrypt rounds (4 instead of 10+)
- No algorithm specified for JWT

#### Missing Authentication/Authorization
- Admin endpoints without auth checks
- IDOR vulnerabilities
- No session validation

#### Input Validation Issues
- No input sanitization
- Missing CSRF protection
- XSS vulnerabilities

#### Insecure Configurations
- Open CORS policy
- Missing security headers
- Insecure cookie settings
- HTTP instead of HTTPS

#### Information Disclosure
- Exposing error stacks
- Leaking environment variables
- Verbose error messages

#### Dangerous Functions
- Use of `eval()` with user input
- XML parser without XXE protection
- Unsafe file uploads

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## Testing with Security Scanner

1. Push this repository to GitHub
2. Use the TR Security Scanner tool
3. Enter the repository URL
4. Review the detected vulnerabilities
5. Apply AI-powered fixes

## Expected Findings

- **High Severity**: 15-20 issues
- **Medium Severity**: 25-35 issues
- **Low Severity**: 10-15 issues

## License

MIT (For testing purposes only)
