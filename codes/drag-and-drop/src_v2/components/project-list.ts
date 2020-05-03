import { Component } from './base-component';
import { ProjectItem } from './project-item';
import { ProjectStatus, Project } from '../models/project';
import { DragTarget } from '../models/drag-drop';
import { state } from '../state/project-state';
import { autobind } from '../decorators/autobind';

export class ProjectList extends Component<HTMLElement, HTMLDivElement>
  implements DragTarget {
  assignedProjects: Project[];
  constructor(private type: ProjectStatus) {
    super(
      'project-list',
      'app',
      false,
      undefined,
      `project--${type === ProjectStatus.Active ? 'active' : 'completed'}`
    );
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }
  configure() {
    state.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter((p) => p.status === this.type);
      this.renderProjects();
    });
    this.element.addEventListener('dragover', this.handleDragOver);
    this.element.addEventListener('drop', this.handleDrop);
    this.element.addEventListener('dragleave', this.handleDragLeave);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent =
      (this.type === ProjectStatus.Active
        ? 'active'
        : 'completed'
      ).toUpperCase() + ' PROJECT';
  }
  @autobind
  handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.types[0] === 'text/plain') {
      this.element.querySelector('ul')!.classList.add('droppable');
    }
  }

  @autobind
  handleDrop(e: DragEvent) {
    const projectId = e.dataTransfer!.getData('text/plain');
    state.moveProject(projectId, this.type);
  }

  @autobind
  handleDragLeave() {
    this.element.querySelector('ul')!.classList.remove('droppable');
  }

  private renderProjects() {
    const ulElement = this.element.querySelector('ul')! as HTMLUListElement;
    ulElement.innerHTML = '';
    ulElement.id = `${`projects--${
      this.type === ProjectStatus.Active ? 'active' : 'completed'
    }`}`;
    for (const project of this.assignedProjects) {
      new ProjectItem(ulElement.id, project);
    }
  }
}
