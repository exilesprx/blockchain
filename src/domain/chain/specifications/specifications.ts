import Block from '../block';

export default interface Specification
{
    isSatisfiedBy(prevous: Block, current: Block): boolean;
};
