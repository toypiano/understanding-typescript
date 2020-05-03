export function autobind(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const decoratedMethod = descriptor.value;
  const updatedDescriptor = {
    configurable: true,
    get() {
      return decoratedMethod.bind(this);
    },
  };
  return updatedDescriptor;
}
