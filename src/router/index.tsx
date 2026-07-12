import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { RootLayout } from '../app/RootLayout';
import { RequirePortal } from '../app/RequirePortal';
import { PublicOnlyRoute } from '../app/PublicOnlyRoute';
import { AppShellSidebar } from '../layouts/sidebar/AppShellSidebar';

const DemoPage = lazy(() => import('../pages/public/DemoPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const ProfilePage = lazy(() => import('../pages/shared/ProfilePage'));

// Admin
const AdminDashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const StudentsPage = lazy(() => import('../pages/admin/StudentsPage'));
const TeachersPage = lazy(() => import('../pages/admin/TeachersPage'));
const StaffPage = lazy(() => import('../pages/admin/StaffPage'));
const NonTeachingStaffPage = lazy(() => import('../pages/admin/NonTeachingStaffPage'));
const ClassesPage = lazy(() => import('../pages/admin/ClassesPage'));
const ClassDetailPage = lazy(() => import('../pages/admin/ClassDetailPage'));
const AdminTimetablePage = lazy(() => import('../pages/admin/TimetablePage'));
const AdminSyllabusPage = lazy(() => import('../pages/admin/SyllabusPage'));
const AdminAssignmentsPage = lazy(() => import('../pages/admin/AssignmentsPage'));
const ExamSetupPage = lazy(() => import('../pages/admin/exams/ExamSetupPage'));
const ExamTimetableBuilderPage = lazy(() => import('../pages/admin/exams/ExamTimetablePage'));
const HallTicketGeneratorPage = lazy(() => import('../pages/admin/exams/HallTicketsPage'));
const ConsolidatedResultsPage = lazy(() => import('../pages/admin/exams/ConsolidatedResultsPage'));
const AttendanceOversightPage = lazy(() => import('../pages/admin/AttendanceOversightPage'));
const AdminNotificationsPage = lazy(() => import('../pages/admin/NotificationsPage'));
const ChatbotFaqManagerPage = lazy(() => import('../pages/admin/ChatbotFaqManagerPage'));
const RbacPage = lazy(() => import('../pages/admin/RbacPage'));
const SchoolSettingsPage = lazy(() => import('../pages/admin/SchoolSettingsPage'));

// Teacher
const TeacherDashboardPage = lazy(() => import('../pages/teacher/DashboardPage'));
const MyClassPage = lazy(() => import('../pages/teacher/MyClassPage'));
const TeacherTimetablePage = lazy(() => import('../pages/teacher/TimetablePage'));
const TeacherAttendancePage = lazy(() => import('../pages/teacher/AttendancePage'));
const TeacherSyllabusPage = lazy(() => import('../pages/teacher/SyllabusPage'));
const TeacherAssignmentsPage = lazy(() => import('../pages/teacher/AssignmentsPage'));
const ResultsEntryPage = lazy(() => import('../pages/teacher/ResultsEntryPage'));
const SendNoticePage = lazy(() => import('../pages/teacher/SendNoticePage'));

// Parent
const ParentDashboardPage = lazy(() => import('../pages/parent/DashboardPage'));
const ChildProfilePage = lazy(() => import('../pages/parent/ChildProfilePage'));
const ParentIdCardPage = lazy(() => import('../pages/parent/IdCardPage'));
const ParentTimetablePage = lazy(() => import('../pages/parent/TimetablePage'));
const ParentAttendancePage = lazy(() => import('../pages/parent/AttendancePage'));
const ParentSyllabusPage = lazy(() => import('../pages/parent/SyllabusPage'));
const ParentAssignmentsPage = lazy(() => import('../pages/parent/AssignmentsPage'));
const ParentExamsPage = lazy(() => import('../pages/parent/ExamsPage'));
const ParentResultsPage = lazy(() => import('../pages/parent/ResultsPage'));
const ParentNotificationsPage = lazy(() => import('../pages/parent/NotificationsPage'));
const ParentChatbotPage = lazy(() => import('../pages/parent/ChatbotPage'));

// Student
const StudentDashboardPage = lazy(() => import('../pages/student/DashboardPage'));
const StudentTimetablePage = lazy(() => import('../pages/student/TimetablePage'));
const StudentAttendancePage = lazy(() => import('../pages/student/AttendancePage'));
const StudentSyllabusPage = lazy(() => import('../pages/student/SyllabusPage'));
const StudentAssignmentsPage = lazy(() => import('../pages/student/AssignmentsPage'));
const StudentExamsPage = lazy(() => import('../pages/student/ExamsPage'));
const StudentResultsPage = lazy(() => import('../pages/student/ResultsPage'));
const StudentIdCardPage = lazy(() => import('../pages/student/IdCardPage'));
const StudentNotificationsPage = lazy(() => import('../pages/student/NotificationsPage'));
const StudentChatbotPage = lazy(() => import('../pages/student/ChatbotPage'));

const PageLoader = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <CircularProgress sx={{ color: 'var(--portal-500)' }} size={40} />
  </Box>
);

const s = (element: ReactNode) => <Suspense fallback={<PageLoader />}>{element}</Suspense>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: s(
          <PublicOnlyRoute>
            <DemoPage />
          </PublicOnlyRoute>,
        ),
      },
      {
        path: 'login',
        element: s(
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>,
        ),
      },
      { path: 'home', element: <Navigate to="/" replace /> },
      { path: 'demo', element: <Navigate to="/" replace /> },
      {
        path: 'admin',
        element: (
          <RequirePortal portal="admin">
            <AppShellSidebar />
          </RequirePortal>
        ),
        children: [
          { index: true, element: s(<AdminDashboardPage />) },
          { path: 'profile', element: s(<ProfilePage />) },
          { path: 'students', element: s(<StudentsPage />) },
          { path: 'teachers', element: s(<TeachersPage />) },
          { path: 'staff', element: s(<StaffPage />) },
          { path: 'staff/teaching', element: s(<TeachersPage />) },
          { path: 'staff/non-teaching', element: s(<NonTeachingStaffPage />) },
          { path: 'classes', element: s(<ClassesPage />) },
          { path: 'classes/:id', element: s(<ClassDetailPage />) },
          { path: 'timetable', element: s(<AdminTimetablePage />) },
          { path: 'syllabus', element: s(<AdminSyllabusPage />) },
          { path: 'assignments', element: s(<AdminAssignmentsPage />) },
          { path: 'exams/setup', element: s(<ExamSetupPage />) },
          { path: 'exams/timetable', element: s(<ExamTimetableBuilderPage />) },
          { path: 'exams/hall-tickets', element: s(<HallTicketGeneratorPage />) },
          { path: 'exams/results', element: s(<ConsolidatedResultsPage />) },
          { path: 'attendance', element: s(<AttendanceOversightPage />) },
          { path: 'notifications', element: s(<AdminNotificationsPage />) },
          { path: 'chatbot', element: s(<ChatbotFaqManagerPage />) },
          { path: 'rbac', element: s(<RbacPage />) },
          { path: 'settings', element: s(<SchoolSettingsPage />) },
        ],
      },
      {
        path: 'teacher',
        element: (
          <RequirePortal portal="teacher">
            <AppShellSidebar />
          </RequirePortal>
        ),
        children: [
          { index: true, element: s(<TeacherDashboardPage />) },
          { path: 'profile', element: s(<ProfilePage />) },
          { path: 'class', element: s(<MyClassPage />) },
          { path: 'timetable', element: s(<TeacherTimetablePage />) },
          { path: 'attendance', element: s(<TeacherAttendancePage />) },
          { path: 'syllabus', element: s(<TeacherSyllabusPage />) },
          { path: 'assignments', element: s(<TeacherAssignmentsPage />) },
          { path: 'results', element: s(<ResultsEntryPage />) },
          { path: 'notices', element: s(<SendNoticePage />) },
        ],
      },
      {
        path: 'parent',
        element: (
          <RequirePortal portal="parent">
            <AppShellSidebar />
          </RequirePortal>
        ),
        children: [
          { index: true, element: s(<ParentDashboardPage />) },
          { path: 'profile', element: s(<ProfilePage />) },
          { path: 'child', element: s(<ChildProfilePage />) },
          { path: 'id-card', element: s(<ParentIdCardPage />) },
          { path: 'timetable', element: s(<ParentTimetablePage />) },
          { path: 'attendance', element: s(<ParentAttendancePage />) },
          { path: 'syllabus', element: s(<ParentSyllabusPage />) },
          { path: 'assignments', element: s(<ParentAssignmentsPage />) },
          { path: 'exams', element: s(<ParentExamsPage />) },
          { path: 'results', element: s(<ParentResultsPage />) },
          { path: 'notifications', element: s(<ParentNotificationsPage />) },
          { path: 'chatbot', element: s(<ParentChatbotPage />) },
          { path: 'settings', element: s(<ProfilePage />) },
        ],
      },
      {
        path: 'student',
        element: (
          <RequirePortal portal="student">
            <AppShellSidebar />
          </RequirePortal>
        ),
        children: [
          { index: true, element: s(<StudentDashboardPage />) },
          { path: 'profile', element: s(<ProfilePage />) },
          { path: 'timetable', element: s(<StudentTimetablePage />) },
          { path: 'attendance', element: s(<StudentAttendancePage />) },
          { path: 'syllabus', element: s(<StudentSyllabusPage />) },
          { path: 'assignments', element: s(<StudentAssignmentsPage />) },
          { path: 'exams', element: s(<StudentExamsPage />) },
          { path: 'results', element: s(<StudentResultsPage />) },
          { path: 'id-card', element: s(<StudentIdCardPage />) },
          { path: 'notifications', element: s(<StudentNotificationsPage />) },
          { path: 'chatbot', element: s(<StudentChatbotPage />) },
        ],
      },
      { path: '*', element: s(<NotFoundPage />) },
    ],
  },
]);

export default router;
