import { useRef, useState, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel as MuiInputLabel,
  MenuItem,
  Select,
  TextField as MuiTextField,
  Typography,
} from '@mui/material';
import { Camera, Plus, Save, X } from 'lucide-react';
import type {
  CreateNonTeachingStaffPayload,
  NonTeachingStaffDetail,
} from '../../lib/nonTeachingStaffApi';

interface CreateNonTeachingStaffDialogProps {
  open: boolean;
  onClose: () => void;
  /** Receives the API-shaped payload; throw/reject to keep the dialog open on failure. */
  onSubmit: (payload: CreateNonTeachingStaffPayload) => Promise<void>;
  /** When set, the dialog opens prefilled in edit mode. */
  initial?: NonTeachingStaffDetail | null;
}

const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STATES = [
  'Andhra Pradesh',
  'Telangana',
  'Karnataka',
  'Tamil Nadu',
  'Kerala',
  'Maharashtra',
  'Delhi',
  'Uttar Pradesh',
  'West Bengal',
  'Rajasthan',
  'Gujarat',
  'Madhya Pradesh',
  'Bihar',
  'Punjab',
  'Haryana',
];
const COUNTRIES = ['India', 'Other'];
const STAFF_DEPARTMENTS = [
  'Accounts',
  'Administration',
  'Library',
  'Maintenance',
  'Security',
  'Transport',
  'IT',
];
const NON_TEACHING_DESIGNATIONS = [
  'Accountant',
  'Clerk',
  'Office Assistant',
  'Receptionist',
  'Librarian',
  'IT Support',
  'Security Guard',
  'Driver',
  'Peon',
  'AGM',
  'GM',
];
const EMPLOYEE_TYPES = ['Full Time', 'Part Time', 'Contract'];

/** UI labels ('Male') ↔ API enums ('MALE'). */
const GENDER_TO_API: Record<string, 'MALE' | 'FEMALE' | 'OTHER'> = {
  Male: 'MALE',
  Female: 'FEMALE',
  Other: 'OTHER',
};
const GENDER_FROM_API: Record<string, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
};

const toDateInput = (value: string | null | undefined) => (value ?? '').slice(0, 10);

function getInitialForm(initial?: NonTeachingStaffDetail | null) {
  const [firstName = '', ...restName] = (initial?.name ?? '').split(' ');

  return {
    employeeId: initial?.employeeCode ?? `STAFF${String(Date.now()).slice(-6)}`,
    firstName,
    lastName: restName.join(' '),
    gender: initial?.gender ? (GENDER_FROM_API[initial.gender] ?? '') : '',
    dob: toDateInput(initial?.dob),
    bloodGroup: initial?.bloodGroup ?? '',
    aadhaar: initial?.aadhaar ?? '',
    profilePhoto: '',
    mobile: initial?.mobileNumber ?? '',
    alternateMobile: initial?.alternateMobile ?? '',
    email: initial?.email ?? '',
    addressLine1: initial?.address?.line1 ?? '',
    addressLine2: initial?.address?.line2 ?? '',
    city: initial?.address?.city ?? '',
    state: initial?.address?.state ?? '',
    country: initial?.address?.country ?? 'India',
    pincode: initial?.address?.pincode ?? '',
    department: initial?.department ?? '',
    designation: initial?.designation ?? '',
    employeeType: initial?.employeeType ?? '',
    joiningDate: toDateInput(initial?.joiningDate),
    experience: initial?.experienceYears != null ? String(initial.experienceYears) : '',
    salary: initial?.salary ?? '',
  };
}

type FormState = ReturnType<typeof getInitialForm>;

/** Last-10-digits sanitizer — tolerates "+91 90000 00000" style input. */
const toMobile = (value: string) => value.replace(/\D/g, '').slice(-10);

