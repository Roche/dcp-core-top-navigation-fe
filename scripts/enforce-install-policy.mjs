const command = process.env.npm_command;

const buildPolicyOptions = () => {
  if (command === 'update') {
    return {
      guardedCommand: 'update',
      allowEnvVar: 'ALLOW_NPM_UPDATE'
    };
  }

  if (command === 'audit') {
    return {
      guardedCommand: 'audit',
      guardedCommandLabel: 'audit fix',
      allowEnvVar: 'ALLOW_NPM_AUDIT_FIX',
      guardAuditFixOnly: true
    };
  }

  return {
    guardedCommand: 'install',
    allowEnvVar: 'ALLOW_NPM_INSTALL'
  };
};

try {
  const shared = await import('@open-dcp/utilities/node/enforceInstallPolicy');
  const exitCode = await shared.enforceInstallPolicy(buildPolicyOptions());
  process.exit(exitCode);
} catch {
  console.error('[dependency-policy] Missing shared utility module: @open-dcp/utilities/node/enforceInstallPolicy');
  console.error('[dependency-policy] Publish/update @open-dcp/utilities in this app, then retry.');
  process.exit(1);
}