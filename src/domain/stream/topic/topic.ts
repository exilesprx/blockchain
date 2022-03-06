export default class Topic
{
    private name: string;

    private constructor(name: string)
    {
        this.name = name;
    }

    public static new(name: string) : Topic
    {
        return new this(name);
    }

    public toString() : string
    {
        return this.name;
    }
}