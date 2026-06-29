export const UserBottomNavigationItem = Object.freeze({
    PATTERNS: 'patterns',
    COMMUNITY: 'community',
    TUTORIALS: 'tutorials',
    PROFILE: 'profile',
} as const);

export const AdminBottomNavigationItem = Object.freeze({
    USERS: 'users',
    COMMUNITY_MANAGEMENT: 'communityManagement',
    TUTORIAL_MANAGEMENT: 'tutorialManagement',
    PROFILE: 'profile',
} as const);

export type UserBottomNavigationItemId =
    typeof UserBottomNavigationItem[keyof typeof UserBottomNavigationItem];

export type AdminBottomNavigationItemId =
    typeof AdminBottomNavigationItem[keyof typeof AdminBottomNavigationItem];
