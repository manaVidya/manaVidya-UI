export type PortalKey = 'public' | 'admin' | 'teacher' | 'student' | 'parent';

export interface PortalScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export const PORTAL_PALETTES: Record<PortalKey, PortalScale> = {
  public: {
    50: '#F0EEFF',
    100: '#DDD9FF',
    200: '#BDB5FF',
    300: '#9D8FFF',
    400: '#7C68FF',
    500: '#6C63FF',
    600: '#5A4FE0',
    700: '#4539C0',
    800: '#302899',
    900: '#1C1766',
  },
  admin: {
    50: '#E6FFFE',
    100: '#CCFFFE',
    200: '#99FFF9',
    300: '#5DFFF3',
    400: '#1DE9DC',
    500: '#00D4C8',
    600: '#00AAA0',
    700: '#008079',
    800: '#005550',
    900: '#002B28',
  },
  teacher: {
    50: '#FFFBEA',
    100: '#FFF3C4',
    200: '#FFE68A',
    300: '#FFD54F',
    400: '#FFC107',
    500: '#FFB300',
    600: '#FF8F00',
    700: '#E65100',
    800: '#BF360C',
    900: '#7B1900',
  },
  student: {
    50: '#E8FFF3',
    100: '#C3FFE0',
    200: '#85F5BC',
    300: '#4AE89B',
    400: '#1DD97A',
    500: '#00C85B',
    600: '#00A04A',
    700: '#007836',
    800: '#005025',
    900: '#002812',
  },
  parent: {
    50: '#FFF0F3',
    100: '#FFD6DE',
    200: '#FFADBF',
    300: '#FF84A0',
    400: '#FF6584',
    500: '#FF3D68',
    600: '#D42B55',
    700: '#A81A3E',
    800: '#7C0A28',
    900: '#500016',
  },
};

export const PORTAL_LABELS: Record<PortalKey, string> = {
  public: 'Public',
  admin: 'Admin',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
};
