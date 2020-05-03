import { Component } from './base-component';
import { Project } from '../models/project';
import { Draggable } from '../models/drag-drop';
import { autobind } from '../decorators/autobind';

export class ProjectItem extends Component<HTMLLIElement, HTMLUListElement>
  implements Draggable {
  private project: Project;
  get persons() {
    if (this.project.people === 1) {
      return '1 person';
    } else {
      return `${this.project.people} people`;
    }
  }
  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;
    this.renderContent();
    this.configure();
  }
  configure() {
    this.element.addEventListener('dragstart', this.handleDragStart);
    this.element.addEventListener('dragend', this.handleDragEnd);
  }
  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent =
      this.project.people + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
  @autobind
  handleDragStart(e: DragEvent) {
    console.log('dragstart');
    e.dataTransfer!.setData('text/plain', this.project.id);
    e.dataTransfer!.effectAllowed = 'move';
  }

  @autobind
  handleDragEnd() {
    console.log('dragend');
  }
}
