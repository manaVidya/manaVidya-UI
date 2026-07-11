import { useState, type ChangeEvent } from 'react';
import {
  Box,
  Button,
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
  Select,
  Switch,
  Tab,
  Tabs,
  TextField as MuiTextField,
  Typography,
} from '@mui/material';
import { Plus, X } from 'lucide-react';
import type { StudentRow } from '../../lib/mockData';

interface CreateStudentDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (student: StudentRow) => void;
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
const MEDIUMS = ['English', 'Telugu', 'Hindi', 'Urdu', 'Tamil', 'Kannada'];
const HOUSES = ['Red', 'Blue', 'Green', 'Yellow'];
const STUDENT_STATUSES = ['Active', 'Transferred', 'Alumni', 'Suspended'];
const ACADEMIC_YEARS = ['2024-25', '2025-26', '2026-27'];

function getInitialForm() {
  return {
    // 1. Student Information
    studentId: `STU${String(Date.now()).slice(-6)}`,
    password: Math.random().toString(36).slice(2, 10),
    name: '',
    gender: '',
    dob: '',
    admissionNumber: '',
    admissionDate: '',
    bloodGroup: '',
    profilePhoto: '',
    rollNo: '',
    className: '',
    section: '',

    // 2. Parent Information
    fatherName: '',
    motherName: '',
    fatherPhone: '',
    motherPhone: '',
    parentEmail: '',
    guardianName: '',
    guardianRelationship: '',
    emergencyContact: '',
    guardianPhone: '',

    // 3. Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',

    // 4. Academic Information
    academicYear: '',
    previousSchool: '',
    mediumOfInstruction: '',
    house: '',
    studentStatus: 'Active',

    // 5. Medical Information
    age: '',
    heightCm: '',
    weightKg: '',
    allergies: '',
    medicalConditions: '',
    disability: false,
    doctorName: '',
    emergencyMedicalNotes: '',

    // 6. Identity Details
    aadhaar: '',
    birthCertificateNumber: '',
    passportNumber: '',

    // 7. Transport
    transportRequired: false,
    route: '',
    busNumber: '',
    pickupPoint: '',

    // 8. Fee Information
    feeCategory: '',
    scholarship: '',
    feeConcession: '',
    paymentStatus: '',

    // 9. Login Information
    username: '',
    email: '',
    accountStatus: 'Active',

    // 10. Documents
    aadhaarDoc: '',
    birthCertificate: '',
    transferCertificate: '',
    previousMarksMemo: '',
    medicalCertificate: '',
  };
}

type FormState = ReturnType<typeof getInitialForm>;

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
  const merged = {
    ...slotProps,
    inputLabel: { shrink: true, ...(slotProps?.inputLabel as object) },
  };
  return <MuiTextField {...rest} slotProps={merged} />;
}

function StableInputLabel(props: React.ComponentProps<typeof MuiInputLabel>) {
  return <MuiInputLabel {...props} shrink />;
}

