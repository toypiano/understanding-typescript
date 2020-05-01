import { Draggable } from '../models/drag-drop.js'; // add .js to import it as JS file
import { Component } from './base-component.js';
import { Project } from '../models/project.js';
import { autobind } from '../decorators/autobind.js';

/**
 * Creates list item to append to the ul element
 */
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  // work with Project type since it has all the properties we need
  private project: Project;
  // set up your getter/setters below other class fields
  get persons() {
    if (this.project.people === 1) {
      return '1 person';
    } else {
      return `${this.project.people} people`;
    }
  }

  // hostElement is dynamically generated from ProjectList so we can't hard-code it.
  constructor(hostId: string, project: Project) {
    // we could've just create li instead of importing it from a template
    // since it's a single item without any nesting elements,
    // but to use the base class, Component, you have to work with a template
    // (and we ended up nesting more structures within the template)
    super('single-project', hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }
  @autobind
  handleDragStart(e: DragEvent) {
    // We can transfer id and fetch the actual project from the state
    e.dataTransfer!.setData('text/plain', this.project.id);
    // data being dragged will be moved (not copied | linked)
    e.dataTransfer!.effectAllowed = 'move';
  }
  handleDragEnd(_: DragEvent) {
    console.log('dragend');
  }

  configure() {
    this.element.addEventListener('dragstart', this.handleDragStart);
    this.element.addEventListener('dragend', this.handleDragEnd);
  }
  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    // use getter just like regular property
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}
