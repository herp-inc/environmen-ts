abstract class Log {
    public abstract readonly message: string;
    public abstract readonly key: string;
    public abstract readonly found: boolean;
}

export { Log };
