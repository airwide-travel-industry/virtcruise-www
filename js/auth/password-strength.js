const commonPasswords = new Set(['password1234', 'qwerty123456', 'virtcruise123']);

export function passwordStrength(password, email = '') {
  let score = 0;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const emailName = email.split('@')[0]?.toLowerCase();
  if (commonPasswords.has(password.toLowerCase()) ||
      (emailName?.length > 2 && password.toLowerCase().includes(emailName))) score = Math.min(score, 1);
  const level = score <= 1 ? 'weak' : score <= 3 ? 'fair' : 'strong';
  return {
    level,
    score,
    label: { weak: 'Weak', fair: 'Fair', strong: 'Strong' }[level],
    valid: password.length >= 12 && score >= 2
  };
}
