import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel as MuiInputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField as MuiTextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Camera, Plus, Save, X } from 'lucide-react';
import type { CreateTeacherPayload, TeacherDetail } from '../../lib/teachersApi';
import { fetchSubjects } from '../../lib/subjectsApi';
import { ACADEMIC_YEARS } from '../../lib/academicYears';

interface CreateTeacherDialogProps {
  open: boolean;
  onClose: () => void;
  /** Receives the API-shaped payload; throw/reject to keep the dialog open on failure. */
  onSubmit: (payload: CreateTeacherPayload) => Promise<void>;
  /** When set, the dialog opens prefilled in edit mode. */
  initial?: TeacherDetail | null;
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
const DEPARTMENTS = ['Primary', 'Secondary', 'Higher Secondary', 'Administration'];
const DESIGNATIONS = [
  'Teacher',
  'Head of Department',
  'Principal',
  'Vice Principal',
  'Librarian',
  'Lab Assistant',
];
const EMPLOYEE_TYPES = ['Full Time', 'Part Time', 'Contract'];
const EMPLOYMENT_STATUSES = ['Active', 'On Leave', 'Inactive'];
const CLASS_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const SECTION_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

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

function getInitialForm(initial?: TeacherDetail | null) {
  const [firstName = '', ...restName] = (initial?.user.name ?? '').split(' ');

  return {
    employeeId: initial?.employeeCode ?? `EMP${String(Date.now()).slice(-6)}`,
    firstName,
    lastName: restName.join(' '),
    gender: initial?.gender ? (GENDER_FROM_API[initial.gender] ?? '') : '',
    dob: toDateInput(initial?.dob),
    bloodGroup: initial?.bloodGroup ?? '',
    aadhaar: initial?.aadhaar ?? '',
    profilePhoto: '',
    mobile: initial?.user.mobileNumber ?? '',
    alternateMobile: initial?.alternateMobile ?? '',
    email: initial?.user.email ?? '',
    addressLine1: initial?.address?.line1 ?? '',
    addressLine2: initial?.address?.line2 ?? '',
    city: initial?.address?.city ?? '',
    state: initial?.address?.state ?? '',
    country: initial?.address?.country ?? 'India',
    pincode: initial?.address?.pincode ?? '',
    department: initial?.department ?? '',
    designation: initial?.designation ?? '',
    subjects: initial?.subjects ?? [],
    employeeType: initial?.employeeType ?? '',
    joiningDate: toDateInput(initial?.joiningDate),
    experience: initial?.experienceYears != null ? String(initial.experienceYears) : '',
    qualification: initial?.qualification ?? '',
    previousSchool: initial?.previousSchool ?? '',
    salary: initial?.salary ?? '',
    employmentStatus: 'Active',
    classes: [] as string[],
    sections: [] as string[],
    classTeacher: false,
    subjectsAssigned: initial?.subjects ?? [],
    academicYear: initial?.academicYear ?? '',
  };
}

type FormState = ReturnType<typeof getInitialForm>;

/** Last-10-digits sanitizer — tolerates "+91 90000 00000" style input. */
const toMobile = (value: string) => value.replace(/\D/g, '').slice(-10);

// classes/sections/classTeacher/employmentStatus stay UI-only for now — class
// assignment is a separate module (Class.classTeacherId) and isn't sent on create.
function buildPayload(form: FormState): CreateTeacherPayload {
  const hasAddress =
    form.addressLine1 || form.addressLine2 || form.city || form.state || form.pincode;

  return {
    teacher: {
      name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      mobileNumber: toMobile(form.mobile),
      alternateMobile: form.alternateMobile.trim() || undefined,
      email: form.email.trim() || undefined,
      employeeCode: form.employeeId.trim(),
      gender: GENDER_TO_API[form.gender],
      dob: form.dob || undefined,
      bloodGroup: form.bloodGroup || undefined,
      aadhaar: form.aadhaar.trim() || undefined,
      department: form.department || undefined,
      designation: form.designation || undefined,
      subjects: form.subjects,
      employeeType: form.employeeType || undefined,
      joiningDate: form.joiningDate || undefined,
      experienceYears: form.experience ? Number(form.experience) : undefined,
      qualification: form.qualification.trim() || undefined,
      previousSchool: form.previousSchool.trim() || undefined,
      salary: form.salary ? Number(form.salary) : undefined,
      academicYear: form.academicYear || undefined,
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

export function CreateTeacherDialog({
  open,
  onClose,
  onSubmit,
  initial,
}: CreateTeacherDialogProps) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<FormState>(() => getInitialForm(initial));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: subjects, isPending: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
    enabled: open,
  });
  const activeSubjectNames = useMemo(
    () => (subjects ?? []).filter((s) => s.isActive).map((s) => s.name),
    [subjects],
  );

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    updateField(field, e.target.value as FormState[typeof field]);
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
  const isRequiredArray = (value: string[]) => value.length > 0;

  const requiredFields: {
    key: keyof FormState;
    validate: (v: FormState[keyof FormState]) => boolean;
  }[] = [
    { key: 'employeeId', validate: (v) => isRequiredString(v as string) },
    { key: 'firstName', validate: (v) => isRequiredString(v as string) },
    { key: 'lastName', validate: (v) => isRequiredString(v as string) },
    { key: 'gender', validate: (v) => isRequiredString(v as string) },
    { key: 'dob', validate: (v) => isRequiredString(v as string) },
    { key: 'mobile', validate: (v) => isRequiredString(v as string) },
    { key: 'department', validate: (v) => isRequiredString(v as string) },
    { key: 'designation', validate: (v) => isRequiredString(v as string) },
    { key: 'subjects', validate: (v) => isRequiredArray(v as string[]) },
    { key: 'employeeType', validate: (v) => isRequiredString(v as string) },
    { key: 'employmentStatus', validate: (v) => isRequiredString(v as string) },
    { key: 'classes', validate: (v) => isRequiredArray(v as string[]) },
    { key: 'sections', validate: (v) => isRequiredArray(v as string[]) },
    { key: 'subjectsAssigned', validate: (v) => isRequiredArray(v as string[]) },
    { key: 'academicYear', validate: (v) => isRequiredString(v as string) },
  ];

  const canSubmit = requiredFields.every(({ key, validate }) => validate(form[key]));

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

  const renderError = (field: keyof FormState, message: string) => {
    return touched[field] && !requiredFields.find((r) => r.key === field)?.validate(form[field])
      ? message
      : '';
  };

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
            borderRadius: 3,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
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
          {isEdit ? `Edit Teacher — ${initial?.displayId ?? ''}` : 'Create Teacher'}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'var(--text-secondary)' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ overflowY: 'auto' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Fill in the teacher profile. Fields marked with * are required.
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
            <FormControl fullWidth error={!!renderError('gender', 'Required')}>
              <StableInputLabel>Gender *</StableInputLabel>
              <Select
                value={form.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                onBlur={handleBlur('gender')}
                label="Gender *"
              >
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
              label="Date of Birth *"
              type="date"
              fullWidth
              value={form.dob}
              onChange={handleTextChange('dob')}
              onBlur={handleBlur('dob')}
              error={!!renderError('dob', 'Required')}
              helperText={renderError('dob', 'Date of birth is required')}
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

        {/* Professional Information */}
        <SectionHeader title="3. Professional Information" />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth error={!!renderError('department', 'Required')}>
              <StableInputLabel>Department *</StableInputLabel>
              <Select
                value={form.department}
                onChange={(e) => updateField('department', e.target.value)}
                onBlur={handleBlur('department')}
                label="Department *"
              >
                {DEPARTMENTS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth error={!!renderError('designation', 'Required')}>
              <StableInputLabel>Designation *</StableInputLabel>
              <Select
                value={form.designation}
                onChange={(e) => updateField('designation', e.target.value)}
                onBlur={handleBlur('designation')}
                label="Designation *"
              >
                {DESIGNATIONS.map((d) => (
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
                {EMPLOYEE_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl
              fullWidth
              error={!!renderError('subjects', 'Required')}
              disabled={subjectsLoading}
            >
              <StableInputLabel>Subjects *</StableInputLabel>
              <Select
                multiple
                value={form.subjects}
                onChange={(e) => updateField('subjects', e.target.value as string[])}
                onBlur={handleBlur('subjects')}
                input={<OutlinedInput label="Subjects *" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {activeSubjectNames.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StableTextField
              label="Qualification"
              fullWidth
              value={form.qualification}
              onChange={handleTextChange('qualification')}
              placeholder="Optional"
            />
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
              label="Previous School"
              fullWidth
              value={form.previousSchool}
              onChange={handleTextChange('previousSchool')}
              placeholder="Optional"
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
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <StableInputLabel>Employment Status</StableInputLabel>
              <Select
                value={form.employmentStatus}
                onChange={(e) => updateField('employmentStatus', e.target.value)}
                label="Employment Status"
              >
                {EMPLOYMENT_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Class Assignment */}
        <SectionHeader title="4. Class Assignment" />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth error={!!renderError('classes', 'Required')}>
              <StableInputLabel>Class *</StableInputLabel>
              <Select
                multiple
                value={form.classes}
                onChange={(e) => updateField('classes', e.target.value as string[])}
                onBlur={handleBlur('classes')}
                input={<OutlinedInput label="Class *" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {CLASS_OPTIONS.map((c) => (
                  <MenuItem key={c} value={c}>
                    Class {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth error={!!renderError('sections', 'Required')}>
              <StableInputLabel>Section *</StableInputLabel>
              <Select
                multiple
                value={form.sections}
                onChange={(e) => updateField('sections', e.target.value as string[])}
                onBlur={handleBlur('sections')}
                input={<OutlinedInput label="Section *" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {SECTION_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    Section {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <StableInputLabel>Academic Year *</StableInputLabel>
              <Select
                value={form.academicYear}
                onChange={(e) => updateField('academicYear', e.target.value)}
                onBlur={handleBlur('academicYear')}
                label="Academic Year *"
              >
                {ACADEMIC_YEARS.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl
              fullWidth
              error={!!renderError('subjectsAssigned', 'Required')}
              disabled={subjectsLoading}
            >
              <StableInputLabel>Subjects Assigned *</StableInputLabel>
              <Select
                multiple
                value={form.subjectsAssigned}
                onChange={(e) => updateField('subjectsAssigned', e.target.value as string[])}
                onBlur={handleBlur('subjectsAssigned')}
                input={<OutlinedInput label="Subjects Assigned *" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {activeSubjectNames.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.classTeacher}
                  onChange={(e) => updateField('classTeacher', e.target.checked)}
                />
              }
              label="Class Teacher"
              sx={{ mt: 1 }}
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
              : 'Create Teacher'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
