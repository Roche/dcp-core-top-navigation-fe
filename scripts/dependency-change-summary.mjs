try {
    const shared = await import('@open-dcp/utilities/node/dependencyChangeSummary');
    const result = shared.generateDependencyChangeSummary({ baselineRef: 'HEAD' });
    console.log(`[dependency-summary] Report written: ${result.reportPath}`);
    console.log(`[dependency-summary] Updated: ${result.updated.length}, Added: ${result.added.length}, Removed: ${result.removed.length}`);
  } catch {
    console.error('[dependency-summary] Missing shared utility module: @open-dcp/utilities/node/dependencyChangeSummary');
    console.error('[dependency-summary] Publish/update @open-dcp/utilities in this app, then retry.');
    process.exit(1);
  }