export function CreateStudentDialog({ open, onClose, onCreate }: CreateStudentDialogProps) {
  const [form, setForm] = useState<FormState>(getInitialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState(0);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    updateField(field, e.target.value as FormState[typeof field]);
  };

  const handleBlur = (field: keyof FormState) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isRequiredString = (value: string) => value.trim().length > 0;

  const requiredFields: (keyof FormState)[] = [
    'studentId',
    'name',
    'gender',
    'dob',
    'admissionNumber',
    'admissionDate',
    'bloodGroup',
    'rollNo',
    'className',
    'section',
    'fatherName',
    'motherName',
    'guardianPhone',
    'aadhaar',
  ];

  const canSubmit = requiredFields.every((field) => isRequiredString(form[field] as string));

  const handleSubmit = () => {
    if (!canSubmit) return;

    const newStudent: StudentRow = {
      id: `stu-${Date.now()}`,
      name: form.name.trim(),
      className: form.className.trim(),
      section: form.section.trim(),
      rollNo: form.rollNo.trim(),
      attendancePct: 100,
      guardianPhone: form.guardianPhone.trim(),

      // 1. Student Information
      studentId: form.studentId.trim(),
      gender: form.gender,
      dob: form.dob,
      admissionNumber: form.admissionNumber.trim(),
      admissionDate: form.admissionDate,
      bloodGroup: form.bloodGroup,
      profilePhoto: form.profilePhoto || undefined,

      // 2. Parent Information
      fatherName: form.fatherName.trim(),
      motherName: form.motherName.trim(),
      fatherPhone: form.fatherPhone.trim() || undefined,
      motherPhone: form.motherPhone.trim() || undefined,
      parentEmail: form.parentEmail.trim() || undefined,
      guardianName: form.guardianName.trim() || undefined,
      guardianRelationship: form.guardianRelationship.trim() || undefined,
      emergencyContact: form.emergencyContact.trim() || undefined,

      // 3. Address
      addressLine1: form.addressLine1.trim() || undefined,
      addressLine2: form.addressLine2.trim() || undefined,
      city: form.city.trim() || undefined,
      state: form.state || undefined,
      country: form.country || undefined,
      pincode: form.pincode.trim() || undefined,

      // 4. Academic
      academicYear: form.academicYear || undefined,
      previousSchool: form.previousSchool.trim() || undefined,
      mediumOfInstruction: form.mediumOfInstruction || undefined,
      house: form.house || undefined,
      studentStatus: form.studentStatus || undefined,

      // 5. Medical
      age: form.age ? Number(form.age) : undefined,
      heightCm: form.heightCm ? Number(form.heightCm) : undefined,
      weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      allergies: form.allergies.trim() || undefined,
      medicalConditions: form.medicalConditions.trim() || undefined,
      disability: form.disability,
      doctorName: form.doctorName.trim() || undefined,
      emergencyMedicalNotes: form.emergencyMedicalNotes.trim() || undefined,

      // 6. Identity
      aadhaar: form.aadhaar.trim(),
      birthCertificateNumber: form.birthCertificateNumber.trim() || undefined,
      passportNumber: form.passportNumber.trim() || undefined,

      // 7. Transport
      transportRequired: form.transportRequired,
      route: form.route.trim() || undefined,
      busNumber: form.busNumber.trim() || undefined,
      pickupPoint: form.pickupPoint.trim() || undefined,

      // 8. Fee
      // feeCategory: form.feeCategory || undefined,
      // scholarship: form.scholarship.trim() || undefined,
      // feeConcession: form.feeConcession || undefined,
      // paymentStatus: form.paymentStatus || undefined,

      // 9. Login
      // username: form.username.trim() || undefined,
      // password: form.password || undefined,
      email: form.email.trim() || undefined,
      // accountStatus: form.accountStatus || undefined,

      // 10. Documents
      // aadhaarDoc: form.aadhaarDoc || undefined,
      // birthCertificate: form.birthCertificate || undefined,
      // transferCertificate: form.transferCertificate || undefined,
      // previousMarksMemo: form.previousMarksMemo || undefined,
      // medicalCertificate: form.medicalCertificate || undefined,
    };

    onCreate(newStudent);
    setForm(getInitialForm());
    setTouched({});
    onClose();
  };

  const handleClose = () => {
    setForm(getInitialForm());
    setTouched({});
    onClose();
  };

  const renderError = (field: keyof FormState, message: string) => {
    return touched[field] && !isRequiredString(form[field] as string) ? message : '';
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
            backdropFilter: 'blur(8px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
            maxHeight: '90vh',
            willChange: 'transform',
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
          Create Student
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'var(--text-secondary)' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ overflowY: 'auto', overscrollBehavior: 'contain' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add a complete student profile. Fields marked with * are required.
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(_: React.SyntheticEvent, value: number) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2, borderBottom: '1px solid var(--border-default)' }}
        >
          <Tab label="Student & Parent" />
          <Tab label="Address & Academic" />
          <Tab label="Medical & Identity" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            {/* 1. Student Information */}
            <SectionHeader title="1. Student Information" />
            <Grid container spacing={2}>
              {/* <Grid size={{ xs: 12, md: 4 }}>
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
                      Optional. JPG, PNG.
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: 0.5, textTransform: 'none' }}
                      onClick={() => photoInputRef.current?.click()}
                    >
                      Upload
                    </Button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handlePhotoUpload}
                    />
                  </Box>
                </Box>
              </Grid> */}
              {/* <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Student ID *"
                  fullWidth
                  value={form.studentId}
                  onChange={handleTextChange('studentId')}
                  onBlur={handleBlur('studentId')}
                  error={!!renderError('studentId', 'Required')}
                  helperText={renderError('studentId', 'Student ID is required')}
                  slotProps={{ htmlInput: { readOnly: true } }}
                />
              </Grid> */}
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Student Name *"
                  fullWidth
                  value={form.name}
                  onChange={handleTextChange('name')}
                  onBlur={handleBlur('name')}
                  error={!!renderError('name', 'Required')}
                  helperText={renderError('name', 'Student name is required')}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Student Email *"
                  fullWidth
                  value={form.email}
                  onChange={handleTextChange('email')}
                  onBlur={handleBlur('email')}
                  error={!!renderError('email', 'Required')}
                  helperText={renderError('email', 'Student email is required')}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Admission Number *"
                  fullWidth
                  value={form.admissionNumber}
                  onChange={handleTextChange('admissionNumber')}
                  onBlur={handleBlur('admissionNumber')}
                  error={!!renderError('admissionNumber', 'Required')}
                  helperText={renderError('admissionNumber', 'Admission number is required')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Admission Date *"
                  type="date"
                  fullWidth
                  value={form.admissionDate}
                  onChange={handleTextChange('admissionDate')}
                  onBlur={handleBlur('admissionDate')}
                  error={!!renderError('admissionDate', 'Required')}
                  helperText={renderError('admissionDate', 'Admission date is required')}
                  slotProps={{ inputLabel: { shrink: true } }}
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
                <FormControl fullWidth error={!!renderError('bloodGroup', 'Required')}>
                  <StableInputLabel>Blood Group *</StableInputLabel>
                  <Select
                    value={form.bloodGroup}
                    onChange={(e) => updateField('bloodGroup', e.target.value)}
                    onBlur={handleBlur('bloodGroup')}
                    label="Blood Group *"
                  >
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
                  label="Roll Number *"
                  fullWidth
                  value={form.rollNo}
                  onChange={handleTextChange('rollNo')}
                  onBlur={handleBlur('rollNo')}
                  error={!!renderError('rollNo', 'Required')}
                  helperText={renderError('rollNo', 'Roll number is required')}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Class *"
                  fullWidth
                  value={form.className}
                  onChange={handleTextChange('className')}
                  onBlur={handleBlur('className')}
                  error={!!renderError('className', 'Required')}
                  helperText={renderError('className', 'Class is required')}
                  placeholder="e.g. 5"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Section *"
                  fullWidth
                  value={form.section}
                  onChange={handleTextChange('section')}
                  onBlur={handleBlur('section')}
                  error={!!renderError('section', 'Required')}
                  helperText={renderError('section', 'Section is required')}
                  placeholder="e.g. A"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Age (Years)"
                  type="number"
                  fullWidth
                  value={form.age}
                  onChange={handleTextChange('age')}
                  placeholder="Optional"
                  slotProps={{ htmlInput: { min: 1, max: 25 } }}
                />
              </Grid>
            </Grid>

            {/* 2. Parent Information */}
            <SectionHeader title="2. Parent Information" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Father's Name *"
                  fullWidth
                  value={form.fatherName}
                  onChange={handleTextChange('fatherName')}
                  onBlur={handleBlur('fatherName')}
                  error={!!renderError('fatherName', 'Required')}
                  helperText={renderError('fatherName', "Father's name is required")}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Father's Phone"
                  fullWidth
                  value={form.fatherPhone}
                  onChange={handleTextChange('fatherPhone')}
                  placeholder="Optional"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Mother's Name *"
                  fullWidth
                  value={form.motherName}
                  onChange={handleTextChange('motherName')}
                  onBlur={handleBlur('motherName')}
                  error={!!renderError('motherName', 'Required')}
                  helperText={renderError('motherName', "Mother's name is required")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Mother's Phone"
                  fullWidth
                  value={form.motherPhone}
                  onChange={handleTextChange('motherPhone')}
                  placeholder="Optional"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Parent Email"
                  type="email"
                  fullWidth
                  value={form.parentEmail}
                  onChange={handleTextChange('parentEmail')}
                  placeholder="Optional"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Guardian Phone *"
                  fullWidth
                  value={form.guardianPhone}
                  onChange={handleTextChange('guardianPhone')}
                  onBlur={handleBlur('guardianPhone')}
                  error={!!renderError('guardianPhone', 'Required')}
                  helperText={renderError('guardianPhone', 'Guardian phone is required')}
                  placeholder="+91 90000 00000"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Guardian Name"
                  fullWidth
                  value={form.guardianName}
                  onChange={handleTextChange('guardianName')}
                  placeholder="If different from parent"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Guardian Relationship"
                  fullWidth
                  value={form.guardianRelationship}
                  onChange={handleTextChange('guardianRelationship')}
                  placeholder="e.g. Uncle, Grandparent"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Emergency Contact Number"
                  fullWidth
                  value={form.emergencyContact}
                  onChange={handleTextChange('emergencyContact')}
                  placeholder="Optional"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            {/* 3. Address */}
            <SectionHeader title="3. Address" />
            <Grid container spacing={2}>
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

            {/* 4. Academic Information */}
            <SectionHeader title="4. Academic Information" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <StableInputLabel>Academic Year</StableInputLabel>
                  <Select
                    value={form.academicYear}
                    onChange={(e) => updateField('academicYear', e.target.value)}
                    label="Academic Year"
                  >
                    <MenuItem value="">None</MenuItem>
                    {ACADEMIC_YEARS.map((y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                <FormControl fullWidth>
                  <StableInputLabel>Medium of Instruction</StableInputLabel>
                  <Select
                    value={form.mediumOfInstruction}
                    onChange={(e) => updateField('mediumOfInstruction', e.target.value)}
                    label="Medium of Instruction"
                  >
                    <MenuItem value="">None</MenuItem>
                    {MEDIUMS.map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <StableInputLabel>House</StableInputLabel>
                  <Select
                    value={form.house}
                    onChange={(e) => updateField('house', e.target.value)}
                    label="House"
                  >
                    <MenuItem value="">None</MenuItem>
                    {HOUSES.map((h) => (
                      <MenuItem key={h} value={h}>
                        {h}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <StableInputLabel>Student Status</StableInputLabel>
                  <Select
                    value={form.studentStatus}
                    onChange={(e) => updateField('studentStatus', e.target.value)}
                    label="Student Status"
                  >
                    {STUDENT_STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            {/* 5. Medical Information */}
            <SectionHeader title="5. Medical Information" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Height (cm)"
                  type="number"
                  fullWidth
                  value={form.heightCm}
                  onChange={handleTextChange('heightCm')}
                  placeholder="Optional"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Weight (kg)"
                  type="number"
                  fullWidth
                  value={form.weightKg}
                  onChange={handleTextChange('weightKg')}
                  placeholder="Optional"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Allergies"
                  fullWidth
                  value={form.allergies}
                  onChange={handleTextChange('allergies')}
                  placeholder="Optional"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Medical Conditions"
                  fullWidth
                  value={form.medicalConditions}
                  onChange={handleTextChange('medicalConditions')}
                  placeholder="Optional"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Doctor Name"
                  fullWidth
                  value={form.doctorName}
                  onChange={handleTextChange('doctorName')}
                  placeholder="Optional"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Emergency Medical Notes"
                  fullWidth
                  multiline
                  rows={2}
                  value={form.emergencyMedicalNotes}
                  onChange={handleTextChange('emergencyMedicalNotes')}
                  placeholder="Optional"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.disability}
                      onChange={(e) => updateField('disability', e.target.checked)}
                    />
                  }
                  label="Disability / Special Needs"
                />
              </Grid>
            </Grid>

            {/* 6. Identity Details */}
            <SectionHeader title="6. Identity Details" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Aadhaar Number *"
                  fullWidth
                  value={form.aadhaar}
                  onChange={handleTextChange('aadhaar')}
                  onBlur={handleBlur('aadhaar')}
                  error={!!renderError('aadhaar', 'Required')}
                  helperText={renderError('aadhaar', 'Aadhaar number is required')}
                  placeholder="XXXX XXXX XXXX"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Birth Certificate Number"
                  fullWidth
                  value={form.birthCertificateNumber}
                  onChange={handleTextChange('birthCertificateNumber')}
                  placeholder="Optional"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StableTextField
                  label="Passport Number"
                  fullWidth
                  value={form.passportNumber}
                  onChange={handleTextChange('passportNumber')}
                  placeholder="Optional"
                />
              </Grid>
            </Grid>

            {/* 7. Transport */}
            <SectionHeader title="7. Transport" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.transportRequired}
                      onChange={(e) => updateField('transportRequired', e.target.checked)}
                    />
                  }
                  label="Transport Required"
                />
              </Grid>

              {form.transportRequired && (
                <>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <StableTextField
                      label="Route"
                      fullWidth
                      value={form.route}
                      onChange={handleTextChange('route')}
                      placeholder="e.g. Route 5"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <StableTextField
                      label="Bus Number"
                      fullWidth
                      value={form.busNumber}
                      onChange={handleTextChange('busNumber')}
                      placeholder="e.g. BUS-102"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <StableTextField
                      label="Pickup Point"
                      fullWidth
                      value={form.pickupPoint}
                      onChange={handleTextChange('pickupPoint')}
                      placeholder="e.g. Main Gate"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!canSubmit}
          startIcon={<Plus size={18} />}
          onClick={handleSubmit}
        >
          Create Student
        </Button>
      </DialogActions>
    </Dialog>
  );
}
