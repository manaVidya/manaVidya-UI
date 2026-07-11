import { useState, type FormEvent } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { slideUp, staggerContainer } from '../../lib/motion';
import { useAuth } from '../../hooks/useAuth';
import * as authApi from '../../lib/authApi';
import { getErrorMessage } from '../../lib/getErrorMessage';

const MotionStack = motion(Stack);

type Step = 'login' | 'reset-request' | 'reset-confirm' | 'first-login';

const MOBILE_PATTERN = /^[6-9]\d{9}$/;
// Mirrors PASSWORD_POLICY_REGEX in the backend's auth.constants.ts — kept in sync so the
// error surfaces here instead of round-tripping to the server for an avoidable 400.
const PASSWORD_HELPER_TEXT =
  'At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.';

interface PasswordCheck {
  label: string;
  met: boolean;
}

function getPasswordChecks(value: string): PasswordCheck[] {
  return [
    { label: 'At least 8 characters', met: value.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(value) },
    { label: 'One lowercase letter', met: /[a-z]/.test(value) },
    { label: 'One number', met: /\d/.test(value) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(value) },
  ];
}

function PasswordChecklist({ value }: { value: string }) {
  const checks = getPasswordChecks(value);
  return (
    <Stack spacing={0.5} sx={{ pl: 0.5 }}>
      {checks.map((check) => (
        <Stack key={check.label} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {check.met ? (
            <CheckCircle2 size={15} color="var(--status-success-500)" style={{ flexShrink: 0 }} />
          ) : (
            <Circle size={15} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
          )}
          <Typography
            variant="caption"
            sx={{
              color: check.met ? 'var(--status-success-500)' : 'text.secondary',
              textDecoration: check.met ? 'line-through' : 'none',
            }}
          >
            {check.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, logout } = useAuth();

  const [step, setStep] = useState<Step>('login');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function resetMessages() {
    setError(null);
    setNotice(null);
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    resetMessages();

    if (!MOBILE_PATTERN.test(mobileNumber)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await authApi.login(mobileNumber, password);

      if (user.mustResetPassword) {
        // Don't hand out a portal session on a first-login DOB password —
        // force a verified reset (current password re-entered, not an OTP)
        // before the account is usable.
        logout();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setStep('first-login');
        return;
      }

      setUser(user);
      void navigate(`/${user.portal}`);
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid mobile number or password.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function sendResetCode() {
    resetMessages();

    if (!MOBILE_PATTERN.test(mobileNumber)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const { message } = await authApi.forgotPassword(mobileNumber);
      setNotice(message);
      setStep('reset-confirm');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function handleRequestReset(e: FormEvent) {
    e.preventDefault();
    void sendResetCode();
  }

  async function handleConfirmReset(e: FormEvent) {
    e.preventDefault();
    resetMessages();

    if (!getPasswordChecks(newPassword).every((check) => check.met)) {
      setError(`New password does not meet requirements. ${PASSWORD_HELPER_TEXT}`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await authApi.resetPassword(mobileNumber, otp, newPassword);
      setPassword('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setNotice('Password updated. Log in with your new password.');
      setStep('login');
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid or expired OTP.'));
    } finally {
      setSubmitting(false);
    }
  }

  // First-login forced reset: verifies the current (default) password directly, no OTP.
  // Success/failure is surfaced entirely by the global toast off the API response — this
  // handler never sets a hardcoded inline message for the API result.
  const firstLoginChecks = getPasswordChecks(newPassword);
  const firstLoginPasswordValid = firstLoginChecks.every((check) => check.met);
  const firstLoginPasswordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const canSubmitFirstLogin =
    currentPassword.length > 0 && firstLoginPasswordValid && firstLoginPasswordsMatch;

  async function handleFirstLoginSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmitFirstLogin) return;

    setSubmitting(true);
    try {
      await authApi.changePassword(mobileNumber, currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStep('login');
    } catch {
      // The global toast (sourced from the API's own error message) already covers this.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <MotionStack
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
        spacing={4}
        sx={{ alignItems: 'center', maxWidth: 420, width: '100%' }}
      >
        <motion.div variants={slideUp} style={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome to ManaVidya
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {step === 'login' && 'Log in with your registered mobile number.'}
            {step === 'reset-request' && "Enter your mobile number and we'll send a reset code."}
            {step === 'reset-confirm' && 'Enter the code we sent and choose a new password.'}
            {step === 'first-login' &&
              'First login detected. Enter your current password and set a new one to continue.'}
          </Typography>
        </motion.div>

        <motion.div variants={slideUp} style={{ width: '100%' }}>
          <Card
            sx={{
              width: '100%',
              borderRadius: 3,
              p: 4,
              border: '1px solid var(--portal-500)',
              background: 'var(--bg-surface-1)',
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {notice && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {notice}
              </Alert>
            )}

            {step === 'login' && (
              <Stack component="form" spacing={2.5} onSubmit={(e) => void handleLogin(e)}>
                <TextField
                  label="Mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  inputMode="numeric"
                  autoComplete="tel"
                  fullWidth
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  fullWidth
                >
                  {submitting ? 'Logging in…' : 'Log in'}
                </Button>
                <MuiLink
                  component="button"
                  type="button"
                  variant="body2"
                  underline="hover"
                  sx={{ alignSelf: 'center' }}
                  onClick={() => {
                    resetMessages();
                    setStep('reset-request');
                  }}
                >
                  Forgot password?
                </MuiLink>
              </Stack>
            )}

            {step === 'reset-request' && (
              <Stack component="form" spacing={2.5} onSubmit={handleRequestReset}>
                <TextField
                  label="Mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  inputMode="numeric"
                  autoComplete="tel"
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  fullWidth
                >
                  {submitting ? 'Sending…' : 'Send reset code'}
                </Button>
                <MuiLink
                  component="button"
                  type="button"
                  variant="body2"
                  underline="hover"
                  sx={{ alignSelf: 'center' }}
                  onClick={() => {
                    resetMessages();
                    setStep('login');
                  }}
                >
                  Back to log in
                </MuiLink>
              </Stack>
            )}

            {step === 'reset-confirm' && (
              <Stack component="form" spacing={2.5} onSubmit={(e) => void handleConfirmReset(e)}>
                <TextField label="Mobile number" value={mobileNumber} fullWidth disabled />
                <TextField
                  label="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric"
                  fullWidth
                  required
                />
                <TextField
                  label="New password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  helperText={PASSWORD_HELPER_TEXT}
                  fullWidth
                  required
                />
                <TextField
                  label="Confirm new password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  fullWidth
                >
                  {submitting ? 'Updating…' : 'Set new password'}
                </Button>
                <MuiLink
                  component="button"
                  type="button"
                  variant="body2"
                  underline="hover"
                  sx={{ alignSelf: 'center' }}
                  onClick={() => void sendResetCode()}
                >
                  Resend code
                </MuiLink>
              </Stack>
            )}

            {step === 'first-login' && (
              <Stack
                component="form"
                spacing={2.5}
                onSubmit={(e) => void handleFirstLoginSubmit(e)}
              >
                <TextField label="Mobile number" value={mobileNumber} fullWidth disabled />
                <TextField
                  label="Current (default) password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  fullWidth
                  required
                  autoFocus
                />
                <TextField
                  label="New password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  fullWidth
                  required
                />
                <PasswordChecklist value={newPassword} />
                <TextField
                  label="Confirm new password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  fullWidth
                  required
                  error={confirmPassword.length > 0 && !firstLoginPasswordsMatch}
                  helperText={
                    confirmPassword.length > 0 && !firstLoginPasswordsMatch
                      ? 'Passwords do not match.'
                      : ' '
                  }
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting || !canSubmitFirstLogin}
                  fullWidth
                >
                  {submitting ? 'Updating…' : 'Set new password'}
                </Button>
              </Stack>
            )}
          </Card>
        </motion.div>
      </MotionStack>
    </Box>
  );
}
