namespace App {
  /* Decorators - enable "experimentalDecorators" in tsconfig.json */

  // using underscore as argument name suppresses "noUnused" warnings
  export function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const decoratedMethod = descriptor.value;
    const updatedDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        const boundFn = decoratedMethod.bind(this);
        return boundFn;
      },
    };
    return updatedDescriptor;
  }
}
