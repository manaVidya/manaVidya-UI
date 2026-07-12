import type { ElementType } from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  CalendarClock,
  BookOpen,
  ClipboardList,
  Award,
  CalendarCheck,
  Bell,
  MessageCircleQuestion,
  ShieldCheck,
  Settings,
  UserCircle,
  IdCard,
  FileCheck2,
  Send,
  Inbox,
  FileBadge2,
} from 'lucide-react';
import type { PortalKey } from '../types/rbac';

export interface NavLeaf {
  kind: 'item';
  to: string;
  label: string;
  icon: ElementType;
  rbacKey?: string;
  badgeKey?: string;
}

export interface NavAccordionGroup {
  kind: 'accordion';
  label: string;
  icon: ElementType;
  rbacKey?: string;
  children: NavLeaf[];
}

export type NavEntry = NavLeaf | NavAccordionGroup;

export interface NavSectionConfig {
  label: string;
  items: NavEntry[];
}

export const NAVIGATION_CONFIG: Record<PortalKey, NavSectionConfig[]> = {
  admin: [
    {
      label: 'Core',
      items: [
        { kind: 'item', to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        {
          kind: 'item',
          to: '/admin/students',
          label: 'Students',
          icon: GraduationCap,
          rbacKey: 'student.manage',
        },
        {
          kind: 'item',
          to: '/admin/staff',
          label: 'Staff',
          icon: Users,
          rbacKey: 'teacher.manage',
        },
        {
          kind: 'item',
          to: '/admin/classes',
          label: 'Classes & Sections',
          icon: School,
          rbacKey: 'class.manage',
        },
      ],
    },
    {
      label: 'Academic',
      items: [
        {
          kind: 'item',
          to: '/admin/timetable',
          label: 'Timetable',
          icon: CalendarClock,
          rbacKey: 'timetable.manage',
        },
        {
          kind: 'item',
          to: '/admin/syllabus',
          label: 'Syllabus',
          icon: BookOpen,
          rbacKey: 'syllabus.manage',
        },
        {
          kind: 'item',
          to: '/admin/assignments',
          label: 'Assignments',
          icon: ClipboardList,
          rbacKey: 'assignment.oversight',
        },
        {
          kind: 'accordion',
          label: 'Exams & Results',
          icon: Award,
          rbacKey: 'exam.manage',
          children: [
            {
              kind: 'item',
              to: '/admin/exams/setup',
              label: 'Exam / Term Setup',
              icon: Award,
              rbacKey: 'exam.manage',
            },
            {
              kind: 'item',
              to: '/admin/exams/timetable',
              label: 'Exam Timetable Builder',
              icon: CalendarClock,
              rbacKey: 'exam.manage',
            },
            {
              kind: 'item',
              to: '/admin/exams/hall-tickets',
              label: 'Hall Ticket Generator',
              icon: FileBadge2,
              rbacKey: 'hall_ticket.generate',
            },
            {
              kind: 'item',
              to: '/admin/exams/results',
              label: 'Consolidated Results',
              icon: FileCheck2,
              rbacKey: 'results.publish',
            },
          ],
        },
        {
          kind: 'item',
          to: '/admin/attendance',
          label: 'Attendance Oversight',
          icon: CalendarCheck,
          rbacKey: 'attendance.view_all',
        },
      ],
    },
    {
      label: 'Engagement',
      items: [
        {
          kind: 'item',
          to: '/admin/notifications',
          label: 'Notification Center',
          icon: Bell,
          rbacKey: 'notification.send_all',
        },
        {
          kind: 'item',
          to: '/admin/chatbot',
          label: 'Chatbot FAQ Manager',
          icon: MessageCircleQuestion,
          rbacKey: 'chatbot.manage',
        },
      ],
    },
    {
      label: 'System',
      items: [
        {
          kind: 'item',
          to: '/admin/rbac',
          label: 'Roles & Permissions',
          icon: ShieldCheck,
          rbacKey: 'rbac.manage',
        },
        {
          kind: 'item',
          to: '/admin/settings',
          label: 'School Settings',
          icon: Settings,
          rbacKey: 'settings.global',
        },
      ],
    },
  ],
  teacher: [
    {
      label: 'Core',
      items: [
        { kind: 'item', to: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
        { kind: 'item', to: '/teacher/class', label: 'My Class & Students', icon: GraduationCap },
        { kind: 'item', to: '/teacher/timetable', label: 'My Timetable', icon: CalendarClock },
      ],
    },
    {
      label: 'Academic',
      items: [
        {
          kind: 'item',
          to: '/teacher/attendance',
          label: 'Attendance',
          icon: CalendarCheck,
          rbacKey: 'attendance.mark',
        },
        {
          kind: 'item',
          to: '/teacher/syllabus',
          label: 'Syllabus Tracker',
          icon: BookOpen,
          rbacKey: 'syllabus.edit_own',
        },
        {
          kind: 'item',
          to: '/teacher/assignments',
          label: 'Assignments',
          icon: ClipboardList,
          rbacKey: 'assignment.create',
        },
        {
          kind: 'item',
          to: '/teacher/results',
          label: 'Results Entry',
          icon: FileCheck2,
          rbacKey: 'results.enter',
        },
      ],
    },
    {
      label: 'Engagement',
      items: [
        {
          kind: 'item',
          to: '/teacher/notices',
          label: 'Send Notice',
          icon: Send,
          rbacKey: 'notification.send_own_class',
        },
        { kind: 'item', to: '/teacher/profile', label: 'Profile', icon: UserCircle },
      ],
    },
  ],
  parent: [
    {
      label: 'Core',
      items: [
        { kind: 'item', to: '/parent', label: 'Dashboard', icon: LayoutDashboard },
        { kind: 'item', to: '/parent/child', label: 'Child Profile', icon: UserCircle },
        { kind: 'item', to: '/parent/id-card', label: 'ID Card', icon: IdCard },
      ],
    },
    {
      label: 'Academic',
      items: [
        { kind: 'item', to: '/parent/timetable', label: 'Timetable', icon: CalendarClock },
        {
          kind: 'item',
          to: '/parent/attendance',
          label: 'Attendance Calendar',
          icon: CalendarCheck,
        },
        { kind: 'item', to: '/parent/syllabus', label: 'Syllabus', icon: BookOpen },
        { kind: 'item', to: '/parent/assignments', label: 'Assignments', icon: ClipboardList },
        {
          kind: 'item',
          to: '/parent/exams',
          label: 'Exam Timetable & Hall Ticket',
          icon: FileBadge2,
        },
        { kind: 'item', to: '/parent/results', label: 'Results / Report Card', icon: FileCheck2 },
      ],
    },
    {
      label: 'Engagement',
      items: [
        { kind: 'item', to: '/parent/notifications', label: 'Notifications', icon: Inbox },
        {
          kind: 'item',
          to: '/parent/chatbot',
          label: 'Chatbot Support',
          icon: MessageCircleQuestion,
        },
        { kind: 'item', to: '/parent/settings', label: 'Profile & Settings', icon: Settings },
      ],
    },
  ],
  student: [
    {
      label: 'Core',
      items: [
        { kind: 'item', to: '/student', label: 'Dashboard', icon: LayoutDashboard },
        { kind: 'item', to: '/student/profile', label: 'My Profile', icon: UserCircle },
        { kind: 'item', to: '/student/timetable', label: 'My Timetable', icon: CalendarClock },
      ],
    },
    {
      label: 'Academic',
      items: [
        { kind: 'item', to: '/student/attendance', label: 'My Attendance', icon: CalendarCheck },
        { kind: 'item', to: '/student/syllabus', label: 'My Syllabus', icon: BookOpen },
        {
          kind: 'item',
          to: '/student/assignments',
          label: 'Assignments',
          icon: ClipboardList,
          badgeKey: 'pendingAssignments',
        },
        { kind: 'item', to: '/student/exams', label: 'Exams & Hall Ticket', icon: FileBadge2 },
        { kind: 'item', to: '/student/results', label: 'My Results', icon: FileCheck2 },
      ],
    },
    {
      label: 'More',
      items: [
        { kind: 'item', to: '/student/id-card', label: 'ID Card', icon: IdCard },
        { kind: 'item', to: '/student/notifications', label: 'Notifications', icon: Inbox },
        {
          kind: 'item',
          to: '/student/chatbot',
          label: 'Chatbot Support',
          icon: MessageCircleQuestion,
        },
      ],
    },
  ],
};
