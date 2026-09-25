# Resume site: a GitHub Actions practice repo

A static resume page with a real pipeline around it: lint, test, build, deploy.
Edit `index.html` with your own details, then use the exercises below to learn Actions by breaking and fixing things.

## Run it locally

```bash
npm install
npm run lint      # HTML checks (htmlhint)
npm test          # node's built-in test runner
npm run build     # writes dist/ and stamps the commit into the footer
npm run preview   # serve dist/ at http://localhost:3000
```

## Put it on GitHub

```bash
git init -b main
git add .
git commit -m "Initial resume site"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then enable Pages: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
Open the **Actions** tab and watch the *Deploy* workflow run. Your site appears at `https://<you>.github.io/<repo>/`.

## What is in the pipeline

| File | Runs on | Does |
|---|---|---|
| `.github/workflows/ci.yml` | pushes to any branch except `main`, and pull requests | `lint` and `test` (Node 20 and 22) in parallel, then `build` and upload the site as an artifact |
| `.github/workflows/deploy.yml` | push to `main`, or manually | lint, test, build, then publish to GitHub Pages |

## Exercises

Do these in order. Each one teaches one idea.

1. **Green run.** Push to `main` and watch every step. Open the job log and find where `npm ci` and `npm test` ran.
2. **Break a test on purpose.** Change the `<title>` in `index.html` to an empty one. Push, watch the run fail, read the error, fix it.
3. **Feature branch and PR.** Create a branch, edit your About text, push it. Open a pull request and see the `CI` checks appear on it. The `Deploy` workflow does not run yet.
4. **Branch protection.** Settings > Branches > add a rule for `main` that requires the `lint`, `test` and `build` checks. Now a red PR cannot merge.
5. **Read the matrix.** In the `test` job, see how `matrix.node` creates two jobs. Add Node 24 and push.
6. **Download an artifact.** Open a finished CI run and download the `site` artifact. Unzip it and compare with `dist/`.
7. **Find your commit on the live site.** The footer shows the short SHA that built the page. Compare it with `git log -1 --oneline`.
8. **Add a check.** Write a new test in `tests/site.test.mjs`, for example that every `<a>` with `href="mailto:` contains an `@`. Push and see it run.
9. **Add a scheduled job.** Create `.github/workflows/links.yml` with `on: schedule: - cron: "0 6 * * 1"` that checks your external links weekly.
10. **Add a secret.** Settings > Secrets and variables > Actions. Add `SITE_NAME`, then print it in a step with `${{ secrets.SITE_NAME }}` and see that GitHub masks it in the log.
11. **Reuse a workflow.** Turn the lint and test steps into a reusable workflow (`on: workflow_call`) and call it from both `ci.yml` and `deploy.yml`, so the checks are defined once.
12. **Deploy previews (stretch).** Build on pull requests and publish to a second environment.
