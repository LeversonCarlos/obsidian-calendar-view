# 🧾 Versioning (Internal Use Only)

To release a new version of the plugin, follow these steps:

1. **Update version in `package.json`**  
   Make sure to increment the version number (e.g., `1.0.1`). This version will be referenced in all steps below.

2. **Run the version script**  
   ```bash
   npm run version
   ```

3. **Commit the changes**  
   ```bash
   git add .
   git commit -m "Version bump"
   ```

4. **Tag the release**  
   ```bash
   git tag -a 1.0.1 -m "1.0.1"
   ```

5. **Push the tag to GitHub**  
   ```bash
   git push origin 1.0.1
   ```

> For reference: [Obsidian Plugin Release Docs](https://docs.obsidian.md/Plugins/Releasing/Release+your+plugin+with+GitHub+Actions)
