/**
 * Global Age Logic Helper
 * Pure, deterministic, worklet-safe.
 */

export type AgeGroup = 'kid' | 'teen' | 'student' | 'professional' | 'senior';

export interface AgeMeta {
    group: AgeGroup;
    groupIndex: number; // Stable ordering 0-4
    iconName: string; // MaterialIcons name
    color: string;
    label: string;
}

const GROUPS: AgeMeta[] = [
    { group: 'kid', groupIndex: 0, iconName: 'seed', color: '#22c55e', label: 'KID' },
    { group: 'teen', groupIndex: 1, iconName: 'sprout', color: '#f59e0b', label: 'TEEN' },
    { group: 'student', groupIndex: 2, iconName: 'tree-outline', color: '#3b82f6', label: 'STUDENT' },
    { group: 'professional', groupIndex: 3, iconName: 'tree', color: '#6366f1', label: 'PROFESSIONAL' },
    { group: 'senior', groupIndex: 4, iconName: 'pine-tree', color: '#a855f7', label: 'SENIOR' },
];

export const getAgeMeta = (age: number): AgeMeta => {
    'worklet';
    if (age <= 12) return GROUPS[0];
    if (age <= 18) return GROUPS[1];
    if (age <= 25) return GROUPS[2];
    if (age <= 60) return GROUPS[3];
    return GROUPS[4];
};

export const AGE_GROUPS = GROUPS;

export const ITEM_WIDTH = 100;
