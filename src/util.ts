export const Util = {
    sleep: (seconds: number) => new Promise((resolve => setTimeout(resolve, seconds * 1000)))
}