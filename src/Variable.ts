/**
 * A key-value pair of an environment variable.
 */
class Variable {
    public constructor(public key: string, public value: string, public sensitive: boolean = false) {}

    public toJSON(): object {
        return {
            key: this.key,
            value: this.sensitive ? '*REDACTED*' : this.value,
        };
    }
}

export { Variable };
