import { LuLayoutDashboard } from 'react-icons/lu';
import { IoPeopleOutline } from 'react-icons/io5';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { TbLogs } from 'react-icons/tb';
import { AiOutlineMessage } from 'react-icons/ai';

type SidebarItem = {
  icon: IconType;
  title: string;
  subLinks?: { title: string; path: string }[];
  path?: string;
};

export const SidebarItems: SidebarItem[] = [
  { icon: LuLayoutDashboard, title: 'Dashboard', path: '/dashboard' },
  { icon: IoPeopleOutline, title: 'Tenants', path: '/tenants' },
  { icon: AiOutlineMessage, title: 'Inbox', path: '/inbox' },

  {
    icon: HiOutlineDocumentReport,
    title: 'Reports',
    subLinks: [
      { title: 'General', path: '/reports' },
      { title: 'Monthly Billing', path: '/reports/monthly-bill' },
      { title: 'Payments', path: '/reports/payment' },
    ],
  },
  { icon: TbLogs, title: 'Activity Logs', path: '/activity-logs' },
];

import { GoPeople } from 'react-icons/go';
import { MdMoneyOff, MdOutlineReportOff } from 'react-icons/md';
import { IconType } from 'react-icons';

export const SummaryBox = [
  {
    icon1: GoPeople,
    title: 'Total Tenants',
    percentage: 0,
    count: 97,
  },
  {
    icon1: MdOutlineReportOff,
    title: 'Unpaid Tenants',
    percentage: -2.02,
    count: 7,
  },
  {
    icon1: MdMoneyOff,
    title: 'Unpaid Bills',
    percentage: 13.1,
    count: 14920,
  },
];
