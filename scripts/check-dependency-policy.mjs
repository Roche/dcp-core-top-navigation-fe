const branch =
  process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME ||
  process.env.CI_COMMIT_BRANCH ||
  '';

let checkDependencyPolicy;

try {
  ({ checkDependencyPolicy } = await import('@open-dcp/utilities/node/checkDependencyPolicy'));
} catch {
  console.error('[dependency-policy] Missing shared utility module: @open-dcp/utilities/node/checkDependencyPolicy');
  console.error('[dependency-policy] Publish/update @open-dcp/utilities in this app, then retry.');
  process.exit(1);
}

const result = checkDependencyPolicy({ branch });

if (!result.checked) {
  console.log(`[dependency-policy] Prerelease packages allowed for branch "${branch || 'local'}"`);
  process.exit(0);
}

if (result.violations.length > 0) {
  console.error(`[dependency-policy] Prerelease @open-dcp/ packages are not allowed on branch "${branch}":`);
  for (const violation of result.violations) {
    console.error(`  - ${violation.name}@${violation.version}`);
  }
  process.exit(1);
}

console.log(`[dependency-policy] No prerelease @open-dcp/ packages found for branch "${branch}"`);