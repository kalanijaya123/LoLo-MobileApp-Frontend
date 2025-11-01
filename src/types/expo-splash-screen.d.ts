// Temporary declaration to satisfy TypeScript when 'expo-splash-screen' types are not present.
// Prefer installing the real package types by running: `expo install expo-splash-screen`
declare module 'expo-splash-screen' {
    export function preventAutoHideAsync(): Promise<void>;
    export function hideAsync(): Promise<void>;
    export function preventAutoHide(): void;
    export function hide(): void;
    // Fallback catch-all for any other named exports
    const _default: any;
    export default _default;
}
