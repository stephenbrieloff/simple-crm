# Code Build and Deploy Rules

## Core Principles

### Incremental Development Rule
- **200-Line Maximum**: All code changes must be deployed in increments of no more than 200 lines
- **Logical Chunking**: When approaching the 200-line limit, break changes into logical, functional chunks
- **Touch Base Requirement**: Before exceeding 200 lines, conduct a quick review/touch base to assess progress and plan next steps

## Implementation Guidelines

### Change Size Management
1. **Line Count Monitoring**: Track cumulative line changes (additions + modifications)
2. **Logical Boundaries**: Break at natural code boundaries (functions, classes, modules, features)
3. **Dependency Awareness**: Ensure each chunk is deployable and doesn't break existing functionality

### Touch Base Process
When approaching 200 lines:
1. **Pause Development**: Stop before exceeding the limit
2. **Quick Review**: Assess what's been built and what remains
3. **Plan Next Chunk**: Identify the next logical 200-line increment
4. **Validate Approach**: Confirm the direction is correct before continuing

### Chunk Prioritization
- Complete functional units first
- Critical path features take priority
- Dependencies should be resolved within chunks when possible
- Each chunk should add measurable value

## Quality Gates

### Pre-Deployment Checklist
- [ ] Code compiles/runs without errors
- [ ] Basic functionality tests pass
- [ ] No obvious security vulnerabilities
- [ ] Code follows project style guidelines
- [ ] Documentation updated if needed

### Post-Deployment Validation
- [ ] Deployment successful
- [ ] Core functionality verified
- [ ] No breaking changes introduced
- [ ] Performance impact assessed

## Exception Handling

### When to Break the 200-Line Rule
- Critical bug fixes that require larger changes
- Refactoring that must be atomic to maintain consistency
- Initial project setup or major architecture changes

### Exception Process
1. Document why the exception is necessary
2. Get explicit approval for larger changes
3. Provide extra scrutiny and testing
4. Plan immediate follow-up to return to incremental approach

## Tooling and Automation

### Recommended Tools
- Git diff for line counting: `git diff --stat`
- Pre-commit hooks to enforce limits
- CI/CD pipeline integration for automated checks

### Measurement Commands
```bash
# Count lines changed in current branch
git diff --stat main

# Count lines in specific files
wc -l file1.py file2.js

# Show detailed line changes
git diff --numstat
```

## Benefits of This Approach

1. **Reduced Risk**: Smaller changes are easier to test and debug
2. **Faster Feedback**: Quick iterations allow for course correction
3. **Better Reviews**: Manageable chunks are easier to review thoroughly  
4. **Easier Rollback**: Smaller deployments are easier to revert if needed
5. **Improved Focus**: Forces clear thinking about what's being built

## Enforcement

This rule set should be:
- Referenced in all development planning
- Integrated into CI/CD pipelines where possible
- Used as guidance for code review processes
- Applied consistently across all team members

---

**Last Updated**: 2025-09-22
**Environment**: MacOS, Bash 3.2.57
**Project**: simple-crm