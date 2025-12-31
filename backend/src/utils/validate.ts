export function validateMessage(input: unknown): string {
    if (typeof input !== 'string') {
        throw new Error("Message must be a string")
    }
    const message = input.trim()

    if (!message) {
        throw new Error("Message cannot be empty")
    }

    if (message.length > 1000) {
        return message.slice(0, 1000)
    }
    return message
}