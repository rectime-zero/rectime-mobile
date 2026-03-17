export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 18,
    xxl: 20,
    section: 28,
} as const;

export const radius = {
    sm: 12,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 24,
    capsule: 999,
} as const;

export const size = {
    headerAction: 44,
    sheetHandleWidth: 56,
    sheetHandleHeight: 8,
    bottomTabMinHeight: 54,
} as const;

export const screenLayout = {
    horizontalPadding: spacing.xl,
    headerGap: spacing.md,
    headerPaddingTop: spacing.sm,
    headerPaddingBottom: spacing.md,
    contentGap: 14,
    contentPaddingBottom: spacing.section,
    rootBottomNavigationInset: 112,
} as const;

export const bottomNavigationLayout = {
    horizontalPadding: 10,
    paddingTop: 3,
    minBottomInset: 14,
    labelGap: 6,
} as const;

export const sheetLayout = {
    topInsetOffset: spacing.md,
    horizontalPadding: spacing.xxl,
    paddingTop: spacing.md,
    minBottomInset: spacing.xl,
    handleMarginBottom: spacing.lg,
} as const;

export const sideMenuLayout = {
    horizontalPadding: 30,
    paddingBottom: 33,
} as const;
