namespace App {
  // Component Base Class
  // abstract classes can never be instantiated but can only be extended
  /**
   * Import an element from HTML template, add a className/id to it, then attach it to the host DOM element
   * @template T - Host DOM element to render U to
   * @template U - Element imported from HTML template.
   */
  export abstract class Component<
    T extends HTMLElement,
    U extends HTMLElement
  > {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementClass?: string, // optional paramter must come at the end
      newElementId?: string
    ) {
      // "import" DOM node from template and configure
      this.templateElement = document.getElementById(
        templateId
      )! as HTMLTemplateElement;
      // get host element DOM node
      this.hostElement = document.getElementById(hostElementId)! as T;

      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.element = importedNode.firstElementChild as U;
      if (newElementClass) {
        this.element.classList.add(newElementClass);
      }
      if (newElementId) {
        this.element.id = newElementId;
      }

      // attach imported element to the host element
      this.attach(insertAtStart);
    }
    private attach(insertAtBeginning: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtBeginning ? 'afterbegin' : 'beforeend',
        this.element
      );
    }
    // enforce child class to implement abstract methods
    abstract configure(): void;
    // Add additional contents to the imported template
    abstract renderContent(): void;
    // you cannot have private abstract class
  }
}
