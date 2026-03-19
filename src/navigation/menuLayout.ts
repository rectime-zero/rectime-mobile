export const MENU_SHIFT_RATIO = 0.82;
export const MENU_SHIFT_MIN = 280;
export const MENU_SHIFT_MAX = 380;

export function getMenuRevealWidth(screenWidth: number) {
    return Math.min(Math.max(screenWidth * MENU_SHIFT_RATIO, MENU_SHIFT_MIN), MENU_SHIFT_MAX);
}
