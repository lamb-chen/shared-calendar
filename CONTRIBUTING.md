# Contributing to Shared Calendar

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/shared-calendar.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit: `git commit -m "Add your feature"`
7. Push: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

Follow the [QUICKSTART.md](QUICKSTART.md) guide to set up your development environment.

## Code Style

### JavaScript/React

- Use ES6+ features
- Use functional components with hooks in React
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic

### File Structure

- Backend code goes in `server/`
- Frontend code goes in `client/src/`
- Components in `client/src/components/`
- Services/API calls in `client/src/services/`

## Testing

Before submitting a PR:

1. Test the authentication flow
2. Test calendar viewing
3. Test sharing functionality
4. Test meeting invitation creation
5. Check for console errors
6. Test with multiple users

## Pull Request Guidelines

### PR Title

Use descriptive titles:
- ✅ "Add calendar export feature"
- ✅ "Fix: Resolve CORS issue on production"
- ✅ "Improve: Optimize calendar rendering performance"
- ❌ "Update code"
- ❌ "Fix bug"

### PR Description

Include:
- What changes were made
- Why the changes were necessary
- How to test the changes
- Screenshots (if UI changes)
- Related issues (if any)

### Before Submitting

- [ ] Code follows the project style
- [ ] Changes have been tested locally
- [ ] No console errors or warnings
- [ ] Comments added for complex code
- [ ] Documentation updated (if needed)
- [ ] No sensitive data (API keys, tokens) in code

## Types of Contributions

### Bug Fixes

- Describe the bug clearly
- Provide steps to reproduce
- Include your fix with tests

### New Features

- Discuss the feature in an issue first
- Ensure it aligns with project goals
- Include documentation
- Add tests if applicable

### Documentation

- Fix typos and grammar
- Improve clarity
- Add examples
- Update outdated information

### Performance Improvements

- Measure performance before and after
- Document the improvement
- Ensure no functionality is broken

## Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email the maintainers privately
3. Provide details about the vulnerability
4. Wait for a response before disclosure

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on the code, not the person
- Accept constructive criticism gracefully
- Help others learn and grow

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Review documentation

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

Thank you for contributing! 🎉
