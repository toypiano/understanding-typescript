import { Component } from './base-component.js';
import { DragTarget } from '../models/drag-drop';
import { Project, ProjectStatus } from '../models/project.js';
import { autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
import { ProjectItem } from './project-item.js';

export class ProjectList extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget {
  // property specific to this class
  assignedProjects: Project[];
  // ts constructor shorthand
  // not using ProjectStatus enum since we need this for string literal
  constructor(private type: 'active' | 'completed') {
    super('project-list', 'app', false, `project--${type}`); // can't use this before super
    this.assignedProjects = [];
    // not calling these in the base class because
    // we might need to setup some dependencies after super()
    this.configure();
    this.renderContent();
  }
  @autobind
  handleDragOver(e: DragEvent) {
    // default for 'dragover' event is to prevent firing 'drop' event
    e.preventDefault();
    // make it droppable only if event contains dataTransfer AND
    // the first allowed type is 'text/plain'
    if (e.dataTransfer && e.dataTransfer.types[0] === 'text/plain') {
      // using 'this' inside handler? BIND IT!
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }
  @autobind
  handleDrop(e: DragEvent) {
    // if you check event in a console, you won't find dataTransfer property
    // because it gets cleared right after the event is fired
    console.log(e.dataTransfer!.getData('text/plain'));
    const projectId = e.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      projectId,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Completed
    );
  }

  @autobind
  handleDragLeave() {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  /**
   * Listen to global state. When new project is added,
   * store filtered projects locally and render them.
   */
  configure() {
    this.element.addEventListener('dragover', this.handleDragOver);
    this.element.addEventListener('dragleave', this.handleDragLeave);
    this.element.addEventListener('drop', this.handleDrop);
    // add listener: cb will be passed projects from state
    projectState.addListener((projects: Project[]) => {
      // callback will be called when new project is added to the state instance

      const filteredProjects = projects.filter((project) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Completed;
      });
      this.assignedProjects = filteredProjects; // store state into local property to share across methods
      this.renderProjects();
    });
  }

  /**
   * Add header text and attach id to ul element
   */
  renderContent() {
    // this runs when ProjectList instantiates.
    // abstract private method is not available in ts
    const listId = `project-list--${this.type}`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  /**
   * Empty list element and append new list items from locally stored projects
   */
  private renderProjects() {
    // this will run when new project is added to the state
    const ulElement = document.getElementById(
      `project-list--${this.type}`
    )! as HTMLUListElement;
    // We could've diff DOM and only render difference but
    // they are expensive operations for this application.
    ulElement.innerHTML = '';
    for (const projectItem of this.assignedProjects) {
      // this.element is the section element
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
    }
  }
}
