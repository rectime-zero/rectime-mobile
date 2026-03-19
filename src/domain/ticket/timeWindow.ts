const STEP_SECONDS = 30;

export function getRemainingSeconds(timestamp: number = Date.now()): number {
    const elapsedSeconds = Math.floor(timestamp / 1000) % STEP_SECONDS;

    return elapsedSeconds === 0 ? STEP_SECONDS : STEP_SECONDS - elapsedSeconds;
}
