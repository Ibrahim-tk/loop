'use client';

/**
 * Admin icon set, drawn with Hugeicons (stroke-rounded).
 * Exported under the old lucide names so call sites stay `<Icon className="h-4 w-4" />`.
 */
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
    Add01Icon, Alert02Icon, AlertCircleIcon, ArrowLeft01Icon, ArrowLeft02Icon, Building03Icon, Calendar03Icon,
    CallIcon, Cancel01Icon, ChartIncreaseIcon, CheckmarkCircle02Icon, Clock01Icon, ComputerIcon, Copy01Icon,
    DashboardSquare01Icon, Delete02Icon, DollarCircleIcon, FloppyDiskIcon, Home01Icon, Image01Icon,
    Link01Icon, LinkSquare02Icon, Loading03Icon, LockIcon, Logout01Icon, Mail01Icon, Megaphone01Icon, Menu01Icon,
    Message01Icon, Moon02Icon, Notification01Icon, PaintBoardIcon, PencilEdit02Icon, Search01Icon,
    Settings02Icon, StarIcon, Sun03Icon, Tick02Icon, TickDouble02Icon, Upload04Icon, UserIcon, ViewIcon,
} from '@hugeicons/core-free-icons';

export interface AdminIconProps {
    className?: string;
    strokeWidth?: number;
    'aria-hidden'?: boolean;
}
export type LucideIcon = React.ComponentType<AdminIconProps>;

function make(icon: IconSvgElement, name: string): LucideIcon {
    const C = ({ className, strokeWidth = 1.75, ...rest }: AdminIconProps) => (
        <HugeiconsIcon icon={icon} size={24} strokeWidth={strokeWidth} className={className} {...rest} />
    );
    C.displayName = name;
    return C;
}

export const AlertTriangle = make(Alert02Icon, 'AlertTriangle');
export const AlertCircle = make(AlertCircleIcon, 'AlertCircle');
export const ArrowLeft = make(ArrowLeft02Icon, 'ArrowLeft');
export const Bell = make(Notification01Icon, 'Bell');
export const Building = make(Building03Icon, 'Building');
export const Calendar = make(Calendar03Icon, 'Calendar');
export const CalendarClock = make(Calendar03Icon, 'CalendarClock');
export const Check = make(Tick02Icon, 'Check');
export const CheckCheck = make(TickDouble02Icon, 'CheckCheck');
export const CheckCircle2 = make(CheckmarkCircle02Icon, 'CheckCircle2');
export const ChevronLeft = make(ArrowLeft01Icon, 'ChevronLeft');
export const Clock = make(Clock01Icon, 'Clock');
export const Copy = make(Copy01Icon, 'Copy');
export const DollarSign = make(DollarCircleIcon, 'DollarSign');
export const ExternalLink = make(LinkSquare02Icon, 'ExternalLink');
export const Eye = make(ViewIcon, 'Eye');
export const Home = make(Home01Icon, 'Home');
export const ImageIcon = make(Image01Icon, 'ImageIcon');
export const LayoutDashboard = make(DashboardSquare01Icon, 'LayoutDashboard');
export const Link2 = make(Link01Icon, 'Link2');
export const Loader2 = make(Loading03Icon, 'Loader2');
export const Lock = make(LockIcon, 'Lock');
export const LogOut = make(Logout01Icon, 'LogOut');
export const Mail = make(Mail01Icon, 'Mail');
export const Megaphone = make(Megaphone01Icon, 'Megaphone');
export const Menu = make(Menu01Icon, 'Menu');
export const MessageSquare = make(Message01Icon, 'MessageSquare');
export const Monitor = make(ComputerIcon, 'Monitor');
export const Moon = make(Moon02Icon, 'Moon');
export const Palette = make(PaintBoardIcon, 'Palette');
export const Pencil = make(PencilEdit02Icon, 'Pencil');
export const Phone = make(CallIcon, 'Phone');
export const Plus = make(Add01Icon, 'Plus');
export const Save = make(FloppyDiskIcon, 'Save');
export const Search = make(Search01Icon, 'Search');
export const Settings = make(Settings02Icon, 'Settings');
export const Star = make(StarIcon, 'Star');
export const Sun = make(Sun03Icon, 'Sun');
export const Trash2 = make(Delete02Icon, 'Trash2');
export const TrendingUp = make(ChartIncreaseIcon, 'TrendingUp');
export const Upload = make(Upload04Icon, 'Upload');
export const User = make(UserIcon, 'User');
export const X = make(Cancel01Icon, 'X');
