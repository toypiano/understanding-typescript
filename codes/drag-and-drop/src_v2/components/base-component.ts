/**
 * Import an element from template, [add id/class], and attach it to the host Element
 * @template T - Element imported from template to be attached to DOM
 * @template U - Host element in DOM to attach imported element to
 */
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  element: T;
  hostElement: U;
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string,
    newElementClass?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.element = document.importNode(this.templateElement.content, true)
      .firstElementChild! as T;
    this.hostElement = document.getElementById(hostElementId)! as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    if (newElementClass) {
      this.element.classList.add(newElementClass);
    }
    this.attach(insertAtStart);
  }
  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  /**
   * anything you need to do before rendering
   */
  abstract configure(): void;
  /**
   * Insert contents into imported template
   */
  abstract renderContent(): void;
}
