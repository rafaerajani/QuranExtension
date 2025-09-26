# 🚀 GitHub Workflow Guide for NepBio Batch Records

A comprehensive guide to using GitHub effectively with our development standards and best practices.

## 📋 Table of Contents

1. [Development Standards](#development-standards)
2. [Getting Started with GitHub](#getting-started-with-github)
3. [Branch Management](#branch-management)
4. [Creating Pull Requests](#creating-pull-requests)
5. [Code Review Process](#code-review-process)
6. [Merging and Cleanup](#merging-and-cleanup)
7. [Common Workflows](#common-workflows)
8. [Troubleshooting](#troubleshooting)

## 🎯 Development Standards

### 1. Branch Naming Convention

**ALL feature branches MUST be prefixed with `feature/`**

✅ **Good Examples:**

- `feature/adding-database`
- `feature/fixing-issue-1`
- `feature/user-authentication`
- `feature/batch-record-validation`

❌ **Bad Examples:**

- `adding-database` (no prefix)
- `fix-issue` (no prefix)
- `feature/abc` (too vague)

### 2. Branch Lifecycle

- **Merged branches should be dead** - Once merged, never update the branch
- **Minor changes** go directly to staging/main
- **Branch lifecycle ends** when PR is merged

### 3. Review Process

- **Always request review** before merging
- **Three review responses:**
  - ✅ **Approval** - Good to merge
  - ❌ **Rejection** - Major issues to resolve
  - 💬 **Comment** - Optional minor changes

## 🛠️ Getting Started with GitHub

### Initial Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/NepBio-Project/NepBioBatchRecords.git
   cd NepBioBatchRecords
   ```

2. **Configure Git (if not done)**

   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Verify Remote**
   ```bash
   git remote -v
   # Should show:
   # origin  https://github.com/NepBio-Project/NepBioBatchRecords.git (fetch)
   # origin  https://github.com/NepBio-Project/NepBioBatchRecords.git (push)
   ```

## 🌿 Branch Management

### Creating a New Feature Branch

1. **Start from the latest main branch**

   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create and switch to a new feature branch**

   ```bash
   git checkout -b feature/your-descriptive-branch-name
   ```

3. **Verify you're on the new branch**
   ```bash
   git branch
   # Should show:
   # * feature/your-descriptive-branch-name
   #   main
   ```

### Working on Your Branch

1. **Make your changes**

   ```bash
   # Edit files, add new features, etc.
   ```

2. **Stage your changes**

   ```bash
   # Stage specific files
   git add filename.ts

   # Or stage all changes
   git add .
   ```

3. **Commit your changes**

   ```bash
   git commit -m "feat: add user authentication system"
   ```

4. **Push your branch to GitHub**
   ```bash
   git push -u origin feature/your-descriptive-branch-name
   ```

### Updating Your Branch

If main has been updated while you're working:

1. **Switch to main and pull updates**

   ```bash
   git checkout main
   git pull origin main
   ```

2. **Switch back to your feature branch**

   ```bash
   git checkout feature/your-descriptive-branch-name
   ```

3. **Merge main into your branch**

   ```bash
   git merge main
   ```

4. **Resolve any conflicts if they occur**

   ```bash
   # Edit conflicted files
   git add resolved-file.ts
   git commit -m "resolve merge conflicts"
   ```

5. **Push the updated branch**
   ```bash
   git push origin feature/your-descriptive-branch-name
   ```

## 🔄 Creating Pull Requests

### Step 1: Prepare Your Branch

1. **Ensure your branch is up to date**

   ```bash
   git checkout main
   git pull origin main
   git checkout feature/your-descriptive-branch-name
   git merge main
   ```

2. **Push your latest changes**
   ```bash
   git push origin feature/your-descriptive-branch-name
   ```

### Step 2: Create the Pull Request

1. **Go to GitHub Repository**

   - Navigate to: `https://github.com/NepBio-Project/NepBioBatchRecords`

2. **Create Pull Request**

   - Click the **"Compare & pull request"** button (if you just pushed)
   - Or click **"Pull requests"** → **"New pull request"**

3. **Configure the PR**
   - **Base branch**: `main`
   - **Compare branch**: `feature/your-descriptive-branch-name`

### Step 3: Write a Good PR Description

Use this template:

```markdown
## 🎯 What does this PR do?

Brief description of the changes and why they're needed.

## 🔧 Changes Made

- [ ] Added new feature X
- [ ] Fixed bug in Y
- [ ] Updated documentation for Z

## 🧪 Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] No breaking changes

## 📸 Screenshots (if applicable)

Add screenshots of UI changes here.

## 🔍 Review Checklist

- [ ] Code follows project standards
- [ ] No console.log statements left
- [ ] Error handling implemented
- [ ] Documentation updated
- [ ] No sensitive data exposed

## 🚀 Deployment Notes

Any special considerations for deployment.

## 📝 Additional Notes

Any other information reviewers should know.
```

### Step 4: Request Review

1. **Add Reviewers**

   - Click **"Reviewers"** on the right sidebar
   - Add team members who should review your code

2. **Add Labels** (if applicable)

   - `enhancement` for new features
   - `bug` for bug fixes
   - `documentation` for docs updates

3. **Submit for Review**
   - Click **"Create pull request"**

## 👀 Code Review Process

### For Reviewers

1. **Review the Code**

   - Check the code quality
   - Verify it follows standards
   - Test the functionality
   - Review the documentation

2. **Provide Feedback**
   - Use the **"Review changes"** button
   - Choose one of three options:

#### ✅ **Approve**

- Code meets all standards
- Ready to merge
- No changes needed

#### ❌ **Request Changes**

- Major issues found
- Must be fixed before merging
- Provide specific feedback

#### 💬 **Comment**

- Minor suggestions
- Optional improvements
- Still allows merging

### For PR Authors

1. **Address Feedback**

   ```bash
   # Make requested changes
   git add .
   git commit -m "address review feedback"
   git push origin feature/your-descriptive-branch-name
   ```

2. **Re-request Review** (if changes were made)

   - Go back to your PR on GitHub
   - Click **"Re-request review"** for the original reviewer

3. **Respond to Comments**
   - Reply to review comments
   - Explain your decisions if needed

## 🔀 Merging and Cleanup

### When Ready to Merge

1. **Ensure Approval**

   - At least one team member has approved
   - All requested changes are addressed

2. **Merge the PR**

   - Click **"Merge pull request"**
   - Choose merge strategy (usually "Squash and merge")
   - Write a descriptive commit message

3. **Delete the Branch**
   - Click **"Delete branch"** after merging
   - This keeps the repository clean

### Post-Merge Cleanup

1. **Update Local Repository**

   ```bash
   git checkout main
   git pull origin main
   ```

2. **Delete Local Branch**

   ```bash
   git branch -d feature/your-descriptive-branch-name
   ```

3. **Verify Clean State**
   ```bash
   git branch
   # Should only show main and any other active branches
   ```

## 🔄 Common Workflows

### Feature Development Workflow

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes and commit
git add .
git commit -m "feat: implement new feature"

# 4. Push to GitHub
git push -u origin feature/new-feature

# 5. Create PR on GitHub
# 6. Get review and approval
# 7. Merge and cleanup
```

### Hotfix Workflow

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b feature/hotfix-critical-bug

# 2. Fix the issue
git add .
git commit -m "fix: resolve critical bug"

# 3. Push and create PR
git push -u origin feature/hotfix-critical-bug

# 4. Expedited review and merge
```

### Updating an Existing PR

```bash
# 1. Make additional changes
git add .
git commit -m "feat: add additional functionality"

# 2. Push updates
git push origin feature/your-branch-name

# 3. PR automatically updates on GitHub
```

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. **Merge Conflicts**

```bash
# When you get merge conflicts
git status  # See conflicted files
# Edit conflicted files manually
git add resolved-file.ts
git commit -m "resolve merge conflicts"
git push origin feature/your-branch-name
```

#### 2. **Accidentally Committed to Main**

```bash
# Create a new branch with your changes
git checkout -b feature/save-main-changes
git checkout main
git reset --hard origin/main  # Reset main to remote state
```

#### 3. **Wrong Branch Name**

```bash
# Rename your branch
git branch -m feature/old-name feature/new-name
git push origin feature/new-name
git push origin --delete feature/old-name
```

#### 4. **Lost Local Changes**

```bash
# Check git reflog for recent commits
git reflog
# Reset to the commit you want
git reset --hard HEAD@{n}
```

### Git Commands Cheat Sheet

```bash
# Branch Management
git branch                    # List branches
git branch -a                 # List all branches (local + remote)
git checkout branch-name      # Switch to branch
git checkout -b new-branch    # Create and switch to new branch
git branch -d branch-name     # Delete local branch

# Status and Changes
git status                    # Check current status
git diff                      # See unstaged changes
git diff --staged            # See staged changes
git log --oneline            # See commit history

# Staging and Committing
git add filename              # Stage specific file
git add .                     # Stage all changes
git commit -m "message"       # Commit staged changes
git commit -am "message"      # Stage and commit all tracked files

# Remote Operations
git push origin branch-name   # Push branch to remote
git pull origin branch-name   # Pull changes from remote
git fetch origin              # Fetch remote changes without merging

# Undoing Changes
git reset --soft HEAD~1       # Undo last commit, keep changes staged
git reset --mixed HEAD~1      # Undo last commit, unstage changes
git reset --hard HEAD~1       # Undo last commit, discard changes
git checkout -- filename      # Discard changes in specific file
```

## 📚 Best Practices

### Commit Messages

- Use conventional commit format: `type: description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep descriptions clear and concise

### Code Quality

- Write clean, readable code
- Add comments for complex logic
- Follow project coding standards
- Write tests for new features

### Communication

- Be responsive to review comments
- Explain your decisions when needed
- Ask questions if requirements are unclear
- Keep PRs focused and manageable

### Security

- Never commit sensitive data (passwords, API keys)
- Use environment variables for configuration
- Review code for security vulnerabilities

---

## 🎉 Congratulations!

You now have a solid understanding of GitHub workflow and our development standards. Remember:

1. **Always use `feature/` prefix** for branches
2. **Get reviews before merging**
3. **Keep branches clean and focused**
4. **Communicate effectively with your team**

Happy coding! 🚀