function buildPayload(form: FormState): CreateNonTeachingStaffPayload {
  const hasAddress =
    form.addressLine1 || form.addressLine2 || form.city || form.state || form.pincode;

  return {
    staff: {
      name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      mobileNumber: toMobile(form.mobile),
      alternateMobile: form.alternateMobile.trim() || undefined,
      email: form.email.trim() || undefined,
      employeeCode: form.employeeId.trim(),
      designation: form.designation,
      department: form.department || undefined,
      gender: form.gender ? GENDER_TO_API[form.gender] : undefined,
      dob: form.dob || undefined,
      bloodGroup: form.bloodGroup || undefined,
      aadhaar: form.aadhaar.trim() || undefined,
      employeeType: form.employeeType || undefined,
      joiningDate: form.joiningDate || undefined,
      experienceYears: form.experience ? Number(form.experience) : undefined,
      salary: form.salary ? Number(form.salary) : undefined,
    },
    address: hasAddress
      ? {
          line1: form.addressLine1.trim() || undefined,
          line2: form.addressLine2.trim() || undefined,
          city: form.city.trim() || undefined,
          state: form.state || undefined,
          country: form.country || undefined,
          pincode: form.pincode.trim() || undefined,
        }
      : undefined,
  };
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Box sx={{ mt: 3, mb: 2, pb: 1, borderBottom: '1px solid var(--border-default)' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
        {title}
      </Typography>
    </Box>
  );
}

function StableTextField(props: React.ComponentProps<typeof MuiTextField>) {
  const { slotProps, ...rest } = props;
  return (
    <MuiTextField
      {...rest}
      slotProps={{
        ...slotProps,
        inputLabel: { shrink: true, ...slotProps?.inputLabel },
      }}
    />
  );
}

function StableInputLabel(props: React.ComponentProps<typeof MuiInputLabel>) {
  return <MuiInputLabel {...props} shrink />;
}

export function CreateNonTeachingStaffDialog({
  open,
  onClose,
  onSubmit,
  initial,
}: CreateNonTeachingStaffDialogProps) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<FormState>(() => getInitialForm(initial));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    updateField(field, e.target.value);
  };

  const handleBlur = (field: keyof FormState) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField('profilePhoto', URL.createObjectURL(file));
    }
  };

  const isRequiredString = (value: string) => value.trim().length > 0;

  const requiredFields: (keyof FormState)[] = [
    'employeeId',
    'firstName',
    'lastName',
    'mobile',
    'designation',
  ];

  const canSubmit = requiredFields.every((key) => isRequiredString(form[key]));

  // Success/failure feedback comes entirely from the global toast (the API's own
  // message) — this handler only closes/resets on success and stays open on failure.
  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(buildPayload(form));
      setForm(getInitialForm());
      setTouched({});
      onClose();
    } catch {
      // Toast already showed the API error; keep the dialog open for corrections.
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setForm(getInitialForm());
    setTouched({});
    onClose();
  };

  const renderError = (field: keyof FormState, message: string) =>
    touched[field] && !isRequiredString(form[field]) ? message : '';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      slotProps={{
        paper: {
          sx: {
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border-default)',
            borderRadius: '10px',
            maxHeight: '90vh',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pr: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {isEdit ? `Edit Staff — ${initial?.displayId ?? ''}` : 'Create Non-Teaching Staff'}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'var(--text-secondary)' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ overflowY: 'auto' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Fill in the staff profile. Fields marked with * are required.
        </Typography>

        {/* Personal Information */}
        <SectionHeader title="1. Personal Information" />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <StableTextField
              label="Employee ID *"
              fullWidth
              value={form.employeeId}
              onChange={handleTextChange('employeeId')}
              onBlur={handleBlur('employeeId')}
              error={!!renderError('employeeId', 'Required')}
              helperText={renderError('employeeId', 'Employee ID is required')}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StableTextField
              label="First Name *"
              fullWidth
              value={form.firstName}
              onChange={handleTextChange('firstName')}
              onBlur={handleBlur('firstName')}
              error={!!renderError('firstName', 'Required')}
              helperText={renderError('firstName', 'First name is required')}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StableTextField
              label="Last Name *"
              fullWidth
              value={form.lastName}
              onChange={handleTextChange('lastName')}
              onBlur={handleBlur('lastName')}
              error={!!renderError('lastName', 'Required')}
              helperText={renderError('lastName', 'Last name is required')}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <StableInputLabel>Gender</StableInputLabel>
              <Select
                value={form.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                label="Gender"
              >
                <MenuItem value="">None</MenuItem>
                {GENDERS.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StableTextField
              label="Date of Birth"
              type="date"
              fullWidth
              value={form.dob}
              onChange={handleTextChange('dob')}
              placeholder="Optional"
              slotProps={{
                htmlInput: { max: new Date().toISOString().split('T')[0] },
                inputLabel: { shrink: true },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <StableInputLabel>Blood Group</StableInputLabel>
              <Select
                value={form.bloodGroup}
                onChange={(e) => updateField('bloodGroup', e.target.value)}
                label="Blood Group"
              >
                <MenuItem value="">None</MenuItem>
                {BLOOD_GROUPS.map((bg) => (
                  <MenuItem key={bg} value={bg}>
                    {bg}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <StableTextField
              label="Aadhaar Number"
              fullWidth
              value={form.aadhaar}
              onChange={handleTextChange('aadhaar')}
              placeholder="Optional"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1.5,
                border: '1px dashed var(--border-default)',
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: form.profilePhoto
                    ? `url(${form.profilePhoto}) center/cover`
                    : 'var(--bg-surface-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  flexShrink: 0,
                }}
              >
                {!form.profilePhoto && <Camera size={22} />}
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Profile Photo
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Optional. JPG, PNG up to 2MB.
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ mt: 0.5, textTransform: 'none' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhotoUpload}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Contact Details */}
        <SectionHeader title="2. Contact Details" />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <StableTextField
              label="Mobile Number *"
              fullWidth
              value={form.mobile}
              onChange={handleTextChange('mobile')}
              onBlur={handleBlur('mobile')}
              error={!!renderError('mobile', 'Required')}
              helperText={renderError('mobile', 'Mobile number is required')}
              placeholder="+91 90000 00000"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StableTextField
              label="Alternate Mobile"
              fullWidth
              value={form.alternateMobile}
              onChange={handleTextChange('alternateMobile')}
              placeholder="Optional"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StableTextField
              label="Email Address"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleTextChange('email')}
              placeholder="Optional"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <StableTextField
              label="Address Line 1"
              fullWidth
              value={form.addressLine1}
              onChange={handleTextChange('addressLine1')}
              placeholder="Optional"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StableTextField
              label="Address Line 2"
              fullWidth
              value={form.addressLine2}
              onChange={handleTextChange('addressLine2')}
              placeholder="Optional"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <StableTextField
              label="City"
              fullWidth
              value={form.city}
              onChange={handleTextChange('city')}
              placeholder="Optional"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <StableInputLabel>State</StableInputLabel>
              <Select
                value={form.state}
                onChange={(e) => updateField('state', e.target.value)}
                label="State"
              >
                <MenuItem value="">None</MenuItem>
                {STATES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <StableInputLabel>Country</StableInputLabel>
              <Select
                value={form.country}
                onChange={(e) => updateField('country', e.target.value)}
                label="Country"
              >
                {COUNTRIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StableTextField
              label="Pincode"
              type="number"
              fullWidth
              value={form.pincode}
              onChange={handleTextChange('pincode')}
              placeholder="Optional"
            />
          </Grid>
        </Grid>

        {/* Employment Details */}
        <SectionHeader title="3. Employment Details" />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth error={!!renderError('designation', 'Required')}>
              <StableInputLabel>Designation *</StableInputLabel>
              <Select
                value={form.designation}
                onChange={(e) => updateField('designation', e.target.value)}
                onBlur={handleBlur('designation')}
                label="Designation *"
              >
                {NON_TEACHING_DESIGNATIONS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <StableInputLabel>Department</StableInputLabel>
              <Select
                value={form.department}
                onChange={(e) => updateField('department', e.target.value)}
                label="Department"
              >
                <MenuItem value="">None</MenuItem>
                {STAFF_DEPARTMENTS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <StableInputLabel>Employee Type</StableInputLabel>
              <Select
                value={form.employeeType}
                onChange={(e) => updateField('employeeType', e.target.value)}
                label="Employee Type"
              >
                <MenuItem value="">None</MenuItem>
                {EMPLOYEE_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <StableTextField
              label="Joining Date"
              type="date"
              fullWidth
              value={form.joiningDate}
              onChange={handleTextChange('joiningDate')}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StableTextField
              label="Experience (Years)"
              type="number"
              fullWidth
              value={form.experience}
              onChange={handleTextChange('experience')}
              placeholder="Optional"
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StableTextField
              label="Salary"
              type="number"
              fullWidth
              value={form.salary}
              onChange={handleTextChange('salary')}
              placeholder="Optional"
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit" disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!canSubmit || submitting}
          startIcon={isEdit ? <Save size={18} /> : <Plus size={18} />}
          onClick={() => void handleSubmit()}
        >
          {submitting
            ? isEdit
              ? 'Saving…'
              : 'Creating…'
            : isEdit
              ? 'Save Changes'
              : 'Create Staff'